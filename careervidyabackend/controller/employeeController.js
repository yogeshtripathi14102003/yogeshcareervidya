
import * as svc from '../services/employeeService.js';
import { validationResult } from 'express-validator';
const handleError = (res, err) =>
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal server error' });

export const getAll = async (req, res) => {
  try {
    const result = await svc.getAllEmployees(req.query);
    res.json({ success: true, ...result });
  } catch (err) { handleError(res, err); }
};

export const getById = async (req, res) => {
  try {
    const data = await svc.getEmployeeById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { handleError(res, err); }
};

export const create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    const data = await svc.createEmployee(req.body);
    res.status(201).json({ success: true, data, message: 'Employee created successfully' });
  } catch (err) { handleError(res, err); }
};

export const update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    const data = await svc.updateEmployee(req.params.id, req.body);
    res.json({ success: true, data, message: 'Employee updated successfully' });
  } catch (err) { handleError(res, err); }
};

export const remove = async (req, res) => {
  try {
    await svc.deleteEmployee(req.params.id);
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (err) { handleError(res, err); }
};

export const toggleActive = async (req, res) => {
  try {
    const data = await svc.toggleEmployeeActive(req.params.id);
    res.json({ success: true, data, message: `Employee ${data.active ? 'activated' : 'deactivated'}` });
  } catch (err) { handleError(res, err); }
};

export const getAlerts = async (req, res) => {
  try {
    const data = await svc.getAlerts(req.query);
    res.json({ success: true, data, total: data.length });
  } catch (err) { handleError(res, err); }
};

export const getStats = async (req, res) => {
  try {
    const data = await svc.getStats();
    res.json({ success: true, data });
  } catch (err) { handleError(res, err); }
};