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
  Breadcrumb,
  Pagination,
  Header,
  Segment,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Navbar from "../../../shared/Navbar";
import BookHeader from "../../../shared/Header";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import Footer from "../../../shared/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomeHeader from "../../home/home-header";

const Genreslist = () => {
  const [genres, setGenres] = useState([]);
  const [genresname, setGenresName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [deleteGenresId, setDeleteGenresId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [genresNameClicked, setgenresNameClicked] = useState(false);

  useEffect(() => {
    fetchAllGenres(); // Fetch all genres initially
    fetchGenres();
  }, [page]); // Reload genres when page changes

  const fetchAllGenres = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/genres/all`);
      setAllGenres(response.data); // Store all genres in state
    } catch (error) {
      console.error("Error fetching all genres:", error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/genres?page=${page}&limit=${pageSize}`
      );

      const { genres, totalCount } = response.data;

      setGenres(genres);
      setFilteredGenres(genres);
      const totalPagesCount = Math.ceil(totalCount / pageSize);
      setTotalPages(totalPagesCount);
      console.log(totalCount);
    } catch (error) {
      console.error("Error fetching genres:", error);
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
    setgenresNameClicked(true);
    if (selectedGenres) {
      try {
        const response = await axios.put(
          `http://localhost:3000/genres/edit/${selectedGenres.genre_id}`,
          {
            genre_name: genresname,
          }
        );
        console.log("Updated genres:", response.data);
        fetchGenres();
        setGenresName("");
        setSelectedGenres(null);
        setOpen(false);
        toast.success("Genres updated successfully");
      } catch (error) {
        console.error("Error updating Geres:", error);
        toast.error("Error updating Genres");
      }
    } else {
      try {
        const response = await axios.post("http://localhost:3000/genres/add/", {
          genre_name: genresname,
        });
        console.log("Added new Genres:", response.data);
        fetchGenres();
        setGenresName("");
        setOpen(false);
        toast.success("Genres added successfully");
      } catch (error) {
        console.error("Error adding genres:", error);
        toast.error("Error adding genres");
      }
    }
  };

  const handleEditButtonClick = (genres) => {
    setSelectedGenres(genres);
    setGenresName(genres.genre_name);
    setOpen(true);
  };

  const handleDeleteButtonClick = async (genres) => {
    setDeleteGenresId(genres.genre_id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/genres/delete/${deleteGenresId}`
      );
      console.log("Deleted Genres");
      toast.success("Genres deleted successfully");
      fetchGenres();
      setConfirmOpen(false); // Close confirmation modal after deletion
    } catch (error) {
      console.error("Error deleting Genres:", error);
      toast.error("Error deleting genres");
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteGenresId(null); // Reset deleteAuthorId state
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
      setFilteredGenres(genres);
    } else {
      setFilteredGenres(
        allGenres.filter((genres) =>
          genres.genre_name.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
    console.log(searchText);
  };

  const handleResetSearch = () => {
    setSearchText("");
    setFilteredGenres(genres);
  };

  const sections = [
    {
      key: "Home",
      content: "Home",
      as: Link,
      to: "http://localhost:3001/home",
    },
    { key: "Books", content: "Books", as: Link, to: "/books/menu" },
    { key: "Author", content: "Genres", active: true },
  ];
  return (
    <div>
      <Grid columns="equal" style={{ margin: 0 }}>
        <Grid.Row style={{ padding: 0 }}>
          <Grid.Column width={2} style={{ padding: 0 }}></Grid.Column>
          <Grid.Column stretched style={{ padding: 0 }}>
            <Navbar />
           <HomeHeader/>
            <Header as="h2">Genres</Header>
            <Breadcrumb icon="right angle" sections={sections} />
            <div class="ui grid">
              <div class="eight wide column left-aligned">
                <div class="add-book-button-container">
                  <button 
                    class="ui labeled icon green button"
                    onClick={() => setOpen(true)}
                  >
                    <i class="plus icon"></i>Add Genres
                  </button>
                </div>
              </div>
              <div class="eight wide column right-aligned">
                <div class="search-container">
                  <div class="ui ">
                    <div class="ui icon input">
                      <input style={{borderColor:'orange'}}
                        type="text"
                        placeholder="Search Genres"
                        value={searchText}
                        onChange={handleSearch}
                      />
                      <i class="search icon" style={{backgroundColor:'orange'}}></i>
                    </div>
                    <div class="results"></div>
                  </div>
                </div>
              </div>
            </div>
            <Modal closeIcon open={open} onClose={() => setOpen(false)}>
              <ModalHeader>
                {selectedGenres ? "Edit Genres" : "Add New Genres"}
              </ModalHeader>
              <ModalContent>
                <ModalDescription>
                  <Form onSubmit={handleSubmit}>
                    <Form.Field required>
                      <label>Genres Name</label>
                      <input
                        placeholder="Enter Genres Name"
                        value={genresname}
                        onChange={(e) => setGenresName(e.target.value)}
                        error={
                          genresname.trim() === "" && genresNameClicked
                            ? {
                                content: "Please enter Genres name",
                                pointing: "below",
                              }
                            : null
                        }
                      />
                      {genresname.trim() === "" && genresNameClicked && (
                        <div className="ui pointing red basic label">
                          Please enter Genres name
                        </div>
                      )}
                    </Form.Field>
                    <Button color="green" type="submit">
                      {selectedGenres ? "Update Genres" : "Add Genres"}
                    </Button>
                  </Form>
                </ModalDescription>
              </ModalContent>
            </Modal>
            <Table className="ui very basic collapsing selectable celled table sortable">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Sl. No</Table.HeaderCell>
                  <Table.HeaderCell>
                    Genres
                  </Table.HeaderCell>
                  {/* <Table.HeaderCell>Genres name</Table.HeaderCell> */}
                  <Table.HeaderCell>Edit</Table.HeaderCell>
                  <Table.HeaderCell>Delete</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredGenres.map((genres, index) => (
                  <Table.Row key={genres.genre_id}>
                    <Table.Cell>{(page - 1) * pageSize + index + 1}</Table.Cell>
                    <Table.Cell>{genres.genre_name}</Table.Cell>
                    <Table.Cell>
                      <Button
                        className="btn btn-primary btn-sm light-green-button"
                        color="green"
                        size="mini" // Set the size here
                        onClick={() => handleEditButtonClick(genres)}
                      >
                        <Icon name="edit"></Icon> Edit
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        className="btn btn-primary btn-sm light-red-button"
                        color="red"
                        size="mini" // Set the size here
                        onClick={() => handleDeleteButtonClick(genres)}
                      >
                        <Icon name="delete"></Icon> Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="4" textAlign="center">
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
                      disabled={genres.length < pageSize}
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
                    Are you sure you want to delete this genres?
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

export default Genreslist;
