// src/components/shared/Header/index.js
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Header } from 'semantic-ui-react';
import './styles.css';
import bannerImage from '../../assets/images/banner2.jpg'; // Update the import path

const BookHeader = () => {
  return (
    <div className="book-header" style={{ backgroundImage: `url(${bannerImage})` }}>
      
    </div>
  );
};

export default BookHeader;
