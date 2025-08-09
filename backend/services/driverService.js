const { pool } = require('../config/database');

const getDriverAssignment = async (truckId) => {
    const [assignments] = await pool.execute(`
    SELECT 
      a.*,
      d.dock_number,
      d.dock_type,
      r.start_location,
      r.end_location,
      r.distance_km,
      r.estimated_time_minutes
    FROM appointments a
    LEFT JOIN docks d ON a.dock_id = d.id
    LEFT JOIN routes r ON r.truck_id = a.truck_id AND r.status = 'active'
    WHERE a.truck_id = ? AND a.status IN ('scheduled', 'arrived', 'in_progress')
    ORDER BY a.appointment_time ASC
    LIMIT 1
  `, [truckId]);

    return assignments[0] || null;
};

const updateDriverLocation = async (truckId, location) => {
    await pool.execute(
        'UPDATE trucks SET current_location = ? WHERE id = ?',
        [location, truckId]
    );
};

module.exports = {
    getDriverAssignment,
    updateDriverLocation
};