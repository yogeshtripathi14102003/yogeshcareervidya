import Employee from '../models/counselor/Employee.js';

export const getAllEmployees = async ({ q, department, active, page = 1, limit = 10 }) => {
  const filter = {};
  if (department) filter.department = department;
  if (active !== undefined && active !== '')
    filter.active = active === 'true' || active === true;
  if (q) filter.$text = { $search: q };

  const total = await Employee.countDocuments(filter);
  const data  = await Employee.find(filter)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .lean();

  return {
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEmployeeById = async (id) => {
  const emp = await Employee.findById(id).lean();
  if (!emp) throw { status: 404, message: 'Employee not found' };
  return emp;
};

export const createEmployee = async (data) => {
  const existing = await Employee.findOne({ empId: data.empId });
  if (existing) throw { status: 409, message: `Employee ID "${data.empId}" already exists` };
  return await Employee.create(data);
};

export const updateEmployee = async (id, data) => {
  const { empId, ...rest } = data;
  const emp = await Employee.findByIdAndUpdate(id, rest, { new: true, runValidators: true }).lean();
  if (!emp) throw { status: 404, message: 'Employee not found' };
  return emp;
};

export const deleteEmployee = async (id) => {
  const emp = await Employee.findByIdAndDelete(id);
  if (!emp) throw { status: 404, message: 'Employee not found' };
};

export const toggleEmployeeActive = async (id) => {
  const emp = await Employee.findById(id);
  if (!emp) throw { status: 404, message: 'Employee not found' };
  emp.active = !emp.active;
  return await emp.save();
};

export const getAlerts = async ({ days = 30, type = null }) => {
  const employees = await Employee.find({ active: true }).lean();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const alerts = [];

  for (const emp of employees) {
    if (emp.dob && (!type || type === 'birthday')) {
      const dob      = new Date(emp.dob);
      const thisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      if (thisYear < today) thisYear.setFullYear(today.getFullYear() + 1);
      const daysUntil = Math.round((thisYear - today) / 86400000);
      if (daysUntil <= (emp.alertDobDays ?? Number(days)))
        alerts.push({ employee: emp, type: 'birthday', daysUntil, date: thisYear.toISOString().split('T')[0] });
    }

    if (emp.joiningDate && (!type || type === 'anniversary')) {
      const join     = new Date(emp.joiningDate);
      const thisYear = new Date(today.getFullYear(), join.getMonth(), join.getDate());
      if (thisYear < today) thisYear.setFullYear(today.getFullYear() + 1);
      const daysUntil      = Math.round((thisYear - today) / 86400000);
      const yearsCompleting = thisYear.getFullYear() - join.getFullYear();
      if (daysUntil <= (emp.alertAnnivDays ?? Number(days)) && yearsCompleting > 0)
        alerts.push({ employee: emp, type: 'anniversary', daysUntil, date: thisYear.toISOString().split('T')[0], yearsCompleting });
    }
  }

  return alerts.sort((a, b) => a.daysUntil - b.daysUntil);
};

export const getStats = async () => {
  const [total, active, alerts, byDept] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ active: true }),
    getAlerts({ days: 30 }),
    Employee.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]),
  ]);

  return {
    total,
    active,
    inactive:    total - active,
    todayAlerts: alerts.filter(a => a.daysUntil === 0).length,
    weekAlerts:  alerts.filter(a => a.daysUntil <= 7).length,
    monthAlerts: alerts.length,
    byDepartment: Object.fromEntries(byDept.map(d => [d._id, d.count])),
  };
};

export const bulkCreateEmployees = async (records) => {
  const existing    = await Employee.find({ empId: { $in: records.map(r => r.empId) } }).lean();
  const existingIds = new Set(existing.map(e => e.empId));
  const toInsert = [], errors = [];
  let skipped = 0;

  records.forEach((rec, i) => {
    if (existingIds.has(rec.empId)) {
      errors.push(`Row ${i + 2}: EmpId "${rec.empId}" already exists`);
      skipped++;
      return;
    }
    toInsert.push({ ...rec, alertDobDays: 7, alertAnnivDays: 7, active: true });
  });

  if (toInsert.length) await Employee.insertMany(toInsert, { ordered: false });
  return { created: toInsert.length, skipped, errors };
};