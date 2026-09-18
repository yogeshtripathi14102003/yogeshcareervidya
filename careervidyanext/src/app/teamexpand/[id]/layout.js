// export async function generateMetadata({ params }) {
//   const { id } = await params;

//   return {
//     title: "Our Mentors | CareerVidya",

//     description:
//       "Meet CareerVidya's expert mentors and counselors who guide students toward the right career path.",

//     alternates: {
//       canonical: `https://careervidya.in/teamexpand/${id}`,
//     },

//     robots: {
//       index: true,
//       follow: true,
//     },

//     openGraph: {
//       title: "Our Mentors | CareerVidya",
//       description:
//         "Meet CareerVidya's expert mentors and counselors who guide students toward the right career path.",
//       url: `https://careervidya.in/teamexpand/${id}`,
//       type: "profile",
//     },
//   };
// }

// export default function TeamExpandDetailLayout({ children }) {
//   return children;
// }

import { serverFetch, resolveImageUrl } from "@/utlis/serverFetch";

const SITE_URL = "https://careervidya.in";

async function getTeamMember(id) {
    try {
        const { ok, data } = await serverFetch(`/api/v1/team/${id}`, {
            next: { revalidate: 300 },
        });
        if (!ok || !data) return null;
        return data.data || data;
    } catch (error) {
        console.error("Error fetching team member:", error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const member = await getTeamMember(id);

    if (!member) {
        return {
            title: "Team Member Not Found | CareerVidya",
            robots: { index: false, follow: true },
        };
    }

    const name = member.name || "Expert Counselor";
    const designation = member.designation || "Expert Counselor";
    const experience = member.experience || 0;

    const title = `${name} - ${designation} | CareerVidya`;
    const description = `Book a consultation with ${name}, ${designation} at CareerVidya with ${experience}+ years of experience in career counselling.`;

    const canonicalUrl = `${SITE_URL}/teamexpand/${id}`;
    const imageUrl = resolveImageUrl(member.image, "/fallback-avatar.png");

    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        keywords: [
            name,
            `${name} CareerVidya`,
            `${name} career counselor`,
            designation,
            "career counselling",
            "career guidance",
            "expert counselor",
        ],
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: "CareerVidya",
            locale: "en_IN",
            type: "profile",
            images: [
                {
                    url: imageUrl,
                    width: 400,
                    height: 400,
                    alt: `${name} - ${designation}`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default function TeamMemberLayout({ children }) {
    return children;
}