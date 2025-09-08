import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const run = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI1 as string);
    console.log("MongoDB connected");

    // Defining aggregation
    const programName = "Software Engineering(("; 
    const db:any = mongoose.connection.db;

    const result = await db.collection("programs").aggregate([
      { $match: { name: programName } },
      {
        $lookup: {
          from: "campuses",
          let: { campusId: { $toObjectId: "$campus_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$campusId"] } } }
          ],
          as: "campusDetails"
        }
      },
      { $unwind: "$campusDetails" },
      {
        $lookup: {
          from: "addresses",
          let: { addressId: { $toObjectId: "$campusDetails.address_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$addressId"] } } }
          ],
          as: "addressDetails"
        }
      },
      { $unwind: "$addressDetails" },
      {
        $project: {
          _id: 0,
          programName: "$name",
          campusName: "$campusDetails.name",
          address: "$addressDetails.address_line_1"
        }
      }
    ]).toArray();

    console.log("Aggregation Result:");
    console.log(JSON.stringify(result, null, 2));

    // Exit
    await mongoose.disconnect();
    console.log("Disconnected");
  } catch (err) {
    console.error("Error running script:", err);
    process.exit(1);
  }
};

run();