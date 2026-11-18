import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const readData = () => {
    const data = fs.readFileSync("./data/faculty.json", "utf-8");
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync("./data/faculty.json", JSON.stringify(data));
};

app.post("/api/v1/faculty", (req, res) => {
    const allFaculty = readData();
    const newFaculty = {
        id: allFaculty.length > 0
            ? Math.max(...allFaculty.map(f => f.id)) + 1
            : 1,
        ...req.body
    };

    allFaculty.push(newFaculty);
    writeData(allFaculty);

    res.status(201).json({
        message: "Faculty created successfully",
        data: newFaculty
    });
});

app.get("/api/v1/faculty", (req, res) => {
    const { dept } = req.query;
    const allFaculty = readData();

    if (dept) {
        const faculty = allFaculty.filter(f => f.dept === dept);
        res.json({
            message: "Faculty retrieved successfully",
            data: faculty
        });
    } else {
        res.json({
            message: "Faculty retrieved successfully",
            data: allFaculty
        });
    }
});

app.put("/api/v1/faculty/:id", (req, res) => {
    const facultyId = parseInt(req.params.id);
    const allFaculty = readData();
    const facultyIndex = allFaculty.findIndex(f => f.id === facultyId);

    if (facultyIndex !== -1) {
        const updatedFaculty = {
            ...allFaculty[facultyIndex],
            ...req.body
        };

        allFaculty[facultyIndex] = updatedFaculty;
        writeData(allFaculty);

        res.status(200).json({
            message: "Faculty updated successfully",
            data: updatedFaculty
        });
    } else {
        res.status(404).json({ message: "Faculty not found" });
    }
});

app.delete("/api/v1/faculty/:id", (req, res) => {
    const facultyId = parseInt(req.params.id);
    const allFaculty = readData();
    const facultyIndex = allFaculty.findIndex(f => f.id === facultyId);

    if (facultyIndex !== -1) {
        const deletedFaculty = allFaculty.splice(facultyIndex, 1);
        writeData(allFaculty);

        res.status(200).json({
            message: "Faculty deleted successfully",
            data: deletedFaculty[0]
        });
    } else {
        res.status(404).json({ message: "Faculty not found" });
    }
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
