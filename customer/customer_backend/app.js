import { connectDatabase } from "./pool";
import express from "express";
import bodyParser from "body-parser";
import { pool } from "pg";
//import { v4 as uuidv4 } from "uuid";

const pool = connectDatabase();
const app = express();
const port = 8000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

pool.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    app.listen(port, () => {
      console.log(`Server has started on http://localhost:${port}`);
    });
  }
});

/**
 * app.post("/customer", async (res, req) => {
  try {
    const { name, address, contactno } = req.body;
    const customer = await pool.query(
      `INSERT INTO public.customer (customer_id, customer_name, customer_contactno) VALUES($1, $2, $3, $4) RETURNING *`,
      [uuidv4, customer_name, customer_contactno]
    );
  } catch (err) {
    console.error(err.message);
  }
});

 */
