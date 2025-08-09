const { pool } = require('../config/database');

const handleTruckArrival = async (truckId, appointmentId) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Update appointment status
        await connection.execute(
            'UPDATE appointments SET status = ? WHERE id = ?',
            ['arrived', appointmentId]
        );

        // Update truck status
        await connection.execute(
            'UPDATE trucks SET status = ? WHERE id = ?',
            ['available', truckId]
        );

        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const handleTruckDeparture = async (truckId, appointmentId) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Get appointment details
        const [appointments] = await connection.execute(
            'SELECT dock_id FROM appointments WHERE id = ?',
            [appointmentId]
        );

        if (appointments[0]?.dock_id) {
            // Release dock
            await connection.execute(
                'UPDATE docks SET status = ? WHERE id = ?',
                ['available', appointments[0].dock_id]
            );
        }

        // Update truck status
        await connection.execute(
            'UPDATE trucks SET status = ? WHERE id = ?',
            ['in_transit', truckId]
        );

        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    handleTruckArrival,
    handleTruckDeparture
};