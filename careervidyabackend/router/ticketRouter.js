import express from 'express';
import { 
  createTicket, 
  getAllTickets, 
  getTicketById, 
  updateTicket, 
  deleteTicket,
  sendAdminMessage, 
  resolveTicket 
} from '../controller/ticketController.js';

const router = express.Router();

// Standard CRUD
router.post('/', createTicket);
router.get('/', getAllTickets);
router.get('/:id', getTicketById);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

// Admin Action Routes
router.patch('/:ticketId/notify', sendAdminMessage);
router.put('/:ticketId/resolve', resolveTicket);

export default router;