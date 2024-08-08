import React, { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { useNavigate } from 'react-router-dom';
import { Form, Button, Grid, Header, Segment,Icon } from "semantic-ui-react";
import "./styles.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from '../../api/axiosConfig';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loginClicked, setLoginClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await apiClient.post("/api/Authentication/login", { username, password });
    //  const response = await axios.post("http://localhost:3000/userstest/", { username, password });
      console.log(response.data);

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem("jwtToken", token);
        console.log("Redirecting to home page...");
        navigate('/books/menu');
     }
    //  if(response.status===401)
    //  {
    //   toast.error("Username and password not exists");
    //  }
     else
     toast.error("Username and password not exists");
    } catch (error) {
      console.error("Login error:", error); 
      toast.error("Username and password not exists");
      // setUsername(""); // Clear username state
      // setPassword(""); // Clear password state
    }
  };

  return (
    <div className="login-container">
      <Grid textAlign="right" style={{ height: '100vh' }} verticalAlign="middle">
        <Grid.Column className="login-box">
          <Header as="h2" color="black" textAlign="center">
           <Icon name="book"></Icon> Infinite Reads Book Store
          </Header>
          <Form size="large" onSubmit={handleSubmit}>
            <Segment stacked>
              <Form.Input required
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              //   error={
              //     username.trim() === "" && loginClicked
              //       ? {
              //           content: "Please enter User name",
              //           pointing: "below",
              //         }
              //       : null
              //   }
              // />
              // {username.trim() === "" && loginClicked && (
              //   <div className="ui pointing red basic label">
              //     Please enter User name
              //   </div>
              // )}
              />
              <Form.Input required
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button color="black" fluid size="large" type="submit">
                Login
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default LoginPage;
