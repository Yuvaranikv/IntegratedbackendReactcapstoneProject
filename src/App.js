import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import AddNewBook from "./pages/books/add-book";
import AddAuthors from "./pages/authors/add-author";
import ListAuthors from "./pages/authors/list-author";
import Footer from "./shared/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Genreslist from "./pages/genres/list-genres";
import Purchaselist from "./pages/purchase/list-purchase";
import Saleslist from "./pages/sales/list-sales";
import ListStock from "./pages/stock/list-stock";
import HomePage from "./pages/home";
import BooksMenu from "./pages/books/books-menu";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/books/list" element={<AddNewBook />} />
          <Route path="/books/menu" element={<BooksMenu/>}/>
          <Route path="/authors/list" element={<ListAuthors />} />
          <Route path="/genres/list" element={<Genreslist />} />
          <Route path="/purchase/list" element={<Purchaselist />} />
          <Route path="/sales/list" element={<Saleslist />} />
          <Route path="/stock/list" element={<ListStock />} />
          <Route path="/Footer" element={<Footer />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
