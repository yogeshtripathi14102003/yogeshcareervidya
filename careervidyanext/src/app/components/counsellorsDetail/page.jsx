import { useRouter } from "next/navigation";

export default function MentorCard({ mentor }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/team/${mentor._id || mentor.id}`)}
      className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
    >
      <img
        src={mentor.image || "/images/default-avatar.png"}
        className="w-24 h-24 rounded-lg object-cover"
      />
      <h3 className="mt-3 text-lg font-bold">{mentor.name}</h3>
      <p className="text-sm text-gray-500">{mentor.designation}</p>
    </div>
  );
}
