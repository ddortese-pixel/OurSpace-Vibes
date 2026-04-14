// This route redirects to the active OurSpace onboarding flow.
// The legacy Onboarding.jsx is kept here only to prevent a dead route.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();
  useEffect(() => {
    // Always redirect to the real onboarding flow
    const hasAccount = localStorage.getItem("os2_email");
    navigate(hasAccount ? "/Home" : "/OurSpaceOnboarding", { replace: true });
  }, []);
  return null;
}
