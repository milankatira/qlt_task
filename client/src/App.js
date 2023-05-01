import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    ProductName: "",
    Price: "",
    Quantity: "",
    Stock: "",
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:4000/products").then((res) => {
      setProducts(res.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:4000/products", newProduct).then(() => {
      setNewProduct({
        ProductName: "",
        Price: "",
        Quantity: "",
        Stock: "",
      });
      axios.get("http://localhost:4000/products").then((res) => {
        setProducts(res.data);
      });
    });
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setNewProduct(product);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:4000/products/${editProduct.Id}`, newProduct)
      .then(() => {
        setEditProduct(null);
        setNewProduct({
          ProductName: "",
          Price: "",
          Quantity: "",
          Stock: "",
        });
        axios.get("http://localhost:4000/products").then((res) => {
          setProducts(res.data);
        });
      });
  };

  const handleDelete = (product) => {
    axios.delete(`http://localhost:4000/products/${product.Id}`).then(() => {
      axios.get("http://localhost:4000/products").then((res) => {
        setProducts(res.data);
      });
    });
  };

  return (
    <div className="App">
      <h1>Product Manager</h1>
      <form onSubmit={editProduct ? handleUpdate : handleSubmit}>
        <label>
          Product Name:
          <input
            type="text"
            name="ProductName"
            value={newProduct.ProductName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            name="Price"
            value={newProduct.Price}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Quantity:
          <input
            type="number"
            name="Quantity"
            value={newProduct.Quantity}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Stock:
          <input
            type="number"
            name="Stock"
            value={newProduct.Stock}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">{editProduct ? "Update" : "Add"}</button>
        {editProduct && (
          <button onClick={() => setEditProduct(null)}>Cancel</button>
        )}
      </form>
      <hr />
      <table>
  <thead>
    <tr>
      <th>Product Name</th>
      <th>Price</th>
      <th>Quantity</th>
      <th>Stock</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {products.map((product) => (
      <tr key={product.Id}>
        <td>{product.ProductName}</td>
        <td>{product.Price}</td>
        <td>{product.Quantity}</td>
        <td>{product.Stock}</td>
        <td>
          <button onClick={() => handleEdit(product)}>Edit</button>
          <button onClick={() => handleDelete(product)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

</div>
  )}


  export default App;