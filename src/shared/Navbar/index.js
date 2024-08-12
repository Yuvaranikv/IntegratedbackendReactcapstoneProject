import React from 'react';
import { Menu, Sidebar, Icon, Image, Dropdown } from 'semantic-ui-react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './styles.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignoutClick = () => {
    navigate('/');
  };

  const dropdownOptions = [
    { key: 'sign-out', text: 'Sign out', icon: 'sign out', onClick: handleSignoutClick },
  ];

  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      inverted
      vertical
      visible
      width="thin"
      className="sidebar-menu"
    >
      <div className="menu-content">
        {/* <Menu.Item as={NavLink} to="/home" activeClassName="active">
          <Icon name="home" />
          Home
        </Menu.Item>  */}
        <Menu.Item as={NavLink} to="/books/menu" activeClassName="active">
          <Icon name="book" />
          Books
        </Menu.Item>
        {/* <Menu.Item as={NavLink} to="/purchase/list" activeClassName="active">
          <Icon name="plus cart" />
          Purchase
        </Menu.Item>
        <Menu.Item as={NavLink} to="/sales/list" activeClassName="active">
          <Icon name="shopping cart" />
          Sales
        </Menu.Item> 
        <Menu.Item as={NavLink} to="/stock/list" activeClassName="active">
          <Icon name="chart line" />
          Stock
        </Menu.Item> */}
        <Menu.Item as={NavLink} to="/" activeClassName="active" onClick={handleSignoutClick} style={{ marginTop: 650 }}>
          <Icon name="sign-out" />
          Sign-out
        </Menu.Item>
      </div>
      {/* <div className="profile-dropdown" style={{ marginTop: 380 }}>
        <Dropdown
          item
          icon={null}
          trigger={
            <span>
              <Image
                src="https://react.semantic-ui.com/images/avatar/small/zoe.jpg"
                avatar
                spaced="right"
              />
              shreena
            </span>
          }
          options={dropdownOptions}
          direction="left"
        />
      </div> */}
    </Sidebar>
  );
};

export default Navbar;
