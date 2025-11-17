"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/api/api"; // ✅ Your baseURL axios file

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admintoken");
    const userId = localStorage.getItem("userid");

    if (!token || !userId) {
      router.push("/");
      return;
    }

    // Fetch Logged-in user details
    const fetchUser = async () => {
      try {
        const res = await api.get(`/student/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.student);
      } catch (error) {
        console.log("Profile Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;
  if (!user) return <p className="p-6 text-red-500">User Not Found</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-lg">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="space-y-4">
        <ProfileRow label="Name" value={user.name} />
        <ProfileRow label="Email" value={user.email} />
        <ProfileRow label="Phone" value={user.phone} />
        <ProfileRow label="Address" value={user.address} />
        <ProfileRow label="Course" value={user.course} />
        <ProfileRow label="City" value={user.city} />
        <ProfileRow label="State" value={user.state} />
        <ProfileRow label="Gender" value={user.gender} />
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-3">
      <p className="font-semibold text-gray-700">{label}:</p>
      <p className="text-gray-600">{value || "N/A"}</p>
    </div>
  );
}
