require("dotenv").config();
const db = require("../config/db");
const nodemailer = require("nodemailer");

async function checkEventsAndNotify() {
  try {
    // ✉️ Setup transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    /* ===============================
       1. Send Event Notifications (Today)
    ================================ */
    const [events] = await db.query(
      `SELECT e.event_id, e.event_name, e.event_description, e.event_date, u.email
       FROM events e
       JOIN users u ON e.user_id = u.user_id
       WHERE DATE(e.event_date) = CURDATE()
       AND e.notified_on_day IS NULL`
    );

    for (const event of events) {
      await transporter.sendMail({
        from: `"Event Reminder" <${process.env.EMAIL_USER}>`,
        to: event.email,
        subject: `📅 Event Reminder: ${event.event_name}`,
        text: `Hello,

Reminder: Your event "${event.event_name}" is scheduled for today (${event.event_date}).

Description: ${event.event_description || "No description"}

Thank you!`,
      });

      // ✅ Mark as notified
      await db.query(
        "UPDATE events SET notified_on_day = NOW() WHERE event_id = ?",
        [event.event_id]
      );

      console.log(`✅ Event email sent: ${event.event_name} → ${event.email}`);
    }

    if (events.length === 0) {
      console.log("ℹ️ No events today or already notified.");
    }

    /* ===============================
       2. Send Birthday Reminders (3 days before)
    ================================ */
    const [birthdays] = await db.query(`
      SELECT user_id, first_name, last_name, email, date_of_birth
      FROM users
      WHERE DATE_FORMAT(date_of_birth, '%m-%d') = DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 3 DAY), '%m-%d')
    `);

    for (const user of birthdays) {
      await transporter.sendMail({
        from: `"Birthday Wishes" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `🎂 Early Happy Birthday, ${user.first_name}!`,
        html: `<p>Dear ${user.first_name} ${user.last_name},</p>
               <p>We noticed your birthday is coming up in <b>3 days</b> 🎉</p>
               <p>We want to wish you a very happy birthday in advance! 🥳🎁</p>
               <p>May this year bring you happiness and success.</p>
               <br>
               <p>— The BrothersCloud Team</p>`,
      });

      console.log(`🎂 Birthday email sent to ${user.first_name} → ${user.email}`);
    }

    if (birthdays.length === 0) {
      console.log("ℹ️ No birthdays in 3 days.");
    }

    console.log("✅ All notifications (events + birthdays) processed.");
  } catch (err) {
    console.error("❌ Error in notifier:", err.message);
  }
}

module.exports = checkEventsAndNotify;
