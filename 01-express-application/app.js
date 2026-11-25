import express from "express";
const app = express();
app.use(express.json());
console.log("Express application is running");
const products = [];
app.post("/products", (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    res.status(201).json({message: "Product created successfully", data: newProduct});
});
app.get("/products", (req, res) => {
    res.json({message: "Products retrieved successfully", data: products});
});
app.get("/products/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json({message: "Product retrieved successfully", data: product});
    } else {
        res.status(404).json({message: "Product not found"});
    }
});
app.put("/products/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedProduct }
        res.json({message: "Product updated successfully", data: products[productIndex]});
    } else {
        res.status(404).json({message: "Product not found"});
    }
});
app.delete("/products/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1);
        res.json({message: "Product deleted successfully", data: deletedProduct[0]});
    } else {
        res.status(404).json({message: "Product not found"});
    }
});
const PORT = process.env.PORT || 3000;

export default app;
//curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -d '{"id":1,"name":"Product 1","price":100}'{"message":"Product created successfully","data":{"id":1,"name":"Product 1","price":100}}
//curl -X GET http://localhost:3000/products{"message":"Products retrieved successfully","data":[{"id":1,"name":"Product 1","price":100}]}
//curl -X GET http://localhost:3000/products/1{"message":"Product retrieved successfully","data":{"id":1,"name":"Product 1","price":100}}
//curl -X PUT http://localhost:3000/products/1 -H "Content-Type: application/json" -d '{"name":"Updated Product 1","price":150}'{"message":"Product updated successfully","data":{"id":1,"name":"Updated Product 1","price":150}}
//curl -X DELETE http://localhost:3000/products/1{"message":"Product deleted successfully","data":{"id":1,"name":"Updated Product 1","price":150}}