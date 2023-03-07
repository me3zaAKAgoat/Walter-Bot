require("dotenv").config();
const mongoose = require("mongoose");
const Activity = require("../models/activity");
const channel = require("../models/channel");

console.log(process.env.MONGODB_URI);
mongoose
	.connect(process.env.MONGODB_URI)
	.then(console.log("connected to", process.env.MONGODB_URI));

// Activity.find({}).then((result) => console.log(result));
channel
	.deleteMany({ channel: "duplicate" })
	.then((result) => console.log(result));
// Activity.deleteMany({}).then((result) => console.log(result));

// Activity.find({}, async (err, documents) => {
// 	if (err) {
// 		console.error(err);
// 		return;
// 	}

// 	for (const doc of documents) {
// 		const oldValue = doc.vcTime;
// 		const newValue = Math.round(oldValue);

// 		try {
// 			await Activity.updateOne(
// 				{ _id: doc._id },
// 				{ $set: { vcTime: newValue } }
// 			);
// 			console.log(`Document ${doc._id} updated successfully.`);
// 		} catch (err) {
// 			console.error(`Error updating document ${doc._id}: ${err}`);
// 		}
// 	}

// 	console.log("All documents updated successfully.");
// });
