import React, { useState } from "react";
import Navbar from '../../../shared/Navbar'
import "semantic-ui-css/semantic.min.css";
import BookHeader from '../../../shared/Header'

import {
  Form,
  Button,
  Grid,
  Header,
  Segment,
  TextArea,
} from "semantic-ui-react";

const AddAuthors = () => {
  const [authorname, setAuthorName] = useState("");
  const [biography, setBiography] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authorname.trim() === "") {
      return;
    }
    try {
      // const response = await axios.post("http://localhost:3000/userstest/", { username, password });
      console.log("Added");
      console.log("Redirecting to Add New Books page...");
    } catch (error) {
      console.error("Login error:", error); // Handle error response
    }
  };

  return (
    <>
   <BookHeader/>
    <Navbar/>

    
    <Grid textAlign="center" style={{ height: "100vh" }} >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="black" textAlign="center">
          Add new Authors
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Field>
              <input
                placeholder="Enter Author Name"
                value={authorname}
                onChange={(e) => setAuthorName(e.target.value)}
                error={authorname.trim() === "" ? { content: 'Please enter Author name', pointing: 'below' } : null}
              />
            </Form.Field>
            <Form.Field>
              <TextArea
                placeholder="Enter Biography"
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
              />
            </Form.Field>
            <Button color="black" fluid size="large" type="submit">
              Add
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
    </>
  );
};

export default AddAuthors;
