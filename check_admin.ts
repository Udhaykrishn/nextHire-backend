import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function check() {
	console.log("Connecting to", process.env.MONGODB_URI);
	await mongoose.connect(process.env.MONGODB_URI);
	const admins = await mongoose.connection.collection("admins").find().toArray();
	console.log("Admins:", admins);
	process.exit(0);
}
check();
