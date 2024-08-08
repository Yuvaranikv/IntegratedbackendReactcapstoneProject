import React from "react";
import {
  Grid,
  Header,
  Card,
  Image,
  CardContent,
  CardHeader,
  CardGroup,
  CardMeta,
  CardDescription,
  Icon,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Navbar from "../../../shared/Navbar";
import BookHeader from "../../../shared/Header";
import Footer from "../../../shared/Footer";
import bannerImage from "../../../assets/images/add (1).png";
import bannerImage1 from "../../../assets/images/writer.png";
import bannerImage2 from "../../../assets/images/apps-add.png";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../../home/home-header";

const BooksMenu = () => {
  const navigate = useNavigate();

  const handleBookCardClick = () => {
    navigate("/books/list");
  };

  const handleAuthorCardClick = () => {
    navigate("/authors/list");
  };

  const handleGenresCardClick = () => {
    navigate("/genres/list");
  };

  return (
    <div>
      <Grid columns="equal"  verticalAlign="middle">
        <Grid.Row style={{ padding: 0 }}>
          <Grid.Column width={2} ></Grid.Column>
          <Grid.Column stretched style={{ padding: 0 }}>
            <Navbar />
            <HomeHeader />
            <Header as="h2">Book</Header>
              <Card.Group itemsPerRow={3} centered>
              <Card onClick={handleBookCardClick} style={{ width: '20%' }}>
                  <Image src={bannerImage} wrapped ui={false} />
                  <CardContent>
                    <CardHeader>Add Book</CardHeader>
                    {/* <CardMeta>Joined in 2016</CardMeta>
                    <CardDescription>
                      Daniel is a comedian living in Nashville.
                    </CardDescription> */}
                  </CardContent>
                  {/* <CardContent extra>
                    <a>
                      <Icon name="user" />
                      10 Friends
                    </a>
                  </CardContent> */}
                </Card>
                <Card onClick={handleAuthorCardClick} style={{ width: '20%' }}>
                  <Image src={bannerImage1} wrapped ui={false} />
                  <CardContent>
                    <CardHeader>Add Author</CardHeader>
                    {/* <CardMeta>Joined in 2016</CardMeta>
                    <CardDescription>
                      Daniel is a comedian living in Nashville.
                    </CardDescription> */}
                  </CardContent>
                  {/* <CardContent extra>
                    <a>
                      <Icon name="user" />
                      10 Friends
                    </a>
                  </CardContent> */}
                </Card>
                <Card onClick={handleGenresCardClick} style={{ width: '20%' }}>
                  <Image src={bannerImage2} wrapped ui={false} />
                  <CardContent>
                    <CardHeader>Add Genres</CardHeader>
                    {/* <CardMeta>Joined in 2016</CardMeta>
                    <CardDescription>
                      Daniel is a comedian living in Nashville.
                    </CardDescription> */}
                  </CardContent>
                  {/* <CardContent extra>
                    <a>
                      <Icon name="user" />
                      10 Friends
                    </a>
                  </CardContent> */}
                </Card>
              </Card.Group>
              </Grid.Column>
        </Grid.Row>
      </Grid>
      {/* <Footer /> */}
    </div>
  );
};

export default BooksMenu;
