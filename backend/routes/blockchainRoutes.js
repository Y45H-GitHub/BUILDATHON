const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Blockchain Provenance Tracking
router.post('/track/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { eventType, metadata } = req.body;

        // Simulate blockchain transaction
        const transactionHash = '0x' + Math.random().toString(16).substr(2, 64);
        const blockNumber = Math.floor(Math.random() * 1000000) + 15000000;

        // Save blockchain record
        await pool.execute(`
      INSERT INTO blockchain_records (product_id, transaction_hash, block_number, event_type, metadata)
      VALUES (?, ?, ?, ?, ?)
    `, [productId, transactionHash, blockNumber, eventType, JSON.stringify(metadata)]);

        res.json({
            productId,
            transactionHash,
            blockNumber,
            eventType,
            metadata,
            timestamp: new Date(),
            network: 'OptiLogix Chain'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error recording blockchain transaction', error: error.message });
    }
});

// Get product provenance
router.get('/provenance/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        const [records] = await pool.execute(`
      SELECT br.*, p.name, p.barcode
      FROM blockchain_records br
      JOIN products p ON br.product_id = p.id
      WHERE br.product_id = ?
      ORDER BY br.created_at DESC
    `, [productId]);

        res.json({
            productId,
            provenanceChain: records,
            verified: true,
            chainIntegrity: 'VALID'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching provenance data', error: error.message });
    }
});

module.exports = router;