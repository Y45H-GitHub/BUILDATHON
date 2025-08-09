const { pool } = require('../config/database');

const getAllProducts = async () => {
    const [products] = await pool.execute(`
    SELECT p.*, i.quantity, i.location
    FROM products p
    LEFT JOIN inventory i ON p.id = i.product_id
    ORDER BY p.name
  `);

    return products;
};

const getProductByBarcode = async (barcode) => {
    const [products] = await pool.execute(`
    SELECT p.*, i.quantity, i.location
    FROM products p
    LEFT JOIN inventory i ON p.id = i.product_id
    WHERE p.barcode = ?
  `, [barcode]);

    return products[0] || null;
};

const updateInventory = async (productId, location, quantity) => {
    await pool.execute(`
    INSERT INTO inventory (product_id, location, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)
  `, [productId, location, quantity]);
};

module.exports = {
    getAllProducts,
    getProductByBarcode,
    updateInventory
};