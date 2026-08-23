const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connected to MongoDB");
        return true;

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return false;
    }
};

module.exports = { connectDB };