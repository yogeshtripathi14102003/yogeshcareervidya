import { processBulkUpload, buildTemplateBuffer } from "../services/EmpuploadService.js";

export const uploadBulk = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    const result = await processBulkUpload(req.file.buffer);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: err.message || 'Failed to process file' });
  }
};

export const downloadTemplate = async (_req, res) => {
  try {
    const buffer = await buildTemplateBuffer();
    res.setHeader('Content-Disposition', 'attachment; filename="employees_template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not generate template' });
  }
};