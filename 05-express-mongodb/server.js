import express from "express";
import { MongoClient, ObjectId }from "mongodb";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const MONGO_URI = "mongodb://admin:admin@localhost:27017/?authSource=admin";
const dbName = "books";
const client = new MongoClient(MONGO_URI);
let db
client.connect().then(() => {
    console.log("Connected to MongoDB");
    db = client.db(dbName);
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});
app.post("/api/v1/books", (req, res)=> {
    try {
        const book = req.body;
        const result = db.collection("books").insertOne(book);
        res.status(201).json({ message: "Book created", data: {_id: result.insertedId, ...book}, });
    } catch (err) {
        err.status = 500;
        err.message = "Error creating book";
        next(err);
    }
});
app.get("/api/v1/books", (req, res)=> {
    try {
        const category = req.query;
        const query = category ? { category } : {};
        const books = db.collection("books").find(query).toArray();
        res.status(200).json({ message: "List of books", data: books });
    } catch (err) {
        err.status = 500;
        err.message = "Error fetching books";
        next(err);
    }
});
app.get("/api/v1/books/:id", (req, res, next)=> {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            const error = new Error("Invalid book ID");
            error.status = 400;
            throw error;
        }
        const book = db.collection("books").findOne({ _id: new ObjectId(id) });
        if (!book) {
            const error = new Error("Book not found");
            error.status = 404;
            throw error;
        }
        res.status(200).json({ message: `Book with ID ${id}`, data: book });
    } catch (err) {
        next(err);
    }
});
app.put("/api/v1/books/:id", (req, res, next)=> {
    try {
        const { id } = req.params;
        const updatedBook = req.body;
        if (!ObjectId.isValid(id)) {
            const error = new Error("Invalid book ID");
            error.status = 400;
            throw error;
        }
        const result = db.collection("books").updateOne({ _id: new ObjectId(id) }, { $set: updatedBook });
        if (result.matchedCount === 0) {
            const error = new Error("Book not found");
            error.status = 404;
            throw error;
        }
        res.status(200).json({ message: `Book with ID ${id} updated`, data: updatedBook });
    } catch (err) {
        next(err);
    }
});
app.delete("/api/v1/books/:id", (req, res, next)=> {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            const error = new Error("Invalid book ID");
            error.status = 400;
            throw error;
        }
        const result = db.collection("books").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            const error = new Error("Book not found");
            error.status = 404;
            throw error;
        }
        res.status(200).json({ message: `Book with ID ${id} deleted` });
    } catch (err) {
        next(err);
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message });
});
app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});
const PORT =7000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});