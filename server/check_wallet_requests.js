const mongoose = require('mongoose');
const dns = require('node:dns');

dns.setServers(['1.1.1.1', '8.8.8.8']);

const MONGO_URI = 'mongodb+srv://sanyuktparivar3_db_user:qQrOWLx4NO3a9b83@cluster0.bhprzwx.mongodb.net/sanyukt_db?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const adminDb = mongoose.connection.client.db().admin();
        const dbs = await adminDb.listDatabases();
        console.log('Databases on cluster:');
        console.log(dbs.databases.map(d => `${d.name} (${d.sizeOnDisk} bytes)`));

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

check();
