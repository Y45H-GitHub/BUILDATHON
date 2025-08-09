const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Smart Dashboard Analytics
router.get('/dashboard', async (req, res) => {
    try {
        const [dockUtilization] = await pool.execute(`
      SELECT 
        COUNT(*) as total_docks,
        SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied_docks,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_docks
      FROM docks
    `);

        const [appointmentStats] = await pool.execute(`
      SELECT 
        status,
        COUNT(*) as count
      FROM appointments 
      WHERE DATE(appointment_time) = CURDATE()
      GROUP BY status
    `);

        const [truckStats] = await pool.execute(`
      SELECT 
        status,
        COUNT(*) as count
      FROM trucks
      GROUP BY status
    `);

        res.json({
            dockUtilization: dockUtilization[0],
            appointmentStats,
            truckStats,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard analytics', error: error.message });
    }
});

// Risk Dashboard
router.get('/risk-analysis', async (req, res) => {
    try {
        const [delayedAppointments] = await pool.execute(`
      SELECT COUNT(*) as delayed_count
      FROM appointments 
      WHERE appointment_time < NOW() AND status = 'scheduled'
    `);

        const [complianceIssues] = await pool.execute(`
      SELECT COUNT(*) as failed_checks
      FROM compliance_checks 
      WHERE status = 'failed' AND checked_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

        res.json({
            delayRisk: delayedAppointments[0].delayed_count > 5 ? 'HIGH' : 'LOW',
            complianceRisk: complianceIssues[0].failed_checks > 3 ? 'HIGH' : 'LOW',
            overallRisk: 'MEDIUM'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching risk analysis', error: error.message });
    }
});

module.exports = router;