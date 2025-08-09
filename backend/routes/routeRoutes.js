const express = require('express');
const router = express.Router();
const axios = require('axios');
const { pool } = require('../config/database');

// Route Optimization using Open Route API
router.post('/optimize', async (req, res) => {
    try {
        const { truckId, startLocation, destinations } = req.body;

        // Simulate Open Route API call
        const optimizedRoute = {
            truckId,
            startLocation,
            destinations,
            totalDistance: Math.floor(Math.random() * 500) + 100,
            estimatedTime: Math.floor(Math.random() * 480) + 60,
            fuelCost: Math.floor(Math.random() * 200) + 50,
            waypoints: destinations.map((dest, index) => ({
                order: index + 1,
                location: dest,
                estimatedArrival: new Date(Date.now() + (index + 1) * 3600000)
            }))
        };

        // Save route to database
        const [result] = await pool.execute(`
      INSERT INTO routes (truck_id, start_location, end_location, waypoints, distance_km, estimated_time_minutes, fuel_cost)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
            truckId,
            startLocation,
            destinations[destinations.length - 1],
            JSON.stringify(optimizedRoute.waypoints),
            optimizedRoute.totalDistance,
            optimizedRoute.estimatedTime,
            optimizedRoute.fuelCost
        ]);

        res.json({
            routeId: result.insertId,
            ...optimizedRoute,
            algorithm: 'Open Route Service'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error optimizing route', error: error.message });
    }
});

// Get active routes
router.get('/active', async (req, res) => {
    try {
        const [routes] = await pool.execute(`
      SELECT r.*, t.truck_number
      FROM routes r
      JOIN trucks t ON r.truck_id = t.id
      WHERE r.status = 'active'
    `);

        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching active routes', error: error.message });
    }
});

module.exports = router;