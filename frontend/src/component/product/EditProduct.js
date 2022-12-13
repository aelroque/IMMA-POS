import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateProduct = ({ product, pid }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [updatedPname, setUpdatedPname] = useState(product.pname);
  const [updatedCategory, setUpdatedCategory] = useState(product.category);
  const [updatedBrand, setUpdatedBrand] = useState(product.brand);

  const [errMsg, setErrMsg] = useState('');

  const editProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8000/products/update/${product.pid}`,
        JSON.stringify({
          pname: updatedPname,
          category: updatedCategory,
          brand: updatedBrand,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          //withCredentials: true
        }
      );
      toast.success('Updated Successfully');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
        toast.err('No Server Response');
      } else {
        setErrMsg('Failed to add product');
        toast.err('Failed to add product');
      }
    }
  };

  return (
    <>
      <Button
        className='"btn btn-primary'
        onClick={handleShow}
        controlledid={product.pid}
      >
        <i className="bi bi-pencil"></i>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={(e) => editProduct(e)} controlledid={product.pid}>
            <Form.Group className="mb-3" controlledid="updatedPname">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="updatedPname"
                defaultValue={updatedPname}
                onChange={(e) => setUpdatedPname(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlledid="updatedCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="updatedCategory"
                defaultValue={updatedCategory}
                onChange={(e) => setUpdatedCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlledid="updatedBrand">
              <Form.Label>Brand Name</Form.Label>
              <Form.Control
                type="updatedBrand"
                defaultValue={updatedBrand}
                onChange={(e) => setUpdatedBrand(e.target.value)}
              />
            </Form.Group>

            <Modal.Footer>
              <Button type="submit">Update</Button>
              <Button className="btn btn-secondary" onClick={handleClose}>
                Back
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UpdateProduct;
