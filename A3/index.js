const bodyParser = require('body-parser');
const express = require('express');
const mysql = require("mysql");

const app = express();

const PORT = 8080;

const connection = mysql.createConnection({
    host: "database-1.cluster-c5nfrwsooyyf.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "rootroot"
});

connection.connect((err) => {
    if (err) {
        console.error("Failed to connect to the database:", err);
        return;
    }
    connection.query("CREATE DATABASE IF NOT EXISTS your_database_name", (err) => {
        if (err) {
            console.error("Failed to create database:", err);
            return;
        }
        console.log("Database created");
        connection.query("USE your_database_name", (err) => {
            if (err) {
                console.error("Failed to select database:", err);
                return;
            }
            console.log("Database selected");
            createProductsTable();
        });
    });
});


function createProductsTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            availability BOOLEAN NOT NULL DEFAULT true
        )
    `;
    connection.query(query, (err) => {
        if (err) {
            console.error("Failed to create products table:", err);
            return;
        }
        console.log("Products table created");
    });
}

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("<h1>EC2 hello!</h1>");
});

app.get("/products", (req, res) => {
    const query = "SELECT * FROM products";
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Failed to fetch products:", err);
            res.status(500).json({ error: "Failed to fetch products" });
            return;
        }
        res.status(200).json({ products: results });
    });
});

app.post("/products", (req, res) => {
    const { name, price, availability } = req.body;
    const query = "INSERT INTO products (name, price, availability) VALUES (?, ?, ?)";
    connection.query(query, [name, price, availability], (err, result) => {
        if (err) {
            console.error("Failed to store product:", err);
            res.status(500).json({ error: "Failed to store product" });
            return;
        }
        res.status(200).json({ message: "Product stored successfully" });
    });
});

app.put("/products/:id", (req, res) => {
    const { id } = req.params;
    const { name, price, availability } = req.body;
    const query = "UPDATE products SET name = ?, price = ?, availability = ? WHERE id = ?";
    connection.query(query, [name, price, availability, id], (err, result) => {
        if (err) {
            console.error("Failed to update product:", err);
            res.status(500).json({ error: "Failed to update product" });
            return;
        }
        res.status(200).json({ message: "Product updated successfully" });
    });
});

app.delete("/products/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM products WHERE id = ?";
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Failed to delete product:", err);
            res.status(500).json({ error: "Failed to delete product" });
            return;
        }
        res.status(200).json({ message: "Product deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
