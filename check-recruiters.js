const { MongoClient } = require('mongodb');
require('dotenv').config();

async function check() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const recruiters = await db.collection('recruiters').find({}).toArray();
    console.log("Recruiters count:", recruiters.length);
    recruiters.forEach(r => {
      console.log(`Email: ${r.email}, Verified: ${r.is_verified_company}, JobCount: ${r.job_count}, Subscribed: ${r.subscription?.is_subscribed}`);
    });
  } catch(e) { console.error(e); } finally { client.close(); }
}
check();
