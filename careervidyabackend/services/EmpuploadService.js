import XLSX from 'xlsx';
import { bulkCreateEmployees } from '../services/employeeService.js';

const parseDate = (val) => {
  if (!val) return '';
  if (typeof val === 'number') {
    const d = XLSX.SSF.parse_date_code(val);
    if (d) return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
  }
  if (val instanceof Date) return val.toISOString().split('T')[0];
  if (typeof val === 'string') {
    const parts = val.trim().split(/[\/\-\.]/);
    if (parts.length === 3) {
      const [a, b, c] = parts;
      if (a.length === 4 && parseInt(a) > 1900)
        return `${a}-${b.padStart(2,'0')}-${c.padStart(2,'0')}`;
      if (parseInt(c) > 1900)
        return `${c}-${b.padStart(2,'0')}-${a.padStart(2,'0')}`;
    }
  }
  return '';
};

const getCol = (row, keys) => {
  for (const key of keys) {
    const norm  = key.toLowerCase().replace(/[\s_\-]/g, '');
    const found = Object.keys(row).find(k => k.toLowerCase().replace(/[\s_\-]/g, '') === norm);
    if (found !== undefined && row[found] != null && row[found] !== '')
      return String(row[found]).trim();
  }
  return '';
};

const getDateCol = (row, names) => {
  const key = Object.keys(row).find(k => names.includes(k.toLowerCase().replace(/[\s_\-]/g, '')));
  return key ? row[key] : '';
};

export const processBulkUpload = async (buffer) => {
  const wb   = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const ws   = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

  if (!rows.length) throw { status: 400, message: 'File is empty or has no data rows' };

  const records = [], parseErrors = [];

  rows.forEach((row, i) => {
    const rowNum      = i + 2;
    const empId       = getCol(row, ['empid','employeeid','emp_id','id']);
    const name        = getCol(row, ['name','fullname','employeename','emp_name']);
    const email       = getCol(row, ['email','emailaddress','mail','email_id']);
    const phone       = getCol(row, ['phone','mobile','contact','phonenumber']);
    const department  = getCol(row, ['department','dept','division']);
    const designation = getCol(row, ['designation','role','position','title','jobtitle']);
    const dobRaw      = getDateCol(row, ['dob','dateofbirth','birthdate','birthday']);
    const joinRaw     = getDateCol(row, ['joiningdate','dateofjoining','doj','joindate','hiredate']);
    const dob         = parseDate(dobRaw);
    const joiningDate = parseDate(joinRaw);

    if (!empId || !name || !email || !department || !designation)
      return parseErrors.push(`Row ${rowNum}: Missing required fields — "${name || 'unknown'}"`);
    if (!dob)
      return parseErrors.push(`Row ${rowNum}: Invalid DOB for "${name}" — "${dobRaw}"`);
    if (!joiningDate)
      return parseErrors.push(`Row ${rowNum}: Invalid Joining Date for "${name}" — "${joinRaw}"`);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return parseErrors.push(`Row ${rowNum}: Invalid email "${email}" for "${name}"`);

    records.push({ empId, name, email, phone, department, designation, dob, joiningDate });
  });

  const result = await bulkCreateEmployees(records);

  return {
    total:   rows.length,
    created: result.created,
    skipped: result.skipped + (rows.length - records.length),
    errors:  [...parseErrors, ...result.errors],
  };
};

export const buildTemplateBuffer = () => {
  const wb   = XLSX.utils.book_new();
  const data = [
    ['EmpId','Name','Email','Phone','Department','Designation','DOB','JoiningDate'],
    ['EMP001','Priya Sharma','priya@company.com','+91 98765 43210','Engineering','Software Engineer','1992-03-15','2020-06-01'],
    ['EMP002','Rahul Kumar','rahul@company.com','+91 87654 32109','HR','HR Manager','1988-11-20','2018-09-15'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [10,20,28,18,14,22,14,14].map(w => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws, 'Employees');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};