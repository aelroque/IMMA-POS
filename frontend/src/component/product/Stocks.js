import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import AddProducts from './AddProduct.js';
import { Link } from 'react-router-dom';
import ComponentToPrint from './ComponentToPrint.js';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import UpdateProduct from './UpdateProduct.js';

function InStock() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await axios.get('http://localhost:8000/products');
        setProducts(products.data);
      } catch (err) {
        toast.error(err);
      }
    };
    fetchData();
  }, [products]);

  // const filteredItems = allItems.filter((items) => {
  //     if (items.name.toLowerCase().includes(query)) {
  //     return items
  //   }
  //   })
  // const filteredTotal = filteredItems.reduce((total, item)=> total+item.srp, 0).toFixed(2)

  const componentRef = useRef();

  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleToPrint = () => {
    handleReactToPrint();
  };

  // useEffect(() => {
  //   let newTotalAmount = 0;
  //   let findProduct = products.find(i => {
  //     return i.pid === products.pid
  //   });
  //   if (findProduct) {
  //     products.forEach(product =>
  //       newTotalAmount = product.instock * product.srp);
  //     setTotalAmount(newTotalAmount)
  //   }
  //   console.log(newTotalAmount);

  //   }, []);

  return (
    <Container className="text-white text-center py-3">
      <Row>
        <Col>
          <h1>Stocks</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={AddProducts}>
              <Link to="/products/add">Add Product</Link>
            </Button>
            <Button type="button">
              <Link to="/search/table">Product Search</Link>
            </Button>
            <Button type="button" onClick={handleToPrint}>
              Print
            </Button>
          </div>
        </Col>
      </Row>

      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>In Stock</th>
            <th>Unit Price</th>
            <th>Selling Price</th>
            <th>Unit Measure</th>
            <th>Brand Name</th>
            <th>Description</th>
            <th>Sub-Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.pid}>
              <td>{product.code}</td>
              <td>{product.pname}</td>
              <td>{product.category}</td>
              <td>{product.instock}</td>
              <td>{product.uprice}</td>
              <td>{product.srp}</td>
              <td>{product.uom}</td>
              <td>{product.brand}</td>
              <td>{product.descript}</td>
              <td>{product.srp * product.instock}</td>
              <td>
                <UpdateProduct product={product} id={`${product.pid}`} />
                {/* <i className="bi bi-archive"></i> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {filteredItems.map((item, i) => {
        return (
          <div className='item' key={Math.random()} pid={Math.random()}>
            <div className='text'>{i + 1}.{item.name} </div>
            <div className='number'>{(Math.round(item.srp * 100) / 100).toFixed(2)} </div>
          </div>
        )
      })} */}
      {/* <div>Inventory Cost: {totalAmount} </div> */}
      <div className="mb-3">
        <Button className="mb-3">
          <Link to="/dashboard">Dashboard</Link>
        </Button>
        <br />
      </div>
    </Container>
  );
}
export default InStock;
