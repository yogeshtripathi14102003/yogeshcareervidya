import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    phone:       { type: String, default: '', trim: true },
    department:  { type: String, required: [true, 'Department is required'], trim: true },
    designation: { type: String, required: [true, 'Designation is required'], trim: true },
    dob:         { type: Date, required: [true, 'Date of birth is required'] },
    joiningDate: { type: Date, required: [true, 'Joining date is required'] },
    alertDobDays:   { type: Number, default: 7 },
    alertAnnivDays: { type: Number, default: 7 },
    active:      { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

employeeSchema.index({ department: 1 });
employeeSchema.index({ active: 1 });
employeeSchema.index({ name: 'text', email: 'text', department: 'text', designation: 'text' });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;