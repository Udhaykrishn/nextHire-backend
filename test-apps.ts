import axios from "axios";

async function test() {
	try {
		// We need to login as a user first. Do we have a test user?
		const loginRes = await axios.post("http://localhost:3001/api/v1/auth/user/login", {
			email: "test@example.com", // we might not know the exact email
			password: "password123",
		});
		console.log(loginRes.data);
	} catch (err) {
		console.error(err.message);
	}
}
test();
