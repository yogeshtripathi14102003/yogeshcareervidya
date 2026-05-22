

import express from 'express';
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
  deleteBroadcast 

} from '../controller/ticketController.js';

const router = express.Router();

// ── Standard CRUD ────────────────────────────────────────────────
router.post('/',     createTicket);   // new ticket banao
router.get('/',      getAllTickets);  // ?counselorId=xxx → filter | no param → sab
router.get('/notify-all', getBroadcasts);          // 👈 नया रूट: सारे ब्रॉडकास्ट गेट करने के लिए
router.delete('/notify-all/:id', deleteBroadcast);
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