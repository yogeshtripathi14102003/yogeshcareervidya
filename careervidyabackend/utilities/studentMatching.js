import Student from "../models/user/AuthModel.js";

export const findStudentByContact = async ({ email, phone }) => {
  const orClauses = [];
  if (email) orClauses.push({ email: email.trim().toLowerCase() });
  if (phone) orClauses.push({ mobileNumber: phone.trim() });
  if (!orClauses.length) return null;

  return Student.findOne({ $or: orClauses }).select("_id").lean();
};
