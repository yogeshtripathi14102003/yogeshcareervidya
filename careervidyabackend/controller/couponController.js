import mongoose from "mongoose";
import Coupon from "../models/Admin/Coupon.js";

/* =========================================================
   CONSTANTS
========================================================= */

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_PAGE_LIMIT = 10;
const MAX_PAGE_LIMIT = 100;

// Update me sirf yahi fields badal sakte hain.
// code, course, university, usedCount, usedBy kabhi edit nahi honge.
const UPDATABLE_FIELDS = [
  "discountType",
  "discountValue",
  "maxDiscountAmount",
  "usageLimit",
  "perUserLimit",
  "validUntil",
];

/* =========================================================
   HELPERS
========================================================= */

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const sendError = (res, err) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ success: false, message: err.message });
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ success: false, message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: `Invalid ${err.path}` });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate value, dobara try karo" });
  }
  console.error("[CouponController]", err);
  return res.status(500).json({ success: false, message: "Server error" });
};

// try/catch har function me likhne ki zaroorat nahi
const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    sendError(res, err);
  }
};

const assertObjectId = (id, label) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, `Invalid ${label}`);
};

const toNumber = (value, label, { integer = false, min = 1, max } = {}) => {
  const n = Number(value);
  if (value === "" || value === null || value === undefined || !Number.isFinite(n)) {
    throw new HttpError(400, `${label} sahi number hona chahiye`);
  }
  if (integer && !Number.isInteger(n)) throw new HttpError(400, `${label} poora number hona chahiye`);
  if (n < min) throw new HttpError(400, `${label} kam se kam ${min} hona chahiye`);
  if (max !== undefined && n > max) throw new HttpError(400, `${label} ${max} se zyada nahi ho sakta`);
  return n;
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, parseInt(query.limit, 10) || DEFAULT_PAGE_LIMIT));
  return { page, limit, skip: (page - 1) * limit };
};

const getStatus = (coupon, now = new Date()) =>
  !coupon.isActive ? "disabled" : now > coupon.validUntil ? "expired" : "active";

// List me dikhane ke liye extra fields
const withMeta = (coupon, now = new Date()) => ({
  ...coupon,
  status: getStatus(coupon, now),
  daysLeft: Math.max(0, Math.ceil((coupon.validUntil - now) / DAY_MS)),
  remainingUses: coupon.usageLimit ? Math.max(0, coupon.usageLimit - coupon.usedCount) : null, // null = unlimited
});

const calculateDiscount = (coupon, price) => {
  let discount =
    coupon.discountType === "percentage"
      ? (price * coupon.discountValue) / 100
      : coupon.discountValue;

  if (coupon.discountType === "percentage" && coupon.maxDiscountAmount) {
    discount = Math.min(discount, coupon.maxDiscountAmount);
  }
  discount = Math.min(discount, price); // discount price se zyada nahi
  return Math.round(discount * 100) / 100;
};

// validate aur apply dono isi ko use karte hain
const evaluateCoupon = async ({ code, courseId, universityId, price, userId }) => {
  if (!code || typeof code !== "string") throw new HttpError(400, "Coupon code required hai");
  assertObjectId(courseId, "courseId");
  assertObjectId(universityId, "universityId");
  const amount = toNumber(price, "Price");

  const coupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
    course: courseId,
    university: universityId,
    isActive: true,
  });
  if (!coupon) throw new HttpError(404, "Invalid coupon");

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) throw new HttpError(400, "Coupon expired");

  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    throw new HttpError(400, "Coupon usage limit reached");
  }

  const userUses = coupon.usedBy.filter((u) => String(u.user) === String(userId)).length;
  if (userUses >= coupon.perUserLimit) throw new HttpError(400, "You already used this coupon");

  return { coupon, amount, discount: calculateDiscount(coupon, amount) };
};

/* =========================================================
   1. CREATE
   POST /api/v1/coupons
========================================================= */

