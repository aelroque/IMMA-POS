import { connectDatabase } from "../pool";
import bodyParser from "body-parser";
import express, { response } from "express";
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

//setup the route
app.post("/products", async (req, res) => {
  try {
    //take the username and password from the req.body
    const { pname, pqty, uprice, srp, uom } = req.body;

    //Check if the product is already existing
    const prodname = await pool.query(
      `SELECT * FROM public.product WHERE pname=$1`,
      [pname]
    );

    if (prodname.rows.length >= 0) {
      res.status(401).send("Product already exists.");
    }

    //Add new product into db
    const newProduct = await pool.query(
      `INSERT INTO public.product(pid, pname, pqty, uprice, srp, uom) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [uuidv4(), pname, pqty, uprice, srp, uom]
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});
//get product by id
app.get("/products/:name", async (req, res) => {
  try {
    const { pname} = req.body;
    //Check if the product is already existing
    const prodname = await pool.query(
      `SELECT * FROM public.product WHERE pname=$1`,
      [pname]
    );
    if (prodname.rows.length >= 0) {
      res.status(401).send("Product do not exists.");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});
//get product by id
app.post("/products", async (req, res) => {
  try {
    const { pname, pqty, uprice, srp } = req.body;
    //Check if the product is already existing
    const prodname = await pool.query
      (`UPDATE public.product SET (pname, pqty, uprice, srp) VALUES ($1, $2, $3, $4) RETURNING *`,
      [pname, pqty, uprice, srp]
    );
    if (prodname.rows.length >= 0) {
      res.status(401).send("Product do not exists.");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

//get product by name and srp
//get product by name and qty
//get product by name, uprice and srp