// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors')
const multer = require("multer");
// Initialize the app
const app = express();
const port = 3000;

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Global variable to store student details
let students = [
    { id: 1, name: "John Doe", age: 20, grade: "A" },
    { id: 2, name: "Jane Smith", age: 22, grade: "B" }
];

// Routes

// Get all students
app.get("/students", (req, res) => {
    res.json(students);
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Get all students with marks
app.get("/students/marks", (req, res) => {
    res.json(students.map(item => {
        return {
            ...item,
            mark: getRandomInt(100),
        }
    }));
});

// Get a student by ID
app.get("/students/:id", (req, res) => {
    const studentId = parseInt(req.params.id, 10);
    const student = students.find((s) => s.id === studentId);
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ message: "Student not found" });
    }
});

// Add a new student
app.post("/students", (req, res) => {
    const { name, age, grade } = req.body;
    const newStudent = {
        id: students.length > 0 ? students[students.length - 1].id + 1 : 1,
        name,
        age,
        grade
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// Update a student by ID
app.put("/students/:id", (req, res) => {
    const studentId = parseInt(req.params.id, 10);
    const { name, age, grade } = req.body;
    const studentIndex = students.findIndex((s) => s.id === studentId);

    if (studentIndex !== -1) {
        students[studentIndex] = { id: studentId, name, age, grade };
        res.json(students[studentIndex]);
    } else {
        res.status(404).json({ message: "Student not found" });
    }
});

// Delete a student by ID
app.delete("/students/:id", (req, res) => {
    const studentId = parseInt(req.params.id, 10);
    const studentIndex = students.findIndex((s) => s.id === studentId);

    if (studentIndex !== -1) {
        students.splice(studentIndex, 1);
        res.json({ message: "Student deleted successfully" });
    } else {
        res.status(404).json({ message: "Student not found" });
    }
});

// File upload API
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.status(200).json({
        message: "File uploaded successfully",
        fileDetails: req.file
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
