const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://sanyuktparivar3_db_user:qQrOWLx4NO3a9b83@cluster0.bhprzwx.mongodb.net/sanyukt_db?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
        const Repurchase = mongoose.model('Repurchase', new mongoose.Schema({}, { strict: false }));
        const IncomeHistory = mongoose.model('IncomeHistory', new mongoose.Schema({}, { strict: false }));

        const user = await User.findOne({ memberId: 'SPRL1487' });
        if (!user) {
            console.log('User SPRL1487 not found');
        } else {
            console.log(`\n--- USER DATA: ${user.userName} (${user.memberId}) ---`);
            console.log(`_id: ${user._id}`);
            console.log(`Rank: ${user.rank}, Package: ${user.packageType}, Active: ${user.activeStatus}`);
            console.log(`Wallet: ${user.walletBalance}, PV: ${user.pv}, BV: ${user.bv}`);

            console.log('\n--- USER ORDERS ---');
            const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).lean();
            orders.forEach(o => {
                console.log(`Order ID: ${o._id}, Status: ${o.status}, Total: ${o.total}, BV: ${o.bv}, PV: ${o.pv}, Date: ${o.createdAt}`);
            });

            console.log('\n--- USER REPURCHASE RECORDS ---');
            const repurchases = await Repurchase.find({ userId: user._id }).sort({ createdAt: -1 }).lean();
            repurchases.forEach(r => {
                console.log(`ID: ${r._id}, Amount: ${r.amount}, BV: ${r.bv}, Status: ${r.status}, Date: ${r.createdAt}`);
            });

            console.log('\n--- USER INCOME HISTORY (Last 20) ---');
            const income = await IncomeHistory.find({ userId: user._id }).sort({ createdAt: -1 }).limit(20).lean();
            income.forEach(i => {
                console.log(`Type: ${i.type}, Amount: ${i.amount}, Description: ${i.description}, Date: ${i.createdAt}`);
            });
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

check();
