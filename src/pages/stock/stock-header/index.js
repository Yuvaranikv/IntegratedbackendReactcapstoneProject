// src/shared/StockHeader.js
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Header } from 'semantic-ui-react';
import './styles.css'; // Make sure you have appropriate styles
import saleBannerImage from '../../../assets/images/StockBanner1.jpg'; // Update the import path

const StockHeader = () => {
  return (
    <div className="stock-header" style={{ backgroundImage: `url(${saleBannerImage})` }}>
      <Header as='h1' textAlign='center'>
      
      </Header>
    </div>
  );
};

export default StockHeader;
