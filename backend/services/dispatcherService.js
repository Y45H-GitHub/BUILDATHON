const { pool } = require('../config/database');

const getDockStatus = async () => {
    const [docks] = await pool.execute(`
    SELECT d.*, a.truck_id, a.supplier, a.appointment_time
    FROM docks d
    LEFT JOIN appointments a ON d.id = a.dock_id AND a.status = 'in_progress'
  `);

    return docks;
};

const getTruckQueue = async () => {
    const [queue] = await pool.execute(`
    SELECT a.*, t.truck_number, t.driver_id
    FROM appointments a
    JOIN trucks t ON a.truck_id = t.id
    WHERE a.status = 'arrived'
    ORDER BY a.priority_score DESC, a.appointment_time ASC
  `);

    return queue;
};

const getAppointments = async (truckId = null) => {
    let query = `
    SELECT a.*, t.truck_number, d.dock_number
    FROM appointments a
    JOIN trucks t ON a.truck_id = t.id
    LEFT JOIN docks d ON a.dock_id = d.id
  `;

    const params = [];
    if (truckId) {
        query += ' WHERE a.truck_id = ?';
        params.push(truckId);
    }

    query += ' ORDER BY a.appointment_time DESC';

    const [appointments] = await pool.execute(query, params);
    return appointments;
};

const getRecentAssignments = async () => {
    const [assignments] = await pool.execute(`
    SELECT a.*, t.truck_number, d.dock_number
    FROM appointments a
    JOIN trucks t ON a.truck_id = t.id
    JOIN docks d ON a.dock_id = d.id
    WHERE a.status IN ('in_progress', 'completed')
    ORDER BY a.updated_at DESC
    LIMIT 10
  `);

    return assignments;
};

module.exports = {
    getDockStatus,
    getTruckQueue,
    getAppointments,
    getRecentAssignments
};