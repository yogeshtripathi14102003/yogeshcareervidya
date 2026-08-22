import mongoose from "mongoose";

const securityConfigSchema = new mongoose.Schema(
  {
    // Minutes of no API activity before admin/subadmin/counselor sessions
    // are force-logged-out. Applies to staff roles only — students are
    // deliberately excluded, matching the original (if broken) design intent.
    inactivityLimitMinutes: { type: Number, default: 25, min: 1, max: 1440 },
  },
  { timestamps: true }
);

export default mongoose.model("SecurityConfig", securityConfigSchema);
