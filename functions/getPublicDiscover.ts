import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body  = await req.json().catch(() => ({}));
    const query = (body.query || "").toLowerCase().trim();
    const limit = Math.min(body.limit || 50, 100);
    const skip  = body.skip || 0;

    // Paginated service-role queries — scales to 10k+ users
    const [profiles, posts] = await Promise.all([
      base44.asServiceRole.entities.Profile.list("-created_date", limit, skip),
      base44.asServiceRole.entities.Post.list("-created_date", 50, 0),
    ]);

    const filteredProfiles = query
      ? (profiles || []).filter(p =>
          p.display_name?.toLowerCase().includes(query) ||
          p.headline?.toLowerCase().includes(query) ||
          (Array.isArray(p.interests) && p.interests.some(i => i.toLowerCase().includes(query)))
        )
      : (profiles || []);

    const filteredPosts = query
      ? (posts || []).filter(p =>
          p.content?.toLowerCase().includes(query) ||
          p.title?.toLowerCase().includes(query) ||
          p.author_name?.toLowerCase().includes(query) ||
          p.searchable_text?.toLowerCase().includes(query)
        )
      : (posts || []);

    return Response.json({
      profiles: filteredProfiles,
      posts: filteredPosts,
      has_more: (profiles || []).length === limit,
      ok: true,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
