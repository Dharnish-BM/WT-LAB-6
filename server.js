const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 3000;
const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "placementDB";
const COLLECTION_NAME = "students";

app.use(express.json());
app.use(cors());

async function connectDB() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    return client.db(DB_NAME).collection(COLLECTION_NAME);
}

// CREATE (Insert Student)
app.post('/add-student', async (req, res) => {
    try {
        const collection = await connectDB();
        await collection.insertOne(req.body);
        res.json({ message: "Student added successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add student" });
    }
});

// READ (Get All Students)
app.get('/get-students', async (req, res) => {
    try {
        const collection = await connectDB();
        const students = await collection.find().toArray();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

// UPDATE (Modify Student Details)
app.put('/update-student/:roll', async (req, res) => {
    try {
        const collection = await connectDB();
        const { roll } = req.params;
        const updatedData = req.body;

        const result = await collection.updateOne({ roll }, { $set: updatedData });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Student not found or data unchanged" });
        }

        res.json({ message: "Student updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update student" });
    }
});

// DELETE (Remove Student)
app.delete('/delete-student/:roll', async (req, res) => {
    try {
        const collection = await connectDB();
        await collection.deleteOne({ roll: req.params.roll });
        res.json({ message: "Student deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete student" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