export const createCoupon = asyncHandler(async (req, res) => {
  const { course, university, discountType = "percentage", discountValue, maxDiscountAmount, usageLimit, perUserLimit } = req.body;

  assertObjectId(course, "course");
  assertObjectId(university, "university");
  if (!["percentage", "flat"].includes(discountType)) {
    throw new HttpError(400, "discountType percentage ya flat hona chahiye");
  }

  const payload = {
    course,
    university,
    discountType,
    discountValue: toNumber(discountValue, "Discount", {
      max: discountType === "percentage" ? 100 : undefined,
    }),
    createdBy: req.user?._id,
  };
  if (discountType === "percentage" && maxDiscountAmount !== undefined && maxDiscountAmount !== "") {
    payload.maxDiscountAmount = toNumber(maxDiscountAmount, "Max discount");
  }
  if (usageLimit !== undefined && usageLimit !== "" && usageLimit !== null) {
    payload.usageLimit = toNumber(usageLimit, "Usage limit", { integer: true });
  }
  if (perUserLimit !== undefined && perUserLimit !== "") {
    payload.perUserLimit = toNumber(perUserLimit, "Per user limit", { integer: true });
  }

  // Code model khud banata hai. Same code aa jaye (bahut kam chance) to naya bana ke retry.
  let coupon;
  for (let attempt = 0; attempt < 5 && !coupon; attempt++) {
    try {
      coupon = await Coupon.create(payload);
    } catch (err) {
      const duplicateCode = err.code === 11000 && err.keyPattern?.code;
      if (!duplicateCode) throw err;
    }
  }
  if (!coupon) throw new HttpError(500, "Coupon code generate nahi ho paya, dobara try karo");

  res.status(201).json({ success: true, message: "Coupon created", data: coupon });
});

/* =========================================================
   2. LIST (admin) - filters + pagination
   GET /api/v1/coupons?course=&university=&status=active|expired|disabled&search=&page=&limit=
========================================================= */

