import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Grid,
  Button,
  Modal,
  Form,
  Input,
  Icon,
  Pagination,
  Header,
  Dropdown,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Navbar from "../../../shared/Navbar";
import SalesHeader from "../../../pages/sales/sales-header";
import "./styles.css";
import Footer from "../../../shared/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const Saleslist = () => {
  const [sales, setSales] = useState([]);
  const [saleDate, setSaleDate] = useState("");
  const [bookId, setBookId] = useState("");
  const [quantitySold, setQuantitySold] = useState("");
  const [comments, setComments] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [deleteSaleId, setDeleteSaleId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchTextBook, setSearchTextBook] = useState("");
  const [filteredSales, setFilteredSales] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [salesClicked, setSalesClicked] = useState(false);
  const [quantityInStock, setQuantityInStock] = useState(0);
  const [quantityError, setQuantityError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchSales();
    fetchAllBooks();
  }, [page]); // Reload sales when page changes

  useEffect(() => {
    if (selectedBookId) {
      fetchQuantityInStock(selectedBookId); // Fetch quantity in stock when selectedBookId changes
    }
  }, [selectedBookId]);

  const fetchSales = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/sales?page=${page}&limit=${pageSize}`
      );

      const { sales, totalCount } = response.data;

      setSales(sales);
      setFilteredSales(sales);
      const totalPagesCount = Math.ceil(totalCount / pageSize);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchAllBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/books/all`);
      setAllBooks(response.data.books);
    } catch (error) {
      console.error("Error fetching all books:", error);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalesClicked(true);
    // if (!selectedBookId || !quantitySold || !saleDate) {
    //   toast.error("Please fill all required fields before submitting.");
    //   return;
    // }
    if (parseInt(quantitySold) > parseInt(quantityInStock)) {
      setQuantityError(
        "Quantity sold should be less than or equal to quantity in stock."
      );
      return;
    } else {
      setQuantityError("");
    }
    if (selectedSale) {
      try {
        const response = await axios.put(
          `http://localhost:3000/sales/edit/${selectedSale.salesid}`,
          {
            bookid: bookId,
            quantity_sold: quantitySold,
            salesdate: saleDate,
            comments: comments,
          }
        );
        console.log("Updated sale:", response.data);
        fetchSales();
        resetForm();
        setOpen(false);
        toast.success("Sale updated successfully");
      } catch (error) {
        console.error("Error updating sale:", error);
        toast.error("Error updating sale");
      }
    } else {
      try {
        const response = await axios.post("http://localhost:3000/sales/add/", {
          bookid: selectedBookId,
          quantity_sold: quantitySold,
          salesdate: saleDate,
          comments: comments,
        });
        console.log("Added new sale:", response.data);
        toast.success("Sale added successfully");
        fetchSales();
        resetForm();
        setOpen(false);
       // toast.success("Sale added successfully");
      } catch (error) {
        console.error("Error adding sale:", error);
        toast.error("Error adding sale");
      }
    }
  };

  const handleEditButtonClick = (sale) => {
    setSelectedSale(sale);
    setSelectedBookId(sale.bookid);
    setBookId(sale.bookid);
    setQuantitySold(sale.quantity_sold);
    setSaleDate(new Date(sale.salesdate).toISOString().split("T")[0]);
    setComments(sale.comments);
    setOpen(true);
  };

  const handleDeleteButtonClick = async (sale) => {
    setDeleteSaleId(sale.salesid);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/sales/delete/${deleteSaleId}`);
      console.log("Deleted sale");
      toast.success("Sale deleted successfully");
      fetchSales();
      setConfirmOpen(false); // Close confirmation modal after deletion
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("Error deleting sale");
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteSaleId(null); // Reset deleteSaleId state
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      // Create a button element for each page number
      const button = (
        <Button
          key={pageNumber}
          onClick={() => handlePageClick(pageNumber)}
          disabled={pageNumber === page} // Disable current page button
          primary={pageNumber === page} // Highlight current page button
        >
          {pageNumber}
        </Button>
      );

      // Push the button element into the pageNumbers array
      pageNumbers.push(button);
    }

    // Return the array of page number buttons
    return pageNumbers;
  };

  // const handleSearch = (e) => {
  //   setSearchText(e.target.value);
  //   if (e.target.value === "") {
  //     setFilteredSales(sales);
  //   } else {
  //     setFilteredSales(
  //       sales.filter(
  //         (sale) =>
  //           sale.bookid.toString().includes(e.target.value) ||
  //           sale.saledate.includes(e.target.value)
  //       )
  //     );
  //   }
  // };

  // const handleResetSearch = () => {
  //   setSearchText("");
  //   setFilteredSales(sales);
  // };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const resetForm = () => {
    setSelectedSale(null);
    setSelectedBookId(null);
    setBookId("");
    setQuantitySold("");
    setSaleDate("");
    setComments("");
    setSalesClicked(false);
  };
  const sections = [
    {
      key: "Home",
      content: "Home",
      as: Link,
      to: "http://localhost:3001/home",
    },
    { key: "Books", content: "Books", as: Link, to: "/books/menu" },
    { key: "Author", content: "Author", active: true },
  ];

  const fetchQuantityInStock = async (bookId) => {
    try {
      const response = await axios.get(`http://localhost:3000/stock/${bookId}`);
      const data = response.data;
      console.log(response.data);

      if (Array.isArray(data)) {
        const stock = data.map((item) => item.stock);
        setQuantityInStock(stock[0] || 0); // Assuming you need the first stock value
      } else {
        setQuantityInStock(data.stock || 0);
      }

      console.log(quantityInStock);
    } catch (error) {
      console.error(
        `Error fetching quantity in stock for book ${bookId}:`,
        error
      );
      // Default to 0 or handle error case
    }
  };
  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  const handleSearchBook = async (e) => {
    setSearchTextBook(e.target.value);
    if (e.target.value === "") {
      setFilteredSales(sales);
    } else {
      try {
        const response = await axios.get(
          `http://localhost:3000/sales/books/search?title=${e.target.value}`
        );
        const filteredBooks = response.data;
        console.log(filteredBooks);
        const filteredBookIds = filteredBooks.map((book) => book.book_id);

        const newFilteredSales = sales.filter((sale) =>
          filteredBookIds.includes(sale.bookid)
        );

        setFilteredSales(newFilteredSales);
      } catch (error) {
        console.error("Error searching books:", error);
        // Handle error appropriately
      }
    }
  };

  return (
    <div>
      <Grid columns="equal" style={{ margin: 0 }}>
        <Grid.Row style={{ padding: 0 }}>
          <Grid.Column width={2} style={{ padding: 0 }}></Grid.Column>
          <Grid.Column stretched style={{ padding: 0 }}>
             <Navbar />
            <SalesHeader /> 
            <Header as="h2" style={{ marginBottom: 5 }}>
              {" "}
              {selectedSale ? "Sales" : "Sales"}
            </Header>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Field width={4} className="margin-top" required>
                  <label>Book</label>
                  <Dropdown
                    placeholder="Select Book"
                    fluid
                    selection
                    options={allBooks.map((book) => ({
                      key: book.book_id,
                      text: book.title,
                      value: book.book_id,
                    }))}
                    value={selectedBookId}
                    onChange={(e, { value }) => setSelectedBookId(value)}
                    error={
                      selectedBookId === null && salesClicked
                        ? {
                            content: "Please select a Book",
                            pointing: "below",
                          }
                        : null
                    }
                  />
                  {selectedBookId === null && salesClicked && (
                    <div className="ui pointing red basic label">
                      Please select a Book
                    </div>
                  )}
                </Form.Field>
                <Form.Field width={4} className="margin-top" required>
                  <label>Quantity Sold </label>
                  <input
                    type="number"
                    placeholder="Enter Quantity Sold"
                    value={quantitySold}
                    onChange={(e) => setQuantitySold(e.target.value)}
                    error={
                      quantitySold === "" && salesClicked
                        ? {
                            content: "Please enter Quantity Sold in numbers",
                            pointing: "below",
                          }
                        : null
                    }
                  />
                  {quantitySold === "" && salesClicked && (
                    <div className="ui pointing red basic label">
                      Please enter Quantity Sold in numbers
                    </div>
                  )}
                  {quantityError && (
                    <div className="ui pointing red basic label">
                      {quantityError}
                    </div>
                  )}
                </Form.Field>
                <Form.Field width={4} className="margin-top">
                  <label>Quantity in stock</label>
                  <input
                    disabled
                    style={{ color: "red", fontWeight: "bold" }}
                    value={quantityInStock}
                  />
                </Form.Field>
                <Form.Field width={4} className="margin-top" required>
                  <label>Sale Date</label>
                  <input
                    type="date"
                    placeholder="Enter Sale Date"
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    max={today}
                    error={
                      saleDate === "" && salesClicked
                        ? {
                            content: "Please select date",
                            pointing: "below",
                          }
                        : null
                    }
                  />
                  {saleDate === "" && salesClicked && (
                    <div className="ui pointing red basic label">
                      Please select date
                    </div>
                  )}
                </Form.Field>
              </Form.Group>
              <Form.Field width={12}>
                <label>Comments</label>
                <textarea
                  className="custom-textarea"
                  placeholder="Enter Comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </Form.Field>
              <Button color="green" type="submit">
                {selectedSale ? <><Icon name="edit"/>Update </> : <><Icon name="plus"/>Add </>}
              </Button>
              <Button color="brown" type="button" onClick={resetForm}>
              <Icon name="undo"/>Clear
              </Button>
            </Form>
            <div class="ui grid">
              <div class="twe wide column right-aligned">
                <div class="search-container">
                  <div class="ui ">
                    <div class="ui icon input">
                      <input 
                        style={{ marginBottom: 2 ,borderColor:'orange'}}
                        type="text"
                        placeholder="Search Book"
                        value={searchTextBook}
                        onChange={handleSearchBook}
                      />
                      <i class="search icon" style={{backgroundColor:'orange'}}></i>
                    </div>
                    <div class="results"></div>
                  </div>
                </div>
              </div>
            </div>
            <Table className="ui very basic collapsing selectable celled table sortable">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Sl. No</Table.HeaderCell>
                  <Table.HeaderCell>Book</Table.HeaderCell>
                  <Table.HeaderCell>Quantity Sold</Table.HeaderCell>
                  <Table.HeaderCell>Sale Date</Table.HeaderCell>
                  <Table.HeaderCell>Comments</Table.HeaderCell>
                  <Table.HeaderCell>Edit</Table.HeaderCell>
                  <Table.HeaderCell>Delete</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredSales.map((sale, index) => (
                  <Table.Row key={sale.saleid}>
                    <Table.Cell>{(page - 1) * pageSize + index + 1}</Table.Cell>
                    <Table.Cell>
                      {sale.Book ? sale.Book.title : "N/A"}
                    </Table.Cell>
                    <Table.Cell>{sale.quantity_sold}</Table.Cell>
                    <Table.Cell>{formatDate(sale.salesdate)}</Table.Cell>
                    <Table.Cell>{sale.comments}</Table.Cell>
                    <Table.Cell>
                      <Button
                         className="btn btn-primary btn-sm light-green-button"
                        color="green"
                        size="mini"
                        onClick={() => handleEditButtonClick(sale)}
                      >
                        <Icon name="edit"></Icon> Edit
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                         className="btn btn-primary btn-sm light-red-button"
                        color="red"
                        size="mini"
                        onClick={() => handleDeleteButtonClick(sale)}
                      >
                        <Icon name="delete"></Icon> Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="7" textAlign="center">
                    <Button
                      icon
                      labelPosition="left"
                      disabled={page === 1}
                      onClick={handlePrevPage}
                    >
                      <Icon name="left arrow" />
                      Previous
                    </Button>
                    <span>{renderPageNumbers()}</span>
                    <Button
                      icon
                      labelPosition="right"
                      disabled={sales.length < pageSize}
                      onClick={handleNextPage}
                    >
                      Next
                      <Icon name="right arrow" />
                    </Button>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
            <Modal
              closeIcon
              open={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              size="tiny"
            >
              <Modal.Header>Confirm Delete</Modal.Header>
              <Modal.Content>
                <Modal.Description>
                  Are you sure you want to delete this sale?
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button color="red" onClick={handleCancelDelete}>
                  <Icon name="remove" /> Cancel
                </Button>
                <Button color="green" onClick={handleConfirmDelete}>
                  <Icon name="checkmark" /> Confirm
                </Button>
              </Modal.Actions>
            </Modal>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {/* <Footer /> */}
    </div>
  );
};

export default Saleslist;
