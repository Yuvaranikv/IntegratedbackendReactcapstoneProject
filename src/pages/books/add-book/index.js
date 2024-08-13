import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Grid,
  Button,
  Modal,
  Form,
  TextArea,
  ModalHeader,
  ModalContent,
  ModalDescription,
  Icon,
  Dropdown,
  Image,
  Header,
  Breadcrumb,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Navbar from "../../../shared/Navbar";
import BookHeader from "../../../shared/Header";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import Footer from "../../../shared/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HomeHeader from "../../home/home-header";
import { roundToNearestHoursWithOptions } from "date-fns/fp";

const AddNewBook = () => {
  const [books, setBooks] = useState([]);
  const [bookName, setBookName] = useState("");
  const [price, setPrice] = useState("");
  const [pdate, setPdate] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Adjust based on your backend limit
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [direction, setDirection] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [selectedGenresId, setSelectedGenresId] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [isbnNo, setIsbnNo] = useState("");
  const [description, setDescription] = useState("");
  const [coverPage, setCoverPage] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [addBookClicked, setAddBookClicked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchGenres();
    fetchAllBooks();
  }, [page]); // Reload books when currentPage changes

  const fetchAllBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/books/all`);
      setAllBooks(response.data.books);
      console.log("all books",response); // Store all books in state
    } catch (error) {
      console.error("Error fetching all books:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/books?page=${page}&limit=${pageSize}`
      );

      const { books, totalCount } = response.data;

      setBooks(books);
      setFilteredBooks(books);
      console.log(filteredBooks);
      const totalPagesCount = Math.ceil(totalCount / pageSize);
      setTotalPages(totalPagesCount);
      console.log(totalCount);
      console.log(response);
    } catch (error) {
      console.error("Error fetching books:", error);
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
    setAddBookClicked(true);
    if (selectedBook) {
      try {
        const response = await axios.put(
          `http://localhost:3000/books/edit/${selectedBook.book_id}`,
          {
            title: bookName,
            author_id: selectedAuthorId,
            genre_id: selectedGenresId,
            price: price,
            publication_date: pdate,
            ISBN: isbnNo,
            imageURL: coverPage,
            description: description,
          }
        );
        console.log("Updated Book:", response.data);
        // toast.success("Book updated successfully");
        fetchBooks();
        setBookName("");
        setPrice("");
        setPdate(null);
        setSelectedBook(null);
        setOpen(false);
        setSelectedFile(null);
        setCoverPage([]);
        toast.success("Book updated successfully");
      } catch (error) {
        console.error("Error updating Book:", error);
       // toast.error("Error updating Book");
      }
    } else {
      try {
        const response = await axios.post("http://localhost:3000/books/add/", {
          title: bookName,
          author_id: selectedAuthorId,
          genre_id: selectedGenresId,
          price: price,
          publication_date: pdate,
          ISBN: isbnNo,
          imageURL: coverPage,
          description: description,
        });
        console.log("Added new Book:", response.data);
        fetchBooks();
        setBookName("");
        setPrice("");
        setPdate(null);
        setOpen(false);
        setCoverPage([]);
        toast.success("Book added successfully");
      } catch (error) {
        console.error("Error adding Book:", error);
       // toast.error("Error adding Book");
      }
    }
  };

  const handleEditButtonClick = (book) => {
    setSelectedBook(book);
    setBookName(book.title);
    setSelectedAuthorId(book.author_id);
    setSelectedGenresId(book.genre_id);
    setPdate(book.publication_date);
    setPrice(book.price);
    setIsbnNo(book.isbn);
    setDescription(book.description);
    setCoverPage(book.imageURL);
    console.log(coverPage);
    setOpen(true);
    setSelectedFile(null);
  };

  const handleDeleteButtonClick = async (book) => {
    setDeleteBookId(book.book_id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/books/delete/${deleteBookId}`);
      console.log("Deleted Book");
      toast.success("Book deleted successfully");
      fetchBooks();
      setConfirmOpen(false); // Close confirmation modal after deletion
    } catch (error) {
      console.error("Error deleting Book:", error);
      toast.error("Error deleting Book");
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteBookId(null); // Reset deleteBookId state
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

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      setFilteredBooks(books); // Reset filteredbooks when search is cleared
    } else {
      setFilteredBooks(
        allBooks.filter((book) =>
          book.title.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
    console.log(searchText);
  };

  const handleResetSearch = () => {
    setSearchText("");
    setFilteredBooks(books);
  };

  const handleSort = () => {
    const sortedBooks = _.orderBy(
      filteredBooks,
      ["name"],
      [direction === "ascending" ? "asc" : "desc"]
    );
    setFilteredBooks(sortedBooks);
    setDirection(direction === "ascending" ? "descending" : "ascending");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const fetchAuthors = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      console.log(token);
      const response = await axios.get(`http://localhost:3000/authors/all`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          Accept: 'application/json'
        }
      });
      const  authors  = response.data;
      setAuthors(authors || []);
      // setAuthors(authors);
      console.log("Authors",response.data);
    } catch (error) {
      console.error("Error fetching authors:", error);
      setAuthors([]);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get("http://localhost:3000/genres/all");
      const  genres  = response.data;
      console.log("Fetched genres:", genres);
     
      setGenres(genres ||[]);
      console.log("Genres set in state:", genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } 
  };

  const handleFileChange =  (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(e.target.files[0]);
    // await handleFileUpload();
  };

  const handleFileUpload = async () => {
    // if (!selectedFile) {
    //   toast.error("Please select a file to upload.");
    //   return;
    // }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/books/upload",
        formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    });
      const filePath = response.data.filePath;
      console.log(response.data.filePath);
      setCoverPage(`http://localhost:3000${filePath}`);
      console.log(coverPage);
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
     // toast.error("Error uploading file");
    }
  };


  const sections = [
    {
      key: "Home",
      content: "Home",
      as: Link,
      to: "http://localhost:3001/home",
    },
    { key: "Books", content: "Books", as: Link, to: "/books/menu" },
    { key: "Author", content: "Add", active: true },
  ];

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedFile(null); // Reset selectedFile when modal closes
  };

  const today = new Date();

  return (
    <div>
      <Grid columns="equal" style={{ margin: 0 }}>
        <Grid.Row style={{ padding: 0 }}>
          <Grid.Column width={2} style={{ padding: 0 }}></Grid.Column>
          <Grid.Column stretched style={{ padding: 0 }}>
            <Navbar />
            <HomeHeader/>
            <Header as="h2">Book</Header>
            <Breadcrumb icon="right angle" sections={sections} />
            <div class="ui grid">
              <div class="eight wide column left-aligned">
                <div class="add-book-button-container">
                  <button
                    class="ui labeled icon green button"
                    onClick={() => setOpen(true)}
                  >
                    <i class="plus icon"></i>Add Book
                  </button>
                </div>
              </div>
              <div class="eight wide column right-aligned">
                <div class="search-container">
                  <div class="ui ">
                    <div class="ui icon input">
                      <input
                        style={{ borderColor: "orange" }}
                        type="text"
                        placeholder="Search Book"
                        value={searchText}
                        onChange={handleSearch}
                      />
                      <i
                        class="search icon"
                        style={{ backgroundColor: "orange" }}
                      ></i>
                    </div>
                    <div class="results"></div>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              closeIcon
              open={open}
              onClose={handleCloseModal}
              size="small"
              style={{ height: "90vh" }}
            >
              <ModalHeader>
                {selectedBook ? "Edit Book" : "Add New Book"}
              </ModalHeader>
              <ModalContent>
                <ModalDescription>
                  <Form onSubmit={handleSubmit}>
                    <Form.Field>
                      <input
                        placeholder="Add Book Name"
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                        error={
                          bookName.trim() === "" && addBookClicked
                            ? {
                                content: "Please enter Book name",
                                pointing: "below",
                              }
                            : null
                        }
                      />
                      {bookName.trim() === "" && addBookClicked && (
                        <div className="ui pointing red basic label">
                          Please enter Book name
                        </div>
                      )}
                    </Form.Field>
                    <Form.Field>
                      <Dropdown
                        placeholder="Choose Author"
                        fluid
                        search
                        selection
                        options={authors.map((author) => ({
                          key: author.author_id,
                          text: author.name,
                          value: author.author_id,
                        }))}
                        value={selectedAuthorId}
                        onChange={(e, { value }) => setSelectedAuthorId(value)}
                        error={
                          selectedAuthorId === null && addBookClicked
                            ? {
                                content: "Please select Author",
                                pointing: "below",
                              }
                            : null
                        }
                      />
                      {selectedAuthorId === null && addBookClicked && (
                        <div className="ui pointing red basic label">
                          Please select Author
                        </div>
                      )}
                    </Form.Field>
                    <Form.Field>
                      <Dropdown
                        placeholder="Choose Genres"
                        fluid
                        search
                        selection
                        options={genres.map((genre) => ({
                          key: genre.genre_id,
                          text: genre.genre_name,
                          value: genre.genre_id,
                        }))}
                        value={selectedGenresId}
                        onChange={(e, { value }) => setSelectedGenresId(value)}
                        error={
                          selectedGenresId === null && addBookClicked
                            ? {
                                content: "Please select Genres",
                                pointing: "below",
                              }
                            : null
                        }
                      />
                      {selectedGenresId === null && addBookClicked && (
                        <div className="ui pointing red basic label">
                          Please select Genres
                        </div>
                      )}
                    </Form.Field>
                    <Form.Field>
                      <DatePicker
                        selected={pdate}
                        onChange={(date) => setPdate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Choose Publication Date"
                        className="custom-datepicker"
                        maxDate={today} // Disable future dates
                        error={
                          pdate === "" && addBookClicked
                            ? {
                                content: "Please select publication date",
                                pointing: "below",
                              }
                            : null
                        }
                      />
                      {pdate === "" && addBookClicked && (
                        <div className="ui pointing red basic label">
                          Please select publication date
                        </div>
                      )}
                    </Form.Field>
                    <Form.Field>
                      <input
                        placeholder="Add Book Code"
                        value={isbnNo}
                        onChange={(e) => setIsbnNo(e.target.value)}
                        error={
                          isbnNo === "" && addBookClicked
                            ? {
                                content: "Please enter ISBN No",
                                pointing: "below",
                              }
                            : null
                        }
                      />
                      {isbnNo === "" && addBookClicked && (
                        <div className="ui pointing red basic label">
                          Please enter ISBN No
                        </div>
                      )}
                    </Form.Field>
                    <Form.Field>
                      <TextArea
                        placeholder="Add Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Form.Field>
                    <Form.Field>
                      <div class="ui right labeled input">
                        <label for="amount" class="ui label">
                         Rs
                        </label>
                        <input
                          type="text"
                          placeholder="Amount"
                          id="amount"
                          value={price}
                          onChange={(e) => {
                            const inputPrice = e.target.value;
                            // Only allow numbers and handle the state update
                            if (/^\d*\.?\d*$/.test(inputPrice)) {
                              setPrice(inputPrice);
                            }
                          }}
                          pattern="^\d*\.?\d*$" // Pattern to allow only numbers and optional decimal
                          title="Please enter a valid number" // Title for invalid input (optional)
                        />
                        <div class="ui basic label">.00</div>
                      </div>
                      {/* Error message for price validation */}
                      {price === "" && addBookClicked && (
                        <div className="ui pointing red basic label">
                          Please enter only numbers
                        </div>
                      )}
                    </Form.Field>
                    <Form.Field>
                      <input type="file" onChange={handleFileChange} />
                      <button onClick={handleFileUpload}>Upload</button>
                      {/* <input
                        placeholder="Cover Page URL"
                        value={coverPage}
                        readOnly // Make it read-only to display only
                      /> */}
                    </Form.Field>
                    <Button color="green" type="submit">
                      {selectedBook ? <><Icon name="edit"/>Update Book</> : <><Icon name="plus"/>Add Book</> }
                    </Button>
                  </Form>
                </ModalDescription>
              </ModalContent>
            </Modal>
            <Table className="ui very basic collapsing selectable celled table sortable">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Sl. No</Table.HeaderCell>
                  {/* <Table.HeaderCell>Cover Page</Table.HeaderCell> */}
                  <Table.HeaderCell sorted={direction} onClick={handleSort}>
                    Book
                  </Table.HeaderCell>
                  <Table.HeaderCell>Author</Table.HeaderCell>
                  <Table.HeaderCell>Genres</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>Publication Date</Table.HeaderCell>
                  <Table.HeaderCell>Edit</Table.HeaderCell>
                  <Table.HeaderCell>Delete</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredBooks.map((book, index) => (
                  <Table.Row key={book.book_id}>
                    <Table.Cell>{(page - 1) * pageSize + index + 1}</Table.Cell>{" "}
                    {/* <Table.Cell style={{ width: "100px" }}>
                      <img
                        className="zoom-on-hover"
                        src={book.imageURL}
                        alt="Cover Page"
                        style={{ width: "50px", height: "70px" }}
                      />
                    </Table.Cell> */}
                    {/* Display serial number */}
                    <Table.Cell>{book.title}</Table.Cell>
                    <Table.Cell>{book.author?.name}</Table.Cell>{" "}
                    <Table.Cell>{book.genre?.genre_name}</Table.Cell>{" "}
                    <Table.Cell>{book.price}</Table.Cell>
                    <Table.Cell>{formatDate(book.publication_date)}</Table.Cell>
                    <Table.Cell>
                      <Button
                        className="btn btn-primary btn-sm light-green-button"
                        color="green"
                        size="mini" // Set the size here
                        onClick={() => handleEditButtonClick(book)}
                      >
                        <Icon name="edit"></Icon> Edit
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        className="btn btn-primary btn-sm light-red-button"
                        color="red"
                        size="mini" // Set the size here
                        onClick={() => handleDeleteButtonClick(book)}
                      >
                        <Icon name="delete"></Icon> Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="8" textAlign="center">
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
                      disabled={books.length < pageSize}
                      onClick={handleNextPage}
                    >
                      Next
                      <Icon name="right arrow" />
                    </Button>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
              <Modal
                closeIcon
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                size="tiny"
              >
                <ModalHeader>Confirm Delete</ModalHeader>
                <ModalContent>
                  <ModalDescription>
                    Are you sure you want to delete this book?
                  </ModalDescription>
                </ModalContent>
                <Modal.Actions>
                  <Button color="red" onClick={handleCancelDelete}>
                    <Icon name="remove" /> Cancel
                  </Button>
                  <Button color="green" onClick={handleConfirmDelete}>
                    <Icon name="checkmark" /> Confirm
                  </Button>
                </Modal.Actions>
              </Modal>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {/* <Footer /> */}
    </div>
  );
};

export default AddNewBook;
