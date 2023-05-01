const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const cors = require('cors');


const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "new_password",
  database: "product",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});

// Create a new product
app.post(
  "/products",
  [
    check("ProductName").isLength({ min: 1 }),
    check("Price").isNumeric(),
    check("Quantity").isInt({ min: 0 }),
    check("Stock").isInt({ min: 0 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ProductName, Price, Quantity, Stock } = req.body;
    const sql =
      "INSERT INTO Product (ProductName, Price, Quantity, Stock) VALUES (?, ?, ?, ?)";
    db.query(sql, [ProductName, Price, Quantity, Stock], (err, result) => {
      if (err) {
        throw err;
      }
      res.send("Product created");
    });
  }
);

// Get all products
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM Product";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

// Get a single product by ID
app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM Product WHERE Id = ?";
  db.query(sql, id, (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length === 0) {
      return res.status(404).send("Product not found");
    }
    res.send(result[0]);
  });
});

// Update a product
app.put(
  "/products/:id",
  [
    check("ProductName").optional().isLength({ min: 1 }),
    check("Price").optional().isNumeric(),
    check("Quantity").optional().isInt({ min: 0 }),
    check("Stock").optional().isInt({ min: 0 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { ProductName, Price, Quantity, Stock } = req.body;
    const sql =
      "UPDATE Product SET ProductName = ?, Price = ?, Quantity = ?, Stock = ? WHERE Id = ?";
    db.query(sql, [ProductName, Price, Quantity, Stock, id], (err, result) => {
      if (err) {
        throw err;
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Product not found");
      }
      res.send("Product updated");
    });
  }
);

// Delete a product
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Product WHERE Id = ?";
  db.query(sql, id, (err, result) => {
    if (err) {
      throw err;
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Product not found");
    }
    res.send("Product deleted");
  });
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
