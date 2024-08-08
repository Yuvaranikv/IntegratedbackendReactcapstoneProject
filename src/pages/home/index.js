import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Grid,
  Header,
  Button,
  Icon,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardMeta,
  Image,
  CardGroup,
  List,
  ListItem,
  Segment,
  SegmentInline,
  GridColumn,Modal
} from "semantic-ui-react";
import Navbar from "../../shared/Navbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Footer from "../../shared/Footer";
import HomeHeader from "../home/home-header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css"; // Add this import for CSS

const HomePage = () => {
  const [stockData, setStockData] = useState([]);
  const [booksalesData, setBookSalesData] = useState([]);
  const [totalsalesData, setTotalSalesData] = useState([]);
  const [topsellingData, setTopSellingData] = useState([]);
  const [stockAlertData, setStockAlertData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Adjust based on your backend limit
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null); // State to store the selected book
  const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchData = async () => {
      await fetchTotalStockData();
      await fetchStockData();
      await fetchBookSalesData();
      await fetchTotalSalesData();
      await fetchTopsellingData();
    };

    fetchData();
  }, []);

  const fetchTotalStockData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/stock/totalstock"
      );
      const data = response.data.map((item) => ({
        ...item,
        total_stock: item.total_stock === null ? 0 : item.total_stock,
      }));
      setStockData(data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const fetchBookSalesData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/stock/bookssold");
      const data = response.data.map((item) => ({
        ...item,
        BooksSoldToday: item.BooksSoldToday === null ? 0 : item.BooksSoldToday,
      }));
      setBookSalesData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const fetchTotalSalesData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/stock/totalsales"
      );
      const data = response.data.map((item) => ({
        ...item,
        TotalSalesToday:
          item.TotalSalesToday === null ? 0 : item.TotalSalesToday,
      }));
      setTotalSalesData(data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const fetchTopsellingData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/stock/topsellingbooks"
      );
      setTopSellingData(response.data);
      console.log("top",response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const fetchStockData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/stock");
      setStockAlertData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const getStockAlertBooks = () => {
    return stockAlertData.filter(
      (item) => item.stock <= 10 || item.stock === null
    );
    console.log(stockData);
  };

  const handleCardClick = (book) => {
    setSelectedBook(book); // Set the selected book for modal display
    setModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setSelectedBook(null); // Clear the selected book
    setModalOpen(false); // Close the modal
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };
  return (
    <div>
      <Grid columns="equal" style={{ margin: 0 }}>
        <Grid.Row style={{ padding: 0 }}>
          <Grid.Column width={2} style={{ padding: 0 }}></Grid.Column>
          <Grid.Column stretched style={{ padding: 0 }}>
            <Navbar />
            <HomeHeader />
            <Header as="h2">Home</Header>
            <Card.Group itemsPerRow={3}>
              {stockData.map((item) => (
                <Card color="orange" className="fixed-size-card">
                  <Header as="h2" align="center" style={{ padding: 10 }}>
                  {item.total_stock}&nbsp;&nbsp;
                  {/* <span>units</span> */}
                  </Header>
                  <CardContent>
                    <CardHeader align="center">
                     Books Available In-Stock
                    </CardHeader>
                  </CardContent>
                </Card>
              ))}
              {booksalesData.map((item) => (
                <Card color="blue" className="fixed-size-card">
                  <Header as="h2" align="center" style={{ padding: 10 }}>
                  {item.BooksSoldToday}&nbsp;&nbsp;
                  {/* <span>units</span> */}
                 
                  </Header>
                  <CardContent>
                    <CardHeader align="center">
                    Books Sold Today
                    </CardHeader>
                  </CardContent>
                </Card>
              ))}
              {totalsalesData.map((item) => (
                <Card color="green" className="fixed-size-card">
                  <Header as="h2" align="center" style={{ padding: 10 }}>
                  <Icon name="rupee" size="tiny" /> 
                  {item.TotalSalesToday}
                  </Header>
                  <CardContent>
                    <CardHeader align="center">
                       Today's Sales
                    </CardHeader>
                  </CardContent>
                </Card>
              ))}
            </Card.Group>
            <Header as="h2">Top 5 selling books</Header>
            <Card.Group itemsPerRow={5}>
              {topsellingData.map((item) => (
                <Card key={item.id} className="fixed-size-card zoom-on-hover"  >
                  <Image
                    src={item.imageURL}
                    ui={false}
                    className="fixed-size-image"
                  />
                  <CardContent>
                    <CardHeader>{item.title}</CardHeader>
                    <CardMeta>{item.author}</CardMeta>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                  <CardContent extra className="sold-number">
                   
                      <Icon name="shopping cart" />
                      {item.total_quantity_sold} Sold
                  
                  </CardContent>
                </Card>
              ))}
            </Card.Group>
            <Modal
              open={modalOpen}
              onClose={handleCloseModal}
              size="small"
              closeIcon
            >
              <Modal.Header>{selectedBook && selectedBook.title}</Modal.Header>
              <Modal.Content image>
                <Image src={selectedBook && selectedBook.imageURL} wrapped style={{ width: '200px' }}/>
                <Modal.Description>
                  <Header>Author: {selectedBook && selectedBook.name}</Header> {/* Use selectedBook.name for author */}
                  <p>{selectedBook && selectedBook.description}</p>
                  <p>Total Quantity Sold: {selectedBook && selectedBook.total_quantity_sold}</p>
                  <p>ISBN: {selectedBook && selectedBook.ISBN}</p>
                  <p>Price: {selectedBook && selectedBook.price}</p>
                  <p>Publication Date: {(selectedBook) && formatDate(selectedBook.publication_date)}</p>
                  {/* Add more details as needed */}
                </Modal.Description>
              </Modal.Content>
            </Modal>
            <div style={{ marginTop: "50px" }}>
              <Segment>
                <Header as="h2">Stock Alert</Header>
                <Grid>
                  <Grid.Row columns={3}>
                    {getStockAlertBooks().map((item) => (
                      <Grid.Column key={item.id}>
                        <Segment>
                          <Icon name="warning circle" color="red" />
                          {item.title} -{" "}
                          <span style={{ color: "red" }}>
                            {" "}
                            {item.stock === null
                              ? "(Stock is empty)"
                              : `(Only ${item.stock} left)`}
                          </span>
                        </Segment>
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                </Grid>
              </Segment>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <ToastContainer />
    </div>
  );
};

export default HomePage;
