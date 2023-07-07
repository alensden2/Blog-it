const bodyParser = require('body-parser');
const express = require('express');
const mysql = require("mysql");

const app = express();

const PORT = 80;

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
    connection.query("CREATE DATABASE IF NOT EXISTS assignment2", (err) => {
        if (err) {
            console.error("Failed to create database:", err);
            return;
        }
        console.log("Database created");
        connection.query("USE assignment2", (err) => {
            if (err) {
                console.error("Failed to select database:", err);
                return;
            }
            console.log("Database selected");
            createProductsTable();
        });
    });
});

// Create the products table if it doesn't exist
function createProductsTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS products (
            name VARCHAR(100) NOT NULL,
            price VARCHAR(100) NOT NULL,
            availability BOOLEAN NOT NULL
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

app.post("/store-products", (req, res) => {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
        res.status(400).json({ error: "Invalid request payload" });
        return;
    }
    const insertQuery = "INSERT INTO products (name, price, availability) VALUES (?, ?, ?)";
    const insertPromises = products.map(product => {
        const { name, price, availability } = product;
        return new Promise((resolve, reject) => {
            connection.query(insertQuery, [name, price, availability], (err, result) => {
                if (err) {
                    console.error("Failed to store product:", err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
    Promise.all(insertPromises)
        .then(() => {
            res.status(200).json({ message: "Products stored successfully" });
        })
        .catch(error => {
            res.status(500).json({ error: "Failed to store products" });
        });
});

app.get("/list-products", (req, res) => {
    const selectQuery = "SELECT name, price, availability FROM products";
    connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error("Failed to fetch products:", err);
            res.status(500).json({ error: "Failed to fetch products" });
            return;
        }
        const productList = results.map(row => ({
            name: row.name,
            price: row.price,
            availability: row.availability
        }));
        res.status(200).json({ products: productList });
    });
});

createProductsTable();

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
