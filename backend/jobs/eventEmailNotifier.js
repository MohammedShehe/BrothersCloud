const cron = require("node-cron");
const checkEventsAndNotify = require("../utils/notifier");

// 🕒 Run every day at 00 AM
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running daily notifier (events + birthdays)...");
  await checkEventsAndNotify();
});

// 🚀 Run once at startup (for testing)
(async () => {
  console.log("🚀 Running notifier immediately (startup test)...");
  await checkEventsAndNotify();
})();
