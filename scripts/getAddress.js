"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const run = async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGO_URI1);
        console.log("MongoDB connected");
        // Defining aggregation
        const programName = "Software Engineering((";
        const db = mongoose_1.default.connection.db;
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
        await mongoose_1.default.disconnect();
        console.log("Disconnected");
    }
    catch (err) {
        console.error("Error running script:", err);
        process.exit(1);
    }
};
exports.run = run;
(0, exports.run)();
