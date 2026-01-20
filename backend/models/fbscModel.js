const db = require('../config/db');

class FBSCModel {
  // Create new record
  static async create({ user_id, customer_name, product, pair, price, record_date, notes }) {
    try {
      const [result] = await db.query(
        `INSERT INTO fbsc_records 
          (user_id, customer_name, product, pair, price, record_date, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id, 
          customer_name, 
          product, 
          pair || 1, 
          parseFloat(price).toFixed(2), // Ensure decimal format
          record_date, 
          notes || null
        ]
      );
      return result.insertId;
    } catch (err) {
      console.error('[FBSC Create Error]', err);
      throw err;
    }
  }

  // Get all records with optional filtering
  static async getAll({ user_id, from, to, product, search, limit = 50, offset = 0 }) {
    try {
      const clauses = ['1=1'];
      const params = [];

      if (user_id) {
        clauses.push('r.user_id = ?');
        params.push(user_id);
      }

      if (from) {
        clauses.push('r.record_date >= ?');
        params.push(from);
      }

      if (to) {
        clauses.push('r.record_date <= ?');
        params.push(to);
      }

      if (product && product !== 'all') {
        clauses.push('r.product = ?');
        params.push(product);
      }

      if (search) {
        clauses.push('(r.customer_name LIKE ? OR r.product LIKE ? OR r.notes LIKE ?)');
        const likeSearch = `%${search}%`;
        params.push(likeSearch, likeSearch, likeSearch);
      }

      // Get total count for pagination
      const countSql = `
        SELECT COUNT(*) as total 
        FROM fbsc_records r
        WHERE ${clauses.join(' AND ')}
      `;
      const [countResult] = await db.query(countSql, params);
      const total = countResult[0]?.total || 0;

      // Get records
      const recordsSql = `
        SELECT 
          r.*, 
          u.first_name, 
          u.last_name,
          DATE_FORMAT(r.record_date, '%Y-%m-%d') as formatted_date,
          FORMAT(r.price, 2) as formatted_price
        FROM fbsc_records r
        LEFT JOIN users u ON r.user_id = u.user_id
        WHERE ${clauses.join(' AND ')}
        ORDER BY r.record_date DESC, r.created_at DESC
        LIMIT ? OFFSET ?
      `;

      const recordsParams = [...params, parseInt(limit), parseInt(offset)];
      const [rows] = await db.query(recordsSql, recordsParams);

      return {
        records: rows,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + rows.length) < total
        }
      };
    } catch (err) {
      console.error('[FBSC GetAll Error]', err);
      throw err;
    }
  }

  // Get record by ID
  static async getById(record_id) {
    try {
      const [rows] = await db.query(
        `SELECT 
          r.*, 
          u.first_name, 
          u.last_name,
          DATE_FORMAT(r.record_date, '%Y-%m-%d') as formatted_date,
          FORMAT(r.price, 2) as formatted_price
         FROM fbsc_records r
         LEFT JOIN users u ON r.user_id = u.user_id
         WHERE r.record_id = ?`,
        [record_id]
      );
      return rows[0] || null;
    } catch (err) {
      console.error('[FBSC GetById Error]', err);
      throw err;
    }
  }

  // Update record
  static async update(id, fields) {
    try {
      const keys = Object.keys(fields);
      if (!keys.length) return false;

      // Handle price formatting
      if (fields.price) {
        fields.price = parseFloat(fields.price).toFixed(2);
      }

      const setStr = keys.map(k => `${k} = ?`).join(', ');
      const params = keys.map(k => fields[k]);
      params.push(id);

      const [result] = await db.query(
        `UPDATE fbsc_records SET ${setStr} WHERE record_id = ?`,
        params
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error('[FBSC Update Error]', err);
      throw err;
    }
  }

  // Delete record
  static async delete(id) {
    try {
      const [result] = await db.query(
        `DELETE FROM fbsc_records WHERE record_id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error('[FBSC Delete Error]', err);
      throw err;
    }
  }

  // Get statistics - FIXED for decimal handling
  static async getStats({ user_id, from, to }) {
    try {
      let whereClause = '1=1';
      const params = [];

      if (user_id) {
        whereClause += ' AND r.user_id = ?';
        params.push(user_id);
      }

      if (from) {
        whereClause += ' AND r.record_date >= ?';
        params.push(from);
      }

      if (to) {
        whereClause += ' AND r.record_date <= ?';
        params.push(to);
      }

      console.log('[FBSC Stats] Querying with where:', whereClause, 'params:', params);

      // Get revenue statistics
      const [revenueStats] = await db.query(
        `SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(r.price), 0) as total_revenue,
          COALESCE(AVG(r.price), 0) as avg_order_value,
          MIN(r.record_date) as earliest_date,
          MAX(r.record_date) as latest_date
        FROM fbsc_records r
        WHERE ${whereClause}`,
        params
      );

      // Get today's orders
      const [todayStats] = await db.query(
        `SELECT 
          COUNT(*) as today_orders,
          COALESCE(SUM(r.price), 0) as today_revenue
        FROM fbsc_records r
        WHERE ${whereClause} AND DATE(r.record_date) = CURDATE()`,
        params
      );

      // Get top products
      const [topProducts] = await db.query(
        `SELECT 
          r.product,
          COUNT(*) as order_count,
          COALESCE(SUM(r.price), 0) as revenue
        FROM fbsc_records r
        WHERE ${whereClause}
        GROUP BY r.product
        ORDER BY revenue DESC
        LIMIT 10`,
        params
      );

      // Get monthly trend
      const [monthlyTrend] = await db.query(
        `SELECT 
          DATE_FORMAT(r.record_date, '%Y-%m') as month,
          COUNT(*) as orders,
          COALESCE(SUM(r.price), 0) as revenue
        FROM fbsc_records r
        WHERE ${whereClause}
        GROUP BY DATE_FORMAT(r.record_date, '%Y-%m')
        ORDER BY month DESC
        LIMIT 12`,
        params
      );

      const stats = revenueStats[0] || {
        total_orders: 0,
        total_revenue: 0,
        avg_order_value: 0,
        earliest_date: null,
        latest_date: null
      };

      return {
        revenue: {
          total_orders: parseInt(stats.total_orders) || 0,
          total_revenue: parseFloat(stats.total_revenue) || 0,
          avg_order_value: parseFloat(stats.avg_order_value) || 0,
          earliest_date: stats.earliest_date,
          latest_date: stats.latest_date,
          today_orders: parseInt(todayStats[0]?.today_orders) || 0,
          today_revenue: parseFloat(todayStats[0]?.today_revenue) || 0
        },
        topProducts: topProducts || [],
        monthlyTrend: monthlyTrend || []
      };
    } catch (err) {
      console.error('[FBSC Stats Query Error]', err);
      return {
        revenue: {
          total_orders: 0,
          total_revenue: 0,
          avg_order_value: 0,
          earliest_date: null,
          latest_date: null,
          today_orders: 0,
          today_revenue: 0
        },
        topProducts: [],
        monthlyTrend: []
      };
    }
  }

  // Get unique products for filter
  static async getProducts() {
    try {
      const [rows] = await db.query(
        `SELECT DISTINCT product FROM fbsc_records WHERE product IS NOT NULL AND product != '' ORDER BY product`
      );
      return rows.map(row => row.product);
    } catch (err) {
      console.error('[FBSC Products Error]', err);
      return [];
    }
  }
}

module.exports = FBSCModel;