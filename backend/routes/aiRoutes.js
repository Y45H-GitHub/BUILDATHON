const express = require('express');
const router = express.Router();

// AI-powered Chatbot
router.post('/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        // Simulate AI response based on supply chain context
        const responses = {
            'dock status': 'Currently, Dock D001 and D002 are occupied. D003 is available for immediate assignment.',
            'inventory': 'Product ABC123 is located in Warehouse Section B, Aisle 5. Current stock: 150 units.',
            'route optimization': 'The optimal route for Truck T001 saves 45 minutes and $23 in fuel costs.',
            'compliance': 'All trucks have passed safety inspections. Driver certifications expire in 30 days for 2 drivers.',
            'default': 'I can help you with dock management, inventory tracking, route optimization, and compliance checks. What would you like to know?'
        };

        const responseKey = Object.keys(responses).find(key =>
            message.toLowerCase().includes(key)
        ) || 'default';

        const aiResponse = {
            message: responses[responseKey],
            confidence: 0.95,
            suggestions: [
                'Check dock availability',
                'View truck queue',
                'Generate freight quote',
                'Run compliance check'
            ],
            timestamp: new Date()
        };

        res.json(aiResponse);
    } catch (error) {
        res.status(500).json({ message: 'Error processing AI request', error: error.message });
    }
});

// Priority Slot Algorithm for Dock Dispatcher
router.post('/priority-algorithm', async (req, res) => {
    try {
        const { appointments } = req.body;

        // Simulate priority scoring algorithm
        const scoredAppointments = appointments.map(apt => {
            let score = 0;

            // Time-based priority
            const hoursUntilAppointment = (new Date(apt.appointmentTime) - new Date()) / (1000 * 60 * 60);
            if (hoursUntilAppointment < 1) score += 50;
            else if (hoursUntilAppointment < 4) score += 30;
            else if (hoursUntilAppointment < 8) score += 10;

            // Type-based priority
            if (apt.type === 'unloading') score += 20;
            if (apt.type === 'loading') score += 15;

            // Supplier priority
            if (apt.supplier.includes('Premium')) score += 25;

            return { ...apt, priorityScore: score };
        });

        // Sort by priority score
        const prioritizedQueue = scoredAppointments.sort((a, b) => b.priorityScore - a.priorityScore);

        res.json({
            algorithm: 'Priority Slot Algorithm',
            prioritizedQueue,
            totalAppointments: appointments.length,
            processingTime: '0.05s'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error running priority algorithm', error: error.message });
    }
});

module.exports = router;