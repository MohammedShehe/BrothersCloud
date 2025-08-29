const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET birthdays coming in 3 days
router.get("/", async (req, res) => {
  try {
    const [birthdays] = await db.query(`
      SELECT user_id, first_name, last_name, email, date_of_birth
      FROM users
      WHERE DATE_FORMAT(date_of_birth, '%m-%d') = DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 3 DAY), '%m-%d')
    `);

    res.json(birthdays);
  } catch (err) {
    console.error("❌ Error fetching birthdays:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
