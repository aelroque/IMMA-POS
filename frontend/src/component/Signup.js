import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactno, setContactno] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [username, password, firstName, lastName, email, contactno]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/register',
        JSON.stringify({
          username,
          password,
          firstName,
          lastName,
          email,
          contactno,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          //withCredentials: true
        }
      );
      console.log(response);
      toast.success('Your registration is success.');
      setSuccess(true);
      setUsername('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setEmail('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed');
      }
    }
  };

  return (
    <Container className="login-box">
      <Helmet>
        <title>Register</title>
      </Helmet>
      {success ? (
        <section>
          <h1>Registration Success!</h1>
          <p>
            <Navigate to="/login">Sign In</Navigate>
          </p>
        </section>
      ) : (
        <section>
          <p>{errMsg}</p>
          <h1 className="my-3">Sign Up</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="user-box" controlId="firstName">
              <Form.Label></Form.Label>
              <Form.Control
                type="firstName"
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="user-box" controlId="lastName">
              <Form.Label></Form.Label>
              <Form.Control
                type="lastName"
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="user-box" controlId="email">
              <Form.Label></Form.Label>
              <Form.Control
                type="email"
                placeholder="Valid Email Address"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="user-box" controlId="contactno">
              <Form.Label></Form.Label>
              <Form.Control
                type="contactno"
                placeholder="Contact Number"
                onChange={(e) => setContactno(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="user-box" controlId="username">
              <Form.Label></Form.Label>
              <Form.Control
                type="username"
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
              <Button type="submit">Sign Up</Button>
            </div>
            <div className="mb-3">
              Already have an account? <Link to="/login">Sign-In</Link>
              <br />
            </div>
          </Form>
        </section>
      )}
    </Container>
  );
}
export default Register;
