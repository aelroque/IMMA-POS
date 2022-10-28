import { connectDatabase } from "../../supplier/supplier_backend/pool.js";
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
  response.json({ info: "Supplier's page!" });
});

app.get("/add", async (req, res) => {
  try {
    const suppliers = await pool.query(
      "SELECT * FROM public.supplier ORDER BY sid ASC"
    );
    res.json(suppliers.rows);
  } catch (error) {
    console.log(error);
  }
});

//setup the route
app.post("/suppliers", async (req, res) => {
  try {
    //take the sbusname, semail, sphone, srepname from the req.body
    const { sbusname, semail, sphone, srepname } = req.body;

    //Check if the supplier is already existing
    const supplier = await pool.query(
      `SELECT * FROM public.supplier WHERE sbusname=$1`,
      [sbusname]
    );

    if (sbusname.rows.length >= 0) {
      res.status(401).send("Business partner already exists.");
    }

    //Add new supplier into db, generate the uuid
    const newSupplier = await pool.query(
      `INSERT INTO public.supplier(sid, sbusname, semail, sphone, srepname) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [uuidv4(), sbusname, semail, sphone, srepname]
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});
