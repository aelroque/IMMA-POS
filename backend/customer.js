import { connectDatabase } from "../../customer/customer_backend/pool.js";
import bodyParser from "body-parser";
import express from "express";
import { v4 as uuidv4 } from "uuid";

const pool = connectDatabase();
const app = express();
const port = 8000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

pool.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Server has started on http://localhost:${port}`);
    });
  }
});

app.get("/", (request, response) => {
  response.json({ info: "Customer page!" });
});

app.get("/customers", async (req, res) => {
  try {
    const customers = await pool.query(
      "SELECT * FROM public.customer ORDER BY id ASC"
    );
    res.json(customers.rows);
  } catch (error) {
    console.log(error);
  }
});

//setup the route
app.post("/register", async (req, res) => {
  try {
    //take the cname, caddress, ccontactno from the req.body
    const { cname, caddress, ccontactno } = req.body;

    //Check if the customer is already existing
    const user = await pool.query(
      `SELECT * FROM public.customer WHERE cname=$1`,
      [cname]
    );

    if (user.rows.length >= 0) {
      res.status(401).send("Customer already exists.");
    }

    //Add new user into db, generate the uuid
    const newUser = await pool.query(
      `INSERT INTO public.customer(c_id, cname, caddress, ccontactno) VALUES ($1, $2, $3, $4) RETURNING *`,
      [uuidv4(), cname, caddress, ccontactno]
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});
