import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Grid,
  Header,
  Button,
  Icon,
  Label,
  Modal,
  ModalHeader,
  ModalDescription,
  ModalContent,
} from "semantic-ui-react";
import Navbar from "../../../shared/Navbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Footer from "../../../shared/Footer";
import StockHeader from "../stock-header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListStock = () => {
  const [stockData, setStockData] = useState([]);
  const [filteredStockData, setFilteredStockData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Adjust based on your backend limit
  const [totalPages, setTotalPages] = useState(1);
  const [searchTextAuthor, setSearchTextAuthor] = useState("");
  const [searchTextBook, setSearchTextBook] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [modalContent, setModalContent] = useState("sales");

  useEffect(() => {
    fetchStockData();
  }, []);

  useEffect(() => {
    filterStockData();
  }, [searchTextAuthor, searchTextBook, stockData]);

  const fetchStockData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/stock");
      setStockData(response.data);
      setFilteredStockData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const filterStockData = () => {
    let filteredData = stockData;

    if (searchTextAuthor) {
      filteredData = filteredData.filter((item) =>
        item.AuthorName.toLowerCase().includes(searchTextAuthor.toLowerCase())
      );
    }

    if (searchTextBook) {
      filteredData = filteredData.filter((item) =>
        item.title.toLowerCase().includes(searchTextBook.toLowerCase())
      );
    }

    setFilteredStockData(filteredData);
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      const button = (
        <Button
          key={pageNumber}
          onClick={() => handlePageClick(pageNumber)}
          disabled={pageNumber === page}
          primary={pageNumber === page}
        >
          {pageNumber}
        </Button>
      );

      pageNumbers.push(button);
    }

    return pageNumbers;
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const exportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(stockData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "StockData");
      XLSX.writeFile(wb, "stock_data.xlsx");
      toast.success("Data Exported to Excel successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Error exporting data");
    }
  };

  const getSoldBadgeAndCaption = (stock) => {
    let color;
    let caption;

    if (stock === null) {
      color = "red";
      caption = "Out of Stock";
    } else if (stock > 10) {
      color = "green";
      caption = "Fine";
    } else if (stock <= 10 && stock > 0) {
      color = "orange";
      caption = "Low Stock";
    } else if (stock === 0) {
      color = "red";
      caption = "Out of Stock";
    }

    return (
      <Label
        className="badge-sold"
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <Icon
          name="square"
          size="big"
          color={color}
          style={{ marginRight: "5px" }}
        />
        &nbsp;&nbsp;
        {caption}
      </Label>
    );
  };

  const handleInfoClick = async (book) => {
    setSelectedBook(book);
    await fetchSalesData(book.book_id);
    setModalContent("sales"); // set modal content to sales
    setConfirmOpen(true);
  };

  const handleInfoClickPurchase = async (book) => {
    setSelectedBook(book);
    await fetchPurchaseData(book.book_id);
    setModalContent("purchase"); // set modal content to purchase
    setConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedBook(null);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };
  const fetchSalesData = async (bookId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/stock/book/${bookId}/sales`
      );
      setSalesData(response.data);
      console.log(salesData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const fetchPurchaseData = async (bookId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/stock/book/${bookId}/purchase`
      );
      setPurchaseData(response.data);
      console.log(salesData);
    } catch (error) {
      console.error("Error fetching purchase data:", error);
    }
  };

  return (
    <div>
      <Grid columns="equal" style={{ margin: 0 }}>
        <Grid.Row style={{ padding: 0 }}>
          <Grid.Column width={2} style={{ padding: 0 }}></Grid.Column>
          <Grid.Column stretched style={{ padding: 0 }}>
            <Navbar />
            <StockHeader /> 
            <Header as="h2">Stock</Header>
            <Grid>
              <Grid.Row columns={3} verticalAlign="middle">
                <Grid.Column>
                  <div className="ui">
                    <label>
                      Search Author: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </label>
                    <div className="ui icon input">
                      <input style={{borderColor:'orange'}}
                        type="text"
                        placeholder="Search Author"
                        value={searchTextAuthor}
                        onChange={(e) => setSearchTextAuthor(e.target.value)}
                      />
                      <i className="search icon" style={{backgroundColor:'orange'}}></i>
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div className="ui">
                    <label>
                      Search Book: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </label>
                    <div className="ui icon input">
                      <input style={{borderColor:'orange'}}
                        type="text"
                        placeholder="Search Book"
                        value={searchTextBook}
                        onChange={(e) => setSearchTextBook(e.target.value)}
                      />
                      <i className="search icon" style={{backgroundColor:'orange'}}></i>
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column textAlign="right">
                  <Button
                    className="ui labeled icon green button"
                    onClick={exportToExcel}
                  >
                    <Icon name="file excel outline"></Icon>Download
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Book ID</Table.HeaderCell>
                  <Table.HeaderCell>Cover Page</Table.HeaderCell>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell>Author</Table.HeaderCell>
                  <Table.HeaderCell>Purchased</Table.HeaderCell>
                  <Table.HeaderCell>Sold</Table.HeaderCell>
                  <Table.HeaderCell>Stock</Table.HeaderCell>
                  <Table.HeaderCell>Info</Table.HeaderCell>
                 
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredStockData.map((item) => (
                  <Table.Row key={item.book_id}>
                    <Table.Cell style={{ width: "100px" }}>
                      {item.book_id}
                    </Table.Cell>
                    <Table.Cell style={{ width: "100px" }}>
                      <img
                        className="zoom-on-hover"
                        src={item.imageURL}
                        alt="Cover Page"
                        style={{ width: "50px", height: "70px" }}
                      />
                    </Table.Cell>
                    <Table.Cell style={{ width: "300px" }}>
                      {item.title}
                    </Table.Cell>
                    <Table.Cell style={{ width: "150px" }}>
                      {item.AuthorName}
                    </Table.Cell>
                    <Table.Cell style={{ width: "100px" }}>
                    <a
                        href="#"
                        onClick={() => handleInfoClickPurchase(item)}
                      >
                        {item.purchase !== null ? item.purchase : 0}
                      </a>
                      {/* {item.purchase !== null ? item.purchase : 0} */}
                      {/* <Icon
                        size="small"
                        color="blue"
                        name="info circle"
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleInfoClickPurchase(item) }
                      /> */}
                    </Table.Cell>
                    <Table.Cell style={{ width: "100px" }}>
                    <a href="#"   onClick={() => handleInfoClick(item)}>
                    {item.sold !== null ? item.sold : 0}
                      </a>
                     
                      {/* <Icon
                        size="small"
                        color="blue"
                        name="info circle"
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleInfoClick(item) }
                      /> */}
                    </Table.Cell>
                    <Table.Cell style={{ width: "100px" }}>
                      {item.stock !== null ? item.stock : 0}
                    </Table.Cell>
                    <Table.Cell style={{ width: "130px" }}>
                      {getSoldBadgeAndCaption(item.stock)}
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
                      disabled={filteredStockData.length < pageSize}
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
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        size="small"
      >
        <ModalHeader>Book Information</ModalHeader>
        <ModalContent>
          {selectedBook && (
            <div>
              <h3>{selectedBook.title}</h3>
              <p>Author: {selectedBook.AuthorName}</p>
              {modalContent === "sales" ? (
                salesData.length > 0 ? (
                  <Table celled>
                    <Table.Header>
                      <Table.Row>
                      <Table.HeaderCell>Sales ID</Table.HeaderCell>
                        <Table.HeaderCell>Sales Date</Table.HeaderCell>
                        <Table.HeaderCell>Quantity Sold</Table.HeaderCell>
                        <Table.HeaderCell>Comments</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {salesData.map((sale) => (
                          <Table.Row key={sale.salesid}>
                          <Table.Cell>{sale.salesid}</Table.Cell>
                          <Table.Cell>{(sale.salesdate)}</Table.Cell>
                          <Table.Cell>{sale.quantity_sold}</Table.Cell>
                          <Table.Cell>{sale.comments}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                ) : (
                  <p>No sales data found.</p>
                )
              ) : purchaseData.length > 0 ? (
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                    <Table.HeaderCell>Purchase ID</Table.HeaderCell>
                        <Table.HeaderCell>Purchase Date</Table.HeaderCell>
                        <Table.HeaderCell>Quantity Purchased</Table.HeaderCell>
                        <Table.HeaderCell>Comments</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {purchaseData.map((data) => (
                      <Table.Row key={data.purchaseid}>
                      <Table.Cell>{data.purchaseid}</Table.Cell>
                      <Table.Cell>{data.purchasedate}</Table.Cell>
                      <Table.Cell>{data.quantityinstock}</Table.Cell>
                      <Table.Cell>{(data.comments)}</Table.Cell>
                    </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                <p>No purchase data found.</p>
              )}
            </div>
          )}
        </ModalContent>
        <Modal.Actions>
          <Button onClick={() => setConfirmOpen(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
         
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <ToastContainer />
    </div>
  );
};

export default ListStock;
