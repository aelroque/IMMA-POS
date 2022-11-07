import { connectDatabase } from '../../customer/customer_backend/pool.js';
import bodyParser from 'body-parser';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const pool = connectDatabase();
const app = express();
const port = 8000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//customer
pool.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Server has started on http://localhost:${port}`);
    });
  }
});

//setup the route
//create new customer
app.post('/customers', async (req, res) => {
  try {
    //details required
    const { cname, caddress, ccontactno } = req.body;

    //Check if the customer is already existing
    const customer = await pool.query(
      `SELECT * FROM public.customer WHERE cname=$1`,
      [cname]
    );

    if (cname.rows.length >= 0) {
      res.status(401).send('Business partner already exists.');
    }

    //Add new customer into db, generate the uuid
    const newcustomer = await pool.query(
      `INSERT INTO public.customer(c_id, cname, caddress, ccontactno) VALUES ($1, $2, $3, $4) RETURNING *`,
      [uuidv4(), cname, caddress, ccontactno]
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.get('/customers/:name', async (req, res) => {
  try {
    //take the cname, caddress, ccontactno
    const { cname } = req.body;

    //Check if the customer is already existing
    const customer = await pool.query(
      `SELECT * FROM public.customer WHERE cname=$1`,
      [cname]
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

//update the customer's details
app.post('/customers', async (req, res) => {
  try {
    //take cname, caddress, ccontactno
    const { cname, caddress, ccontactno, srepname } = req.body;

    //update customer
    const customer = await pool.query(
      'UPDATE public.customer SET (cname, semail, sphone, srepname)',
      [cname, caddress, ccontactno, srepname]
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});
