import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Navbar } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { LinkContainer } from 'react-router-bootstrap';

const Dashboard = () => {
  const signoutHandler = () => {
    toast.success('Logged out from the application.');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <Container className="container-fluid">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="top-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>immature</Navbar.Brand>
              </LinkContainer>
              <Link className="nav-link" to="login">
                <i className="fas fa-user" />
                {''} Login
              </Link>
            </Container>
          </Navbar>
        </header>

        <div>
          <h3 className="my-3">Dashboard</h3>
          <Link to="/pos">Cart</Link>
          <br />
          <Link to="/featured">eCommerce</Link>
          <br />
          <Link to="/search">Price List</Link>
          <br />
          <br />
          <Link to="/products">In Stocks</Link>
          <br />
          <Link to="/products/add">Add Product</Link>
          <br />
          <Link to="/search/table">Search Product in Table</Link>
          <br />
          <br />
          <Link to="/products/receiving">Incoming Deliveries</Link>
          <br />
          <Link to="/products/purchasing">Purchase Order</Link>
          <br />
          <br />
          <Link>*Client Management</Link>
          <br />
          <br />
          <br />
          <Link to="/suppliers">View Supplier</Link>
          <br />
          <Link to="/suppliers/add">Create Supplier</Link>
          <br />
          <br />
          <br />
          <Link to="/users">View User</Link>
          <br />
          <br />
          <br />
          <Link>*Settings</Link>
          <br />
          <br />
          <Link to="/" onClick={signoutHandler}>
            Signout
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
