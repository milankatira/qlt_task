const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/product', async (req, res, next) => {
  try {
    const { ProductName, Price, Quantity, Stock } = req.body;

    // perform data validation here

    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO Product (ProductName, Price, Quantity, Stock) VALUES (?, ?, ?, ?)',
      [ProductName, Price, Quantity, Stock]
    );
    conn.release();
    res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
  } catch (err) {
    next(err);
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
