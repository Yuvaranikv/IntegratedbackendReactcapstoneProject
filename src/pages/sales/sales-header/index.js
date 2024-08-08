// src/components/shared/Header/index.js
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Header } from 'semantic-ui-react';
import './styles.css';
import bannerImage from '../../../assets/images/BookStore.png'; // Update the import path /Users/yuvarani-k/BookStoreProject/client/src/assets/images/saleBanner.jpg

const SalesHeader = () => {
  return (
    <div className="sales-header" style={{ backgroundImage: `url(${bannerImage})` }}>
      <Header as='h2' textAlign='center'>
       
      </Header>
    </div>
  );
};

export default SalesHeader;
