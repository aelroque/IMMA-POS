import React from 'react';
import immasmall from '../immasmall.png';
import '../App.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <p>immature</p>
        <Link to="/login">
          <Button>
            <img src={immasmall} className="App-logo" alt="logo" />
          </Button>
        </Link>
        <p>Login</p>
      </header>
    </div>
  );
}

export default Home;
