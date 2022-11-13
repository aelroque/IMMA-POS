import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function AddProduct() {
  const [pname, setPname] = useState('');
  const [instock, setInstock] = useState('');
  const [uprice, setUprice] = useState('');
  const [srp, setSrp] = useState('');
  const [category, setCategory] = useState('');
  const [uom, setUom] = useState('');
  const [brand, setBrand] = useState('');
  const [descript, setDescript] = useState('');

  const [success, setSuccess] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setSuccess(true);
    setPname('');
    setInstock('');
    setUprice('');
    setSrp('');
    setUom('');
    setCategory('');
    setBrand('');
    setDescript('');
  }, []);
 
  const createHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/products/add',
        JSON.stringify({
          pname,
          instock,
          uprice,
          srp,
          category,
          uom,
          brand,
          descript,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          //withCredentials: true
        }
      );
      console.log(response);
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else {
        setErrMsg('Failed to add product');
      }
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Create Product</title>
      </Helmet>

      <section>
        <p>{errMsg}</p>
        <h1 className="my-3">Add Products</h1>
        <Form onSubmit={createHandler}>
          <Form.Group className="mb-3" controlId="pname">
            <Form.Label>Product Name</Form.Label>
            <Form.Control onChange={(e) => setPname(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand Name</Form.Label>
            <Form.Control onChange={(e) => setBrand(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="instock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type="instock"
              required
              onChange={(e) => setInstock(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="uprice">
            <Form.Label>U. Price</Form.Label>
            <Form.Control
              type="uprice"
              required
              onChange={(e) => setUprice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="srp">
            <Form.Label>Selling Price</Form.Label>
            <Form.Control
              type="srp"
              required
              onChange={(e) => setSrp(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="uom">
            <Form.Label>Unit Measure</Form.Label>
            <Form.Control
              type="uom"
              required
              onChange={(e) => setUom(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="srp"
              required
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="descript">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="descript"
              required
              onChange={(e) => setDescript(e.target.value)}
            />
          </Form.Group>

          <div className="mb-3">
            <Button type="submit">Add Product</Button>
            <Button>
              <Link to="/products">Featured Products</Link>
            </Button>
            <Button>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <br />
          </div>
        </Form>
      </section>
    </Container>
  );
};
