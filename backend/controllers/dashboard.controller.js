import Client from '../models/Client.js';
import Project from '../models/Project.js';
import Invoice from '../models/Invoice.js';
import { success, error } from '../utils/apiResponse.js';
import { USER_ROLES } from '../utils/constants.js';

export const getStats = async (req, res) => {
  try {
    let stats = {};
    if (req.user.role === USER_ROLES.ADMIN || req.user.role === USER_ROLES.TEAM_MEMBER) {
      stats.totalClients = await Client.countDocuments({ status: 'active' });
      stats.totalProjects = await Project.countDocuments();
      stats.activeProjects = await Project.countDocuments({ status: 'in_progress' });
      
      const invoices = await Invoice.find();
      stats.totalRevenue = invoices.reduce((acc, inv) => acc + inv.amount, 0);
      stats.paidRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, inv) => acc + inv.amount, 0);
    } else {
      // Client dashboard stats
      stats.myProjects = await Project.countDocuments({ client: req.user.client });
      stats.activeProjects = await Project.countDocuments({ client: req.user.client, status: 'in_progress' });
    }
    success(res, stats);
  } catch (err) {
    error(res, err.message, 500);
  }
};
