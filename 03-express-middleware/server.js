import express from "express";
import morgan from "morgan";
import fs from "fs";
import cors from "cors";
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const logger=(req,res,next)=>{
    const start = Date.now();
    res.on("finish",()=>{
        const duration = Date.now() - start;
        const log = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms\n`;
        console.log(log);;
    });
    next();
};
const validatepatent=(req,res,next)=>{
    const { name, age, gender } = req.body;
    if (!name || !age || !gender) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    next();
};
app.use(logger);
app.post("/api/v1/patients", validatepatent, (req, res) => {
    res.status(201).json({ message: "Patient created", patient: req.body });
});
app.get("/api/v1/patients", (req, res) => {
    res.status(200).json({ message: "List of patients" });
});
app.get("/api/v1/patients/:id", (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        const error = new Error("Invalid patient ID");
        error.status = 400;
        throw error;
    }
    res.status(200).json({ message: `Patient with ID ${id}` });
});
app.put("/api/v1/patients/:id", validatepatent, (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        const error = new Error("Invalid patient ID");
        error.status = 400;
        throw error;
    }
    res.status(200).json({ message: `Patient with ID ${id} updated`, patient: req.body });
});
app.delete("/api/v1/patients/:id", (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        const error = new Error("Invalid patient ID");
        error.status = 400;
        throw error;
    }
    res.status(200).json({ message: `Patient with ID ${id} deleted` });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message });
});
app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});
export default app;