const { pool } = require('../config/database');

const assignTruckToDock = async (truckId, dockId, appointmentId) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Update dock status
        await connection.execute(
            'UPDATE docks SET status = ? WHERE id = ?',
            ['occupied', dockId]
        );

        // Update appointment
        await connection.execute(
            'UPDATE appointments SET dock_id = ?, status = ? WHERE id = ?',
            [dockId, 'in_progress', appointmentId]
        );

        // Update truck status
        await connection.execute(
            'UPDATE trucks SET status = ? WHERE id = ?',
            ['at_dock', truckId]
        );

        await connection.commit();
        return true;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const releaseDock = async (dockId) => {
    await pool.execute(
        'UPDATE docks SET status = ? WHERE id = ?',
        ['available', dockId]
    );
};

module.exports = {
    assignTruckToDock,
    releaseDock
};