import express from 'express';
import multer from 'multer';
import { getAll, getById, create, update, remove, toggleActive, getAlerts, getStats } from '../controller/employeeController.js';
import { uploadBulk, downloadTemplate } from '../controller/uploadController.js';
import { employeeCreateRules, employeeUpdateRules } from '../middelware/validate.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    ['xlsx', 'xls', 'csv'].includes(ext)
      ? cb(null, true)
      : cb(new Error('Only .xlsx, .xls, .csv files allowed'), false);
  },
});

router.get('/stats',           getStats);
router.get('/alerts',          getAlerts);
router.post('/upload',         upload.single('file'), uploadBulk);
router.get('/upload/template', downloadTemplate);

router.get('/',    getAll);
router.post('/',   employeeCreateRules, create);
router.get('/:id',    getById);
router.put('/:id',    employeeUpdateRules, update);
router.delete('/:id', remove);
router.patch('/:id/toggle', toggleActive);

export default router;