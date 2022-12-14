import { connectDatabase } from './config/pool.js';
import bodyParser from 'body-parser';
import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { auth } from './middleware/auth.js';
import { jwtGenerator } from '../../Capstone/backend/jwt/jwtGenerator.js';
import data from './data.js';
import fileUpload from 'express-fileupload';
import errorHandler from './middleware/handlingError.js';

const pool = connectDatabase();
const app = express();
const PORT = 8000;
const currentDate = new Date();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(errorHandler);

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  //req methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE' //'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // req headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-reqed-With,content-type',
    'Sec-Fetch-Mode',
    'Sec-Fetch-Site',
    'Sec-Fetch-Dest'
  );

  // Set to true if you need the website to include cookies in the reqs sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true); //false
  res.setHeader('Sec-Fetch-Mode', 'navigate');
  res.setHeader('Sec-Fetch-Mode', 'no-cors');
  res.setHeader('Sec-Fetch-Site', 'cross-site');
  res.setHeader('Sec-Fetch-Site', 'same-origin');
  res.setHeader('Sec-Fetch-Dest', 'document');
  res.setHeader('Sec-Fetch-Dest', 'image');
  // Pass to next layer of middleware
  next();
});

//suppliers
app.get(`/suppliers`, async (req, res) => {
  try {
    const suppliers = await pool.query(
      'SELECT * FROM public.supplier ORDER BY supplier_id ASC'
    );
    res.json(suppliers.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.put('/suppliers/update/:supplier_id', async (req, res) => {
  try {
    //take the username and password from the req.body
    const { supplier_id } = req.params;
    const updated_on = currentDate;
    const { supplier_email, supplier_contact, representative } = req.body;
    const newSupplier = await pool.query(
      `UPDATE public.supplier SET supplier_email=$1, supplier_contact=$2, representative=$3, updated_on=$4 WHERE supplier_id = $5`,
      [
        supplier_email,
        supplier_contact,
        representative,
        updated_on,
        supplier_id,
      ]
    );
    return res.status(201).send('Successfully updated.');
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});
//create supplier-okay
app.post('/suppliers/add', async (req, res) => {
  try {
    //take the username and password from the req.body
    const added_on = currentDate;
    const {
      business_name,
      supplier_email,
      supplier_contact,
      representative,
      tin,
      tax,
    } = req.body;
    const supplier_id = uuidv4();
    const supplier_code = supplier_id.slice(0, 6);
    const product = await pool.query(
      `INSERT INTO public.supplier(supplier_id, business_name, supplier_email, supplier_contact, representative, tin, added_on, supplier_code,tax) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        supplier_id,
        business_name,
        supplier_email,
        supplier_contact,
        representative,
        tin,
        added_on,
        supplier_code,
        tax,
      ]
    );
    return res.status(201).send(`Successfully added.`);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

//get product by date
// app.get('/suppliers/:created_on', async (req, res) => {
//   try {
//     const { created_on } = req.params;
//     const date = await pool.query(
//       'SELECT * FROM public.product WHERE created_on=$1 ORDER BY product_id ASC',
//       [created_on]
//     );
//     res.json(date.rows[0]);
//   } catch (err) {
//     console.log(err.message);
//   }
// });

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './uploads');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file, fieldname + '-' + Date.now());
//   },
// });

// const upload = multer({ storage: storage }).single('userPhoto');

// app.post('/upload-img', function (req, res) {
//   upload(req, res, function (err) {
//     if (err) {
//       return res.send('Error uploading file.');
//     }
//     res.send('File is uploaded');
//   });
// });

// //upload photo - review
// app.post('/upload', async (req, res) => {
//   try {
//     const { image, added_on, added_by } = req.body;
//     const photo = await pool.query(
//       `INSERT INTO public.productphotos(product_id, image, added_on, added_by) VALUES ($1, $2, $3, $4) RETURNING *`,
//       [id, image, added_on, added_by]
//     );
//     return res
//       .status(201)
//       .send('Photo uploaded.');
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send(error.message);
//   }
// });

//test fetch - feature page
app.get('/api/products', (req, res) => {
  res.send(data.products);
});
//test fetch - feature page (test data for ecommerce)
app.get('/api/products/slug/:slug', (req, res) => {
  const product = data.products.find((x) => x.slug === req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
//test data for ecommerce
app.get('/api/products/id/:id', async (req, res) => {
  const product = data.products.find((x) => x.id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// app.post('/purchases/', async (req, res) => {
//   const purchase_id = uuidv4();
//   const purchase_code = purchase_id.slice(0, 10);
//   const date_created = currentDate;
//   const purchases = await app.query('INSERT INTO public.purchase(purchase_id, purchase_code, supplier_id, supplier_name')
// })

app.get('/purchase/queries/:product_name', async (req, res) => {
  try {
    const { product_name } = req.query;
    const query = await pool.query(
      'SELECT product.product_name, product.product_id, product.quantity, product.supplier_name FROM public.product LEFT JOIN public.supplier ON supplier.supplier_id = supplier.supplier_id WHERE product_name $1',
      [`%${product_name}%`]
    );
  } catch (err) {
    console.log(err);
  }
});

//update product: product_name, brand, category - okay
app.put('/products/update/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;
    const date_updated = currentDate;
    const { product_name, brand, category } = req.body;
    console.log(product_name, category, brand);
    const newProduct = await pool.query(
      'UPDATE public.product SET product_name=$1, brand=$2, category=$3, date_updated=$4 WHERE product_id=$5',
      [product_name, brand, category, date_updated, product_id]
      //NULL
    );
    return res.status(200).send('Update successful.');
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// //edit product name
// app.put('/products/:product_id', async (req, res) => {
//   try {
//     const { product_id } = req.params;
//     const {product_name} = req.body;
//     const update = await pool.query(
//       'UPDATE public.product SET product_name=$1 WHERE product_id=$2',
//       [product_name, product_id]);
//     return res.status(200).send("Update Success.");
//   } catch (err) {
//     console.log(err.message);
//   }
// });

//get all products with pagination
app.get('/products/search', async (req, res) => {
  try {
    const { q } = req.query;
    const products = await pool.query(
      'SELECT * FROM public.product ORDER BY product_id ASC'
    );
    const keys = ['product_name', 'brand', 'category', 'decript', 'code'];
    console.log(q);
    const search = (data) => {
      keys.some((keys) => item[keys].toLowerCase().includes(q));
    };
    res.json(search(products).splice(0, 3));
  } catch (err) {
    console.log(err.message);
  }
});

//all name - okay
app.get('/products/product_name', async (req, res) => {
  try {
    const products = await pool.query(
      'SELECT product_name FROM public.product'
    );
    res.json(products.rows);
  } catch (err) {
    console.log(err.message);
  }
});
//all brand - okay
app.get('/products/suppliers/:supplier_name', async (req, res) => {
  try {
    const { supplier_name } = req.params;
    const products = await pool.query(
      'SELECT * FROM public.product WHERE supplier_name=$1',
      [supplier_name]
    );
    res.json(products.rows);
  } catch (err) {
    console.log(err.message);
  }
});
//all brand - okay
app.get('/products/:brand', async (req, res) => {
  try {
    const products = await pool.query('SELECT brand FROM public.product');
    res.json(products.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//all category - okay
app.get('/products/category', async (req, res) => {
  try {
    const products = await pool.query('SELECT category FROM public.product');
    res.json(products.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//get product by id-okay
app.get('/products/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;
    const productId = await pool.query(
      'SELECT * FROM public.product WHERE product_id=$1',
      [product_id]
    );
    res.json(productId.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//by product name - okay
app.get('/products/name/:product_name', async (req, res) => {
  try {
    const { product_name } = req.params;
    const names = await pool.query(
      'SELECT * FROM public.product WHERE product_name=$1',
      [product_name]
    );
    return res.json(names.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//by brand - okay
app.get('/products/brand/:brand', async (req, res) => {
  try {
    const { brand } = req.params;
    const brands = await pool.query(
      'SELECT * FROM public.product WHERE brand=$1',
      [brand]
    );
    return res.json(brands.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//by code - okay
app.get('/products/code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const productCode = await pool.query(
      'SELECT * FROM public.product WHERE code=$1',
      [code]
    );
    return res.json(productCode.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//category - okay
app.get('/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const categories = await pool.query(
      'SELECT * FROM public.product WHERE category=$1',
      [category]
    );
    res.json(categories.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//get all products - okay
app.get('/products', async (req, res) => {
  try {
    const products = await pool.query(
      'SELECT * FROM public.product ORDER BY product_id ASC'
    );
    res.json(products.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//create product-okay
app.post('/products/add', async (req, res) => {
  try {
    //take the username and password from the req.body
    const {
      product_name,
      quantity,
      unit_price,
      selling_price,
      unit_measure,
      category,
      brand,
      description,
      supplier_name,
    } = req.body;
    const product_id = uuidv4();
    const code = product_id.slice(0, 6);
    const supplier_id = uuidv4();
    const product = await pool.query(
      `INSERT INTO public.product(product_id, product_name, quantity, unit_price, selling_price, unit_measure, category, brand, description, code, created_on, supplier_id, supplier_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        product_id,
        product_name,
        quantity,
        unit_price,
        selling_price,
        unit_measure,
        category,
        brand,
        description,
        code,
        currentDate,
        supplier_id,
        supplier_name,
      ]
    );
    return res.status(201).send(`Product ${product_name} successfully added.`);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

//change to archive
app.delete('/products/list/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;
    const remove = await pool.query(
      'DELETE FROM public.product WHERE product_id=$1',
      [product_id]
    );
    return res.status(201).send('Product deleted.');
  } catch (err) {
    console.log(err.message);
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { todo_id, description } = req.body;
    const newTodo = await pool.query(
      `INSERT INTO public.todo(todo_id, description) VALUES($1, $2) RETURNING *`,
      [todo_id, description]
    );
    return res.status(201).send('added a todo.');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query(
      'SELECT * FROM public.todo ORDER BY todo_id ASC '
    );
    res.json(allTodos.rows);
  } catch (error) {
    console.log(error);
  }
});

app.get('/todos/:todo_id', async (req, res) => {
  try {
    const { todo_id } = req.params;
    const todo = await pool.query('SELECT * FROM todo WHERE todo_id=$1', [
      todo_id,
    ]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.log(error);
  }
});
app.put('/todos/:todo_id', async (req, res) => {
  try {
    const { todo_id } = req.params;
    const { description } = req.body;
    const todo = await pool.query(
      'UPDATE public.todo SET description=$1 WHERE todo_id=$2',
      [description, todo_id]
    );
    return res.status(200).send('updated');
  } catch (error) {
    console.log(error);
  }
});

//reference sample date - working
app.post('/reference', async (req, res) => {
  try {
    const currentDate = new Date();
    const { description, site, author } = req.body;
    const ref_id = uuidv4();
    const small_id = ref_id.slice(0, 6);
    const reference = await pool.query(
      `INSERT INTO public.reference(date_created, ref_id, description, site, author, small_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [currentDate, ref_id, description, site, author, small_id]
    );
    return res.status(201).send(`Reference successfully added.`);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});
//delete by id-okay
app.delete('/reference/list/:ref_id', async (req, res) => {
  try {
    const { ref_id } = req.params;
    const reference = await pool.query(
      'DELETE FROM public.reference WHERE ref_id=$1',
      [ref_id]
    );
    res.json(reference.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

app.put('/reference/update/:ref_id', async (req, res) => {
  try {
    const { ref_id } = req.params;
    const { author, description } = req.body;
    const reference = await pool.query(
      'UPDATE public.reference SET author=$1, description=$2 WHERE ref_id=$3',
      [author, description, ref_id]
    );
    res.send('Update Success.');
  } catch (err) {
    console.log(err.message);
  }
});
//get reference- okay
app.get('/reference/:ref_id', async (req, res) => {
  try {
    const { ref_id } = req.params;
    const references = await pool.query(
      'SELECT * FROM public.reference WHERE ref_id=$1 ORDER BY date_created ASC',
      [ref_id]
    );
    res.json(references.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});
//get reference- okay
app.get('/reference', async (req, res) => {
  try {
    const references = await pool.query(
      'SELECT * FROM public.reference ORDER BY ref_id ASC'
    );
    res.json(references.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.put('/users/update/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { firstname, lastname, email, contactno } = req.body;
    const reference = await pool.query(
      'UPDATE public.user SET firstname=$1, lastname=$2, email=$3, contactno=$4 WHERE user_id=$5',
      [firstname, lastname, email, contactno, user_id]
    );
    res.send('Update Success.');
  } catch (err) {
    console.log(err.message);
  }
});

//get users
app.get('/users', async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT * FROM public.user ORDER BY user_id ASC'
    );
    res.json(users.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//setup the route
//register
app.post('/register', async (req, res) => {
  res;
  try {
    const { username, password, firstname, lastname, email, contactno } =
      req.body;
    const unique_id = uuidv4();
    const user_id = unique_id.slice(0, 6);
    const user = await pool.query(
      `SELECT * FROM public.user WHERE username=$1`,
      [username]
    );
    if (user.rows.length > 0) {
      res.status(401).send('User already exists.');
    }
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO public.user(user_id, username, password, firstname, lastname, email, date_created, unique_id, contactno) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        user_id,
        username,
        bcryptPassword,
        firstname,
        lastname,
        email,
        currentDate,
        unique_id,
        contactno,
      ]
    );
    const token = jwtGenerator(newUser.rows[0]);
    return res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

//login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query(
      `SELECT * FROM public.user WHERE username=$1`,
      [username]
    );
    if (user.rows.length < 0) {
      return res.status(401).send('User does not exists.');
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json('Password or Username is incorrect.');
    }
    const token = jwtGenerator(user.rows[0]);
    res.json({ token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      msg: 'Unauthenticated',
    });
  }
});

//verify
app.get('/verify', auth, async (req, res) => {
  try {
    return res.json(req.user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ msg: 'Unauthenticated' });
  }
});

//immature
app.get('/immature', async (req, res) => {
  res.send('Great tool to start with your business!');
});

//db connect
pool.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT} on ${currentDate}`
      );
    });
  }
});
