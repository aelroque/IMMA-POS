import axios from 'axios';
import { Link, redirect } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';

function Signin() {
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
      console.log(response);
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
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      {success ? (
        <section>
          <h1>Login Success!</h1>
          <p>
            <a href="#store">Link to Store</a>
          </p>
        </section>
      ) : (
        <section>
          <p>{errMsg}</p>
          <h1 className="my-3">Sign In</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className="mb-3">
              <Button type="submit">Sign In</Button>
            </div>
            <div className="mb-3">
              New user? <Link to={`/signin?redirect=${redirect}`}>Sign-Up</Link>
            </div>
          </Form>
        </section>
      )},
    </Container>
  );
}
export default Signin;
