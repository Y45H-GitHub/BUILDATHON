const express = require('express');
const router = express.Router();

// Instant Freight Quotes
router.post('/quote', async (req, res) => {
    try {
        const { origin, destination, weight, dimensions, urgency } = req.body;

        // Simulate freight cost calculation
        const baseRate = 2.5; // per kg
        const distanceMultiplier = Math.random() * 0.5 + 0.8; // 0.8-1.3
        const urgencyMultiplier = urgency === 'express' ? 1.5 : urgency === 'standard' ? 1.0 : 0.8;

        const estimatedCost = weight * baseRate * distanceMultiplier * urgencyMultiplier;
        const estimatedDays = urgency === 'express' ? 1 : urgency === 'standard' ? 3 : 7;

        const quote = {
            quoteId: `FQ${Date.now()}`,
            origin,
            destination,
            weight,
            dimensions,
            urgency,
            estimatedCost: Math.round(estimatedCost * 100) / 100,
            estimatedDays,
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            breakdown: {
                baseRate: weight * baseRate,
                distanceAdjustment: (distanceMultiplier - 1) * 100 + '%',
                urgencyAdjustment: (urgencyMultiplier - 1) * 100 + '%'
            }
        };

        res.json(quote);
    } catch (error) {
        res.status(500).json({ message: 'Error generating freight quote', error: error.message });
    }
});

// Get quote history
router.get('/quotes', async (req, res) => {
    try {
        // Simulate quote history
        const quotes = [
            {
                quoteId: 'FQ1704123456',
                origin: 'New York',
                destination: 'Los Angeles',
                cost: 1250.00,
                status: 'accepted',
                createdAt: new Date(Date.now() - 86400000)
            }
        ];

        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quote history', error: error.message });
    }
});

module.exports = router;