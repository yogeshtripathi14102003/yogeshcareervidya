import express from 'express';
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  sendAdminMessage,
  broadcastToAll,
  resolveTicket,
  getBroadcasts,
  deleteBroadcast,
} from '../controller/ticketController.js';

const router = express.Router();

// Internal support-ticket system — counselors + admins only, never public
const staff = [authMiddleware, requireRole(["admin", "subadmin", "counselor"])];
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

router.post('/', ...staff, createTicket);
router.get('/', ...staff, getAllTickets);
router.get('/notify-all', ...adminOnly, getBroadcasts);
router.delete('/notify-all/:id', ...adminOnly, deleteBroadcast);
router.get('/:id', ...staff, getTicketById);
router.put('/:id', ...staff, updateTicket);
router.delete('/:id', ...adminOnly, deleteTicket);

router.patch('/:ticketId/notify', ...adminOnly, sendAdminMessage);
router.post('/notify-all', ...adminOnly, broadcastToAll);
router.put('/:ticketId/resolve', ...staff, resolveTicket);

export default router;
