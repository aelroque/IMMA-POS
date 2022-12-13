import React from 'react';
import Footer from './component/Footer.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './component/Register.js';
import Login from './component/Login';
import Home from './component/Home.js';
import InStock from './component/product/Stocks.js';
import AddProduct from './component/product/AddProduct.js';
import Dashboard from './component/page/Dashboard.js';
import SlugView from './component/ecommerce/SlugView.js';
import Featured from './component/ecommerce/Featured.js';
import UpdateProduct from './component/product/UpdateProduct.js';
import ProductSearch from './component/search/Search.js';
import SearchTable from './component/search/SearchTable.js';
import POSPage from './component/search/POSPage.js';
import Receiving from './component/delivery/Receiving.js';
import AddSupplier from './component/supplier/AddSupplier.js';
import SupplierList from './component/supplier/ViewSupplier.js';
import PurchaseOrder from './component/procurement/PurchaseOrder.js';
import UserProfile from './component/user/UserProfile.js';
import EditUser from './component/user/EditUser.js';

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/users/update" element={<EditUser />} />
          <Route path="/users" element={<UserProfile />} />
          <Route path="/suppliers/add" element={<AddSupplier />} />
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/search/table" element={<SearchTable />} />
          <Route path="/search" element={<ProductSearch />} />
          <Route path="/featured" element={<Featured />} />
          <Route path="/products/:slug" element={<SlugView />} />
          <Route path="/products/purchasing" element={<PurchaseOrder />} />
          <Route path="/products/receiving" element={<Receiving />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/product/update" element={<UpdateProduct />} />
          <Route path="/products" element={<InStock />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;