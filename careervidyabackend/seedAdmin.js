import userModel from "./models/user/AuthModel.js";
import bcrypt from "bcryptjs";
import { PERMISSIONS } from "./constant/permission.js";

export const seedDefaultAdmin = async () => {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn(
      "⚠️  SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping default admin seeding."
    );
    return;
  }

  if (adminPassword.length < 12) {
    console.warn("⚠️  SEED_ADMIN_PASSWORD is short — use a strong password in production.");
  }

  // Check if admin already exists
  const exists = await userModel.findOne({ email: adminEmail, role: "admin" });
  if (exists) return;

  // Assign all permissions
  const allPermissions = Object.values(PERMISSIONS);

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await userModel.create({
    email: adminEmail,
    password: hashedPassword,
    name: "Default Admin",
    phone: "0000000000",
    countryCode: "+00",
    role: "admin",
    permissions: allPermissions, // <-- ALL permissions assigned here
  });

  console.log(`✅ Default admin seeded with ALL permissions: ${adminEmail}`);
};
