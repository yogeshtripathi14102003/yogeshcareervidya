import TeamSliderClient from "./TeamSliderClient.jsx";
import { serverFetch, resolveImageUrl } from "@/utlis/serverFetch";

async function getTeam() {
  const { ok, data } = await serverFetch("/api/v1/team", {
    next: { revalidate: 300 }, // ISR: refresh every 5 minutes
  });

  if (!ok) return [];

  let team = Array.isArray(data) ? data : data?.data || [];

  team.sort((a, b) => {
    const expA = parseInt(a.experience) || 0;
    const expB = parseInt(b.experience) || 0;
    return expB - expA;
  });

  // ✅ Resolve image URLs on the server — same centralized pattern as
  // universities/courses. The client component never needs BASE_URL.
  return team.map((member) => ({
    ...member,
    imageUrl: resolveImageUrl(member.image, "/fallback-avatar.png"),
  }));
}

export default async function TeamSection() {
  const team = await getTeam();
  return <TeamSliderClient team={team} />;
}