const { pool } = require('../config/database');

const bookAppointment = async (truckId, supplier, requestedTime, type) => {
    const [result] = await pool.execute(
        'INSERT INTO appointments (truck_id, supplier, appointment_time, type) VALUES (?, ?, ?, ?)',
        [truckId, supplier, requestedTime, type]
    );

    const [appointment] = await pool.execute(
        'SELECT * FROM appointments WHERE id = ?',
        [result.insertId]
    );

    return appointment[0];
};

const updateAppointmentStatus = async (appointmentId, status) => {
    await pool.execute(
        'UPDATE appointments SET status = ? WHERE id = ?',
        [status, appointmentId]
    );

    const [appointment] = await pool.execute(
        'SELECT * FROM appointments WHERE id = ?',
        [appointmentId]
    );

    return appointment[0];
};

const getAppointmentById = async (appointmentId) => {
    const [appointments] = await pool.execute(
        'SELECT * FROM appointments WHERE id = ?',
        [appointmentId]
    );

    return appointments[0];
};

module.exports = {
    bookAppointment,
    updateAppointmentStatus,
    getAppointmentById
};