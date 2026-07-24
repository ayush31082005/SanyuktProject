const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const connectDB = require('./config/Database');

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    startCronJobs();
});

function startCronJobs() {
    const mlmController = require('./controllers/mlmController');
    const Order = require('./models/Order');
    const PROFIT_SHARING_ORDER_STATUSES = ['paid', 'delivered'];

    // At 11:59 PM calculate matching bonus + profit sharing
    // Simple interval-based scheduler (works even if node-cron is not installed)
    const MIDNIGHT_MS = 24 * 60 * 60 * 1000;

    const msUntilMidnight = () => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(23, 59, 0, 0);
        if (midnight <= now) midnight.setDate(midnight.getDate() + 1);
        return midnight - now;
    };

    const scheduleDailyJobs = async () => {
        console.log('[CRON] Running daily MLM jobs...');
        try {
            await mlmController.calculateDailyMatchingBonus();
            console.log('[CRON] Matching bonus done');

            // Only paid and delivered orders should contribute to turnover.
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayOrders = await Order.find({
                createdAt: { $gte: today },
                status: { $in: PROFIT_SHARING_ORDER_STATUSES },
            });
            const dailyTurnover = todayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

            if (dailyTurnover > 0) {
                await mlmController.distributeProfitSharing(dailyTurnover);
                console.log(
                    `[CRON] Profit sharing done on Rs ${dailyTurnover} turnover from ${PROFIT_SHARING_ORDER_STATUSES.join('/')} orders`
                );
            }

            await mlmController.updateAllRanks();
            console.log('[CRON] Ranks updated');
        } catch (err) {
            console.error('[CRON] Error in daily jobs:', err.message);
        }

        setTimeout(scheduleDailyJobs, MIDNIGHT_MS);
    };

    const firstRun = msUntilMidnight();
    console.log(`[CRON] Daily jobs scheduled - first run in ${Math.round(firstRun / 60000)} minutes`);
    setTimeout(scheduleDailyJobs, firstRun);
}
