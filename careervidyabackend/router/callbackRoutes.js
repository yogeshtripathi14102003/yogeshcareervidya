import express from 'express';
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  updateStatus
} from '../controller/callbackController.js';

const router = express.Router();

// ========== CRUD ROUTES ==========

// CREATE  → POST   /api/callback/request
router.post('/request', createRequest);

// READ ALL → GET   /api/callback/all
router.get('/all', getAllRequests);

// READ ONE → GET   /api/callback/:id
router.get('/:id', getRequestById);

// UPDATE  → PUT    /api/callback/:id
router.put('/:id', updateRequest);

// DELETE  → DELETE /api/callback/:id
router.delete('/:id', deleteRequest);

// BONUS - Status update
// PATCH   → PATCH  /api/callback/:id/status
router.patch('/:id/status', updateStatus);

export default router;