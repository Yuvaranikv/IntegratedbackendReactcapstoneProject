// src/components/shared/Header/index.js
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Header } from 'semantic-ui-react';
import './styles.css';
import bannerImage from '../../../assets/images/Designer4.jpeg'; // Update the import path /Users/yuvarani-k/BookStoreProject/client/src/assets/images/saleBanner.jpg

const PurchaseHeader = () => {
  return (
    <div className="purchase-header" style={{ backgroundImage: `url(${bannerImage})` }}>
      <Header as='h2' textAlign='center'>
      
      </Header>
    </div>
  );
};

export default PurchaseHeader;