export const getAllCoupons = asyncHandler(async (req, res) => {
  const { course, university, status, search } = req.query;
  const { page, limit, skip } = getPagination(req.query);
  const now = new Date();
  const filter = {};

  if (course) {
    assertObjectId(course, "course");
    filter.course = course;
  }
  if (university) {
    assertObjectId(university, "university");
    filter.university = university;
  }
  if (search) {
    filter.code = { $regex: `^${escapeRegex(String(search).trim().toUpperCase())}` };
  }
  if (status) {
    if (status === "active") Object.assign(filter, { isActive: true, validUntil: { $gte: now } });
    else if (status === "expired") Object.assign(filter, { isActive: true, validUntil: { $lt: now } });
    else if (status === "disabled") filter.isActive = false;
    else throw new HttpError(400, "status active, expired ya disabled hona chahiye");
  }

  const [coupons, total] = await Promise.all([
    Coupon.find(filter)
      .populate("course", "title name")
      .populate("university", "name")
      .select("-usedBy")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Coupon.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: coupons.map((c) => withMeta(c, now)),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

/* =========================================================
   3. LIST BY COURSE (university wise)
   GET /api/v1/coupons/course/:courseId
========================================================= */

export const getCouponsByCourse = asyncHandler(async (req, res) => {
  assertObjectId(req.params.courseId, "courseId");

  const coupons = await Coupon.find({ course: req.params.courseId })
    .populate("university", "name")
    .select("-usedBy")
    .sort({ createdAt: -1 })
    .lean();

  const now = new Date();
  const data = coupons.map((c) => withMeta(c, now));

  res.json({ success: true, count: data.length, data });
});

/* =========================================================
   3b. PUBLIC LIST (website ke Coupons page ke liye, login nahi chahiye)
   GET /api/v1/coupons/public?course=&university=&limit=
   Sirf wahi coupons jo abhi use ho sakte hain: active, valid dates, limit bachi ho.
   usedBy, createdBy jaisi private cheezein bahar nahi jaati.
========================================================= */

// export const getPublicCoupons = asyncHandler(async (req, res) => {
//   const { course, university } = req.query;
//   const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
//   const now = new Date();

//   const filter = {
//     isActive: true,
//     validFrom: { $lte: now },
//     validUntil: { $gte: now },
//     $expr: {
//       $or: [
//         { $eq: [{ $ifNull: ["$usageLimit", null] }, null] },
//         { $lt: ["$usedCount", "$usageLimit"] },
//       ],
//     },
//   };
//   if (course) {
//     assertObjectId(course, "course");
//     filter.course = course;
//   }
//   if (university) {
//     assertObjectId(university, "university");
//     filter.university = university;
//   }

//   const coupons = await Coupon.find(filter)
//     .populate("course", "title name slug")
//     .populate("university", "name slug")
//     .select("code discountType discountValue maxDiscountAmount validUntil usageLimit usedCount course university")
//     .sort({ validUntil: 1 }) // jo jaldi expire ho raha hai wo pehle
//     .limit(limit)
//     .lean();

//   const data = coupons.map(({ usedCount, ...c }) => ({
//     ...c,
//     daysLeft: Math.max(0, Math.ceil((c.validUntil - now) / DAY_MS)),
//     remainingUses: c.usageLimit ? Math.max(0, c.usageLimit - usedCount) : null, // null = unlimited
//   }));

//   res.set("Cache-Control", "public, max-age=60");
//   res.json({ success: true, count: data.length, data });
// });


/* =========================================================
   3b. PUBLIC LIST (website ke Coupons page ke liye, login nahi chahiye)
   GET /api/v1/coupons/public?course=&university=&limit=
========================================================= */

export const getPublicCoupons = asyncHandler(async (req, res) => {
  const { course, university } = req.query;

  const limit = Math.min(
    50,
    Math.max(1, parseInt(req.query.limit, 10) || 20)
  );

  const now = new Date();

  const filter = {
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
    $expr: {
      $or: [
        { $eq: [{ $ifNull: ["$usageLimit", null] }, null] },
        { $lt: ["$usedCount", "$usageLimit"] },
      ],
    },
  };

  // Course filter
  if (course) {
    assertObjectId(course, "course");
    filter.course = course;
  }

  // University filter
  if (university) {
    assertObjectId(university, "university");
    filter.university = university;
  }

  // Fetch coupons with populated course and university data
  const coupons = await Coupon.find(filter)
    .populate({
      path: "course",
      select: "title name slug",
    })
    .populate({
      path: "university",
      select: "name universityName universityImage logo logoUrl image slug",
    })
    .select(
      "code discountType discountValue maxDiscountAmount validUntil usageLimit usedCount course university"
    )
    .sort({ validUntil: 1 })
    .limit(limit)
    .lean();

  // Response data
  const data = coupons.map(({ usedCount, ...coupon }) => ({
    ...coupon,
    daysLeft: Math.max(
      0,
      Math.ceil((new Date(coupon.validUntil) - now) / DAY_MS)
    ),
    remainingUses:
      coupon.usageLimit != null
        ? Math.max(0, coupon.usageLimit - usedCount)
        : null,
  }));

  // Cache response for 60 seconds
  res.set("Cache-Control", "public, max-age=60");

  return res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
});

/* =========================================================
   4. GET ONE
   GET /api/v1/coupons/:id
========================================================= */

export const getCouponById = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, "coupon id");

  const coupon = await Coupon.findById(req.params.id)
    .populate("course", "title name")
    .populate("university", "name")
    .select("-usedBy")
    .lean();
  if (!coupon) throw new HttpError(404, "Coupon not found");

  res.json({ success: true, data: withMeta(coupon) });
});

/* =========================================================
   5. UPDATE
   PATCH /api/v1/coupons/:id
   Code, course, university change nahi hote. Sirf UPDATABLE_FIELDS.
========================================================= */

export const updateCoupon = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, "coupon id");

  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new HttpError(404, "Coupon not found");

  const updates = {};
  for (const key of UPDATABLE_FIELDS) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, "Update karne ke liye koi valid field nahi mili");
  }

  if (updates.discountType && !["percentage", "flat"].includes(updates.discountType)) {
    throw new HttpError(400, "discountType percentage ya flat hona chahiye");
  }
  const finalType = updates.discountType ?? coupon.discountType;

  if (updates.discountValue !== undefined) {
    updates.discountValue = toNumber(updates.discountValue, "Discount", {
      max: finalType === "percentage" ? 100 : undefined,
    });
  }
  if (updates.maxDiscountAmount !== undefined) {
    updates.maxDiscountAmount =
      updates.maxDiscountAmount === null || updates.maxDiscountAmount === ""
        ? undefined
        : toNumber(updates.maxDiscountAmount, "Max discount");
  }
  if (updates.usageLimit !== undefined) {
    // null / "" = unlimited
    if (updates.usageLimit === null || updates.usageLimit === "") {
      updates.usageLimit = null;
    } else {
      updates.usageLimit = toNumber(updates.usageLimit, "Usage limit", { integer: true });
      if (updates.usageLimit < coupon.usedCount) {
        throw new HttpError(400, `Usage limit ${coupon.usedCount} se kam nahi ho sakti (itni baar use ho chuka hai)`);
      }
    }
  }
  if (updates.perUserLimit !== undefined) {
    updates.perUserLimit = toNumber(updates.perUserLimit, "Per user limit", { integer: true });
  }
  if (updates.validUntil !== undefined) {
    const until = new Date(updates.validUntil);
    if (Number.isNaN(until.getTime())) throw new HttpError(400, "validUntil sahi date nahi hai");
    if (until <= coupon.validFrom) throw new HttpError(400, "validUntil, validFrom ke baad ki date honi chahiye");
    updates.validUntil = until;
  }

  coupon.set(updates);
  await coupon.save(); // model ke validators bhi chalenge

  res.json({ success: true, message: "Coupon updated", data: coupon });
});

