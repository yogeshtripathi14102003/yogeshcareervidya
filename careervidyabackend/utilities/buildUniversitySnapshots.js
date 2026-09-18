import University from "../models/Admin/University.js";

// ======================================================
// 🎯 BUILD UNIVERSITY SNAPSHOTS
// ======================================================


//   ye course wale section me university ftch krne ke liy hai  Admin ne jo universities select ki hain, unke IDs lekar
// University DB se poora data fetch karta hai aur
// course-specific data ke saath merge karke snapshot banata hai.
//
// @param {Array} selectedUniversities - Admin form se aaya array
//   Format:
//   [
//     {
//       universityId: "xxx",
//       courseFees: { total, perSemester, registration, emiStartsFrom },
//       duration: "3 Years",
//       specializations: ["Data Science"],
//       mode: "Online",
//       eligibility: "...",
//       applyLink: "/apply/amity",
//       brochureLink: "...",
//       displayOrder: 1,
//       isTopRated: true,
//       badgeText: "Top Rated",
//     }
//   ]
//
// @returns {Array} - Final snapshots ready to save in Course
// ======================================================

const buildUniversitySnapshots = async (selectedUniversities = []) => {
  // 1. Input validation
  if (!Array.isArray(selectedUniversities) || selectedUniversities.length === 0) {
    return [];
  }

  // 2. Saari university IDs nikaalo
  const universityIds = selectedUniversities
    .map((u) => u?.universityId)
    .filter(Boolean);

  if (universityIds.length === 0) {
    return [];
  }

  // 3. Ek hi query me saari universities fetch karo (efficient)
  const universityDocs = await University.find({
    _id: { $in: universityIds },
  }).lean();

  // 4. Map banao: { universityIdString: doc } - fast lookup ke liye
  const universityMap = {};
  universityDocs.forEach((u) => {
    universityMap[u._id.toString()] = u;
  });

  // 5. Har selected university ka snapshot banao
  const snapshots = selectedUniversities
    .map((selected) => {
      const uniDoc = universityMap[selected?.universityId?.toString()];

      // Invalid ID skip karo (agar university delete ho gayi ho)
      if (!uniDoc) return null;

      return {
        // ============================================
        // ✅ AUTO-FETCHED FROM UNIVERSITY DB
        // ============================================
        universityId: uniDoc._id,
        name: uniDoc.name || "",
        slug: uniDoc.slug || "",
        universityImage: uniDoc.universityImage || null,
        cardDescription:
          uniDoc.cardDescription || uniDoc.description || "",
        rating: Number(uniDoc.rating) || 0,
        reviewsCount: Number(uniDoc.reviewsCount) || 0,
        approvals: Array.isArray(uniDoc.approvals)
          ? uniDoc.approvals.map((a) => ({
              name: a?.name || "",
              logo: a?.logo || null,
            }))
          : [],

        // ============================================
        // ✅ COURSE-SPECIFIC (Admin form se aaya)
        // ============================================
        courseFees: {
          total: selected?.courseFees?.total || "",
          perSemester: selected?.courseFees?.perSemester || "",
          registration: selected?.courseFees?.registration || "",
          emiStartsFrom: selected?.courseFees?.emiStartsFrom || "",
        },
        duration: selected?.duration || "",
        specializations: Array.isArray(selected?.specializations)
          ? selected.specializations
          : [],
        mode: selected?.mode || "Online",
        eligibility: selected?.eligibility || "",
        applyLink: selected?.applyLink || "",
        brochureLink: selected?.brochureLink || "",

        // ============================================
        // ✅ DISPLAY CONTROL
        // ============================================
        displayOrder: Number(selected?.displayOrder) || 0,
        isTopRated: Boolean(selected?.isTopRated),
        badgeText: selected?.badgeText || "",
      };
    })
    .filter(Boolean); // null remove karo (invalid IDs)

  // 6. displayOrder ke hisaab se sort karo
  snapshots.sort((a, b) => a.displayOrder - b.displayOrder);

  return snapshots;
};

export default buildUniversitySnapshots;