import React from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/login',
        JSON.stringify({ username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          //withCredentials: true
        }
      );
      // toast.success('Logged in successfully.');
      setSuccess(true);
      setUsername('');
      setPassword('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    }
  };

  return (
    <Container className="login-box">
      <Helmet>
        <title>Sign In</title>
      </Helmet>

      {success ? (
        <section>
          {/* <h1>Login Success!</h1> */}
          <Navigate to="/dashboard" />
        </section>
      ) : (
        <section>
          <p>{errMsg}</p>
          <h1>Sign In</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="user-box" controlId="username">
              <Form.Label></Form.Label>
              <Form.Control
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="user-box" controlId="password">
              <Form.Label></Form.Label>
              <Form.Control
                placeholder="Password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className="user-box">
              <Button type="submit">Sign In</Button>
            </div>
            <div className="mb-3">
              New user? <Link to="/register">Register</Link>
            </div>
          </Form>
        </section>
      )}
    </Container>
  );
}
export default Login;
