const mongoose = require("mongoose");

class DBConnector {
    constructor() {
        this.mongoosedb = mongoose;
        this.uri = "mongodb+srv://admin:skullking@skullking.end1wqk.mongodb.net/?retryWrites=true&w=majority";
        this.isConnected = false; // Connection status
        this.useMongoDB = false; // Toggle to enable/disable MongoDB connection
        this.localStorage = {}; // Local in-memory storage as a fallback
    }

    // Connects to the MongoDB database (if enabled)
    async connect() {
        if (!this.useMongoDB) {
            console.log("MongoDB connection is disabled. Using local storage instead.");
            return;
        }

        if (this.isConnected) {
            console.log("Already connected to MongoDB");
            return;
        }
        try {
            await this.mongoosedb.connect(this.uri);
            this.isConnected = true;
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Database connection failed:", error.message);
            throw error; // Propagate error
        }
    }

    // Ensures that a connection is established (if MongoDB is enabled)
    async ensureConnection() {
        if (this.useMongoDB && !this.isConnected) {
            console.log("No active database connection. Attempting to reconnect...");
            await this.connect();
        }
    }

    // Inserts a message into the specified collection (uses local storage if MongoDB is disabled)
    async insert(message, collection) {
        if (this.useMongoDB) {
            await this.ensureConnection();
            try {
                const result = await this.mongoosedb.connection.db.collection(collection).insertOne(message);
                console.log("1 record inserted:", result);
                return result; // Return result for further processing
            } catch (err) {
                console.error("Error inserting document:", err);
                throw err; // Propagate error
            }
        } else {
            if (!this.localStorage[collection]) {
                this.localStorage[collection] = [];
            }
            this.localStorage[collection].push(message);
            console.log(`1 record inserted into local storage collection '${collection}':`, message);
            return { insertedId: this.localStorage[collection].length - 1 }; // Simulate MongoDB result
        }
    }

    // Updates a document in the specified collection (uses local storage if MongoDB is disabled)
    async update(myquery, newvalues, collection) {
        if (this.useMongoDB) {
            await this.ensureConnection();
            try {
                const result = await this.mongoosedb.connection.db.collection(collection).updateOne(myquery, newvalues);
                console.log("1 document updated:", result);
                return result; // Return result for further processing
            } catch (err) {
                console.error("Error updating document:", err);
                throw err; // Propagate error
            }
        } else {
            if (!this.localStorage[collection]) {
                console.warn(`Local storage collection '${collection}' does not exist.`);
                return { matchedCount: 0, modifiedCount: 0 }; // Simulate MongoDB result
            }
            let updatedCount = 0;
            for (let i = 0; i < this.localStorage[collection].length; i++) {
                const item = this.localStorage[collection][i];
                if (Object.keys(myquery).every(key => item[key] === myquery[key])) {
                    this.localStorage[collection][i] = { ...item, ...newvalues.$set };
                    updatedCount++;
                }
            }
            console.log(`${updatedCount} documents updated in local storage collection '${collection}'.`);
            return { matchedCount: updatedCount, modifiedCount: updatedCount }; // Simulate MongoDB result
        }
    }
}

module.exports.DBConnector = DBConnector;