/* =========================================================
   6. DELETE
   DELETE /api/v1/coupons/:id
   Jo coupon use ho chuka hai wo delete nahi hota (record/audit ke liye).
   Usse "Band karo" (toggle) se disable karo.
========================================================= */

export const deleteCoupon = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, "coupon id");

  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new HttpError(404, "Coupon not found");

  if (coupon.usedCount > 0) {
    throw new HttpError(409, "Ye coupon use ho chuka hai, delete nahi ho sakta. Isse band (disable) kar do.");
  }

  await coupon.deleteOne();
  res.json({ success: true, message: "Coupon deleted" });
});

/* =========================================================
   7. ENABLE / DISABLE
   PATCH /api/v1/coupons/:id/toggle
========================================================= */

export const toggleCoupon = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, "coupon id");

  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new HttpError(404, "Coupon not found");

  coupon.isActive = !coupon.isActive;
  await coupon.save();

  res.json({ success: true, isActive: coupon.isActive });
});

/* =========================================================
   8. USAGE (kisne use kiya)
   GET /api/v1/coupons/:id/usage?page=&limit=
========================================================= */

export const getCouponUsage = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, "coupon id");

  const coupon = await Coupon.findById(req.params.id)
    .populate("usedBy.user", "name email")
    .populate("university", "name")
    .populate("course", "title name");
  if (!coupon) throw new HttpError(404, "Coupon not found");

  const { page, limit, skip } = getPagination(req.query);
  const usedBy = [...coupon.usedBy].sort((a, b) => b.usedAt - a.usedAt).slice(skip, skip + limit);

  res.json({
    success: true,
    data: {
      code: coupon.code,
      course: coupon.course,
      university: coupon.university,
      usedCount: coupon.usedCount,
      usageLimit: coupon.usageLimit,
      validUntil: coupon.validUntil,
      usedBy,
    },
    pagination: { page, limit, total: coupon.usedBy.length, totalPages: Math.ceil(coupon.usedBy.length / limit) },
  });
});

/* =========================================================
   9. VALIDATE (checkout preview, count nahi badhta)
   POST /api/v1/coupons/validate
   body: { code, courseId, universityId, price }
========================================================= */

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, courseId, universityId, price } = req.body;
  const { amount, discount } = await evaluateCoupon({ code, courseId, universityId, price, userId: req.user._id });

  res.json({
    success: true,
    originalPrice: amount,
    discount,
    finalPrice: Math.round((amount - discount) * 100) / 100,
  });
});

/* =========================================================
   10. APPLY / REDEEM (count badhta hai)
   POST /api/v1/coupons/apply
   body: { code, courseId, universityId, price, orderId }

   Isse payment success hone ke baad call karo, warna payment
   chhodne wale users ka coupon waste ho jayega.
========================================================= */

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code, courseId, universityId, price, orderId } = req.body;
  const userId = req.user._id;

  if (orderId) assertObjectId(orderId, "orderId");

  const { coupon, amount, discount } = await evaluateCoupon({ code, courseId, universityId, price, userId });

  // Saari checks ek hi atomic query me (limit, per-user limit, validity),
  // taaki do requests ek saath aayein to bhi limit cross na ho.
  const now = new Date();
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const redeemed = await Coupon.findOneAndUpdate(
    {
      _id: coupon._id,
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $expr: {
        $and: [
          {
            $or: [
              { $eq: [{ $ifNull: ["$usageLimit", null] }, null] },
              { $lt: ["$usedCount", "$usageLimit"] },
            ],
          },
          {
            $lt: [
              {
                $size: {
                  $filter: { input: "$usedBy", as: "u", cond: { $eq: ["$$u.user", userObjectId] } },
                },
              },
              "$perUserLimit",
            ],
          },
        ],
      },
    },
    {
      $inc: { usedCount: 1 },
      $push: { usedBy: { user: userObjectId, orderId: orderId || undefined } },
    },
    { new: true }
  );

  if (!redeemed) throw new HttpError(400, "Coupon ab use nahi ho sakta (limit poori ho gayi ya expire ho gaya)");

  res.json({
    success: true,
    originalPrice: amount,
    discount,
    finalPrice: Math.round((amount - discount) * 100) / 100,
  });
});