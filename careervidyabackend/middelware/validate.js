import { body } from 'express-validator';

export const employeeCreateRules = [
  body('empId').notEmpty().withMessage('empId is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('dob').isDate().withMessage('Valid DOB is required'),
  body('joiningDate').isDate().withMessage('Valid joining date is required'),
];


export const employeeUpdateRules = [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('dob').optional().isDate().withMessage('Valid DOB is required'),
  body('joiningDate').optional().isDate().withMessage('Valid joining date is required'),
];