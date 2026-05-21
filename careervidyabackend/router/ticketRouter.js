// import express from 'express';
// import { 
//   createTicket, 
//   getAllTickets, 
//   getTicketById, 
//   updateTicket, 
//   deleteTicket,
//   sendAdminMessage, 
//   resolveTicket 
// } from '../controller/ticketController.js';

// const router = express.Router();

// // Standard CRUD
// router.post('/', createTicket);
// router.get('/', getAllTickets);
// router.get('/:id', getTicketById);
// router.put('/:id', updateTicket);
// router.delete('/:id', deleteTicket);

// // Admin Action Routes
// router.patch('/:ticketId/notify', sendAdminMessage);
// router.put('/:ticketId/resolve', resolveTicket);

// export default router;

import express from 'express';
import { 
  createTicket, 
  getAllTickets, 
  getTicketById, 
  updateTicket, 
  deleteTicket,
  sendAdminMessage,
  broadcastToAll,
  resolveTicket 
} from '../controller/ticketController.js';

const router = express.Router();

// ── Standard CRUD ────────────────────────────────────────────────
router.post('/',     createTicket);   // new ticket banao
router.get('/',      getAllTickets);  // ?counselorId=xxx → filter | no param → sab
router.get('/:id',   getTicketById);
router.put('/:id',   updateTicket);
router.delete('/:id', deleteTicket);

// ── Admin Action Routes ──────────────────────────────────────────

// Ticket-specific reply — sirf us counselor ko dikhega
router.patch('/:ticketId/notify', sendAdminMessage);

// Broadcast — sabhi counselors ko ek saath message
// NOTE: yeh route '/:id' se pehle hona chahiye warna conflict hoga
router.post('/notify-all', broadcastToAll);

// Resolve ticket
router.put('/:ticketId/resolve', resolveTicket);

export default router;