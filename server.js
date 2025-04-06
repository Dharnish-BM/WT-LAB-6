const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
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

// CREATE - Add new student
app.post('/add-student', async (req, res) => {
    try {
        const collection = await connectDB();
        await collection.insertOne(req.body);
        res.json({ message: "Student added successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add student" });
    }
});

// READ - Get all students
app.get('/get-students', async (req, res) => {
    try {
        const collection = await connectDB();
        const students = await collection.find().toArray();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

// UPDATE - Update student by MongoDB _id
app.put('/update-student/:id', async (req, res) => {
    try {
        const collection = await connectDB();
        const { id } = req.params;
        const updatedData = req.body;

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Student not found or data unchanged" });
        }

        res.json({ message: "Student updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update student" });
    }
});

// DELETE - Remove student by roll number
app.delete('/delete-student/:roll', async (req, res) => {
    try {
        const collection = await connectDB();
        await collection.deleteOne({ roll: req.params.roll });
        res.json({ message: "Student deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete student" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
