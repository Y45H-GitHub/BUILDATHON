const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Compliance Checker
router.post('/check/:truckId', async (req, res) => {
    try {
        const { truckId } = req.params;
        const { checkType } = req.body;

        // Simulate compliance checks
        const checks = {
            'safety': { passed: Math.random() > 0.1, details: 'Safety equipment verified' },
            'documentation': { passed: Math.random() > 0.05, details: 'All documents valid' },
            'vehicle_inspection': { passed: Math.random() > 0.15, details: 'Vehicle condition acceptable' },
            'driver_certification': { passed: Math.random() > 0.02, details: 'Driver license valid' }
        };

        const result = checks[checkType] || checks['safety'];
        const status = result.passed ? 'passed' : 'failed';

        // Save compliance check
        await pool.execute(`
      INSERT INTO compliance_checks (truck_id, check_type, status, details)
      VALUES (?, ?, ?, ?)
    `, [truckId, checkType, status, JSON.stringify(result)]);

        res.json({
            truckId,
            checkType,
            status,
            details: result.details,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({ message: 'Error performing compliance check', error: error.message });
    }
});

// Get compliance history
router.get('/history/:truckId', async (req, res) => {
    try {
        const { truckId } = req.params;

        const [history] = await pool.execute(`
      SELECT * FROM compliance_checks 
      WHERE truck_id = ? 
      ORDER BY checked_at DESC 
      LIMIT 50
    `, [truckId]);

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching compliance history', error: error.message });
    }
});

module.exports = router;