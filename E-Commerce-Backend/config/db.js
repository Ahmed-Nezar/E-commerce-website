const mongoose = require('mongoose');

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connectDB() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(process.env.MONGO_URI, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Connected to MongoDB (Online - Cloud)");
    } catch (e) {
        throw new Error("Error connecting to MongoDB (Online - Cloud)");
    }
}

connectDB().catch(e => console.error(e));
