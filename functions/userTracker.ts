import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("google_analytics");

    const apps = [
      { name: "The Legacy Circle", measurementId: "G-HEWR0ZB5G8" },
      { name: "OurSpace 2.0", measurementId: "G-1N8GD2WM6L" },
    ];

    const today = new Date();
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    const todayStr = fmt(today);

    // Get property map
    const accountsRes = await fetch(
      "https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=50",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const accountsData = await accountsRes.json();
    const propertyMap: Record<string, string> = {};

    if (accountsData.accountSummaries) {
      for (const account of accountsData.accountSummaries) {
        for (const prop of (account.propertySummaries || [])) {
          const streamsRes = await fetch(
            `https://analyticsadmin.googleapis.com/v1beta/${prop.property}/dataStreams`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const streamsData = await streamsRes.json();
          for (const stream of (streamsData.dataStreams || [])) {
            if (stream.webStreamData?.measurementId) {
              propertyMap[stream.webStreamData.measurementId] = prop.property.replace("properties/", "");
            }
          }
        }
      }
    }

    const results = [];

    for (const app of apps) {
      const propertyId = propertyMap[app.measurementId];
      if (!propertyId) {
        results.push({ platform: app.name, status: "no_data", new_users: 0, total_users: 0, sessions: 0, page_views: 0 });
        continue;
      }

      // Today's stats
      const todayRes = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            dateRanges: [{ startDate: todayStr, endDate: todayStr }],
            metrics: [
              { name: "newUsers" },
              { name: "activeUsers" },
              { name: "sessions" },
              { name: "screenPageViews" },
            ],
          }),
        }
      );
      const todayData = await todayRes.json();

      // All time totals
      const allTimeRes = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            dateRanges: [{ startDate: "2020-01-01", endDate: todayStr }],
            metrics: [
              { name: "totalUsers" },
              { name: "sessions" },
              { name: "screenPageViews" },
            ],
          }),
        }
      );
      const allTimeData = await allTimeRes.json();

      const todayRow = todayData?.rows?.[0];
      const allTimeRow = allTimeData?.rows?.[0];

      const newUsers = parseInt(todayRow?.metricValues?.[0]?.value || "0");
      const activeUsers = parseInt(todayRow?.metricValues?.[1]?.value || "0");
      const sessions = parseInt(todayRow?.metricValues?.[2]?.value || "0");
      const pageViews = parseInt(todayRow?.metricValues?.[3]?.value || "0");
      const totalUsers = parseInt(allTimeRow?.metricValues?.[0]?.value || "0");

      // Save to UserTracker entity
      try {
        await base44.asServiceRole.entities.UserTracker.create({
          date: todayStr,
          platform: app.name,
          new_users: newUsers,
          total_users: totalUsers,
          sessions: sessions,
          page_views: pageViews,
          source: "Direct",
          notes: `Auto-synced from GA4 on ${todayStr}`,
        });
      } catch (_) {}

      results.push({
        platform: app.name,
        date: todayStr,
        new_users: newUsers,
        active_users: activeUsers,
        total_users: totalUsers,
        sessions,
        page_views: pageViews,
        status: "ok",
      });
    }

    return Response.json({ success: true, date: todayStr, results });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
});
