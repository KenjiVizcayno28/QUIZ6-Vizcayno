import React from 'react';
import { Container } from 'react-bootstrap';
import Products from '../components/Products';
import '../styles/ServiceScreens.css';

function HomeScreen() {
  return (
    <div className="service-page py-5">
      <Container>
        <div className="service-box mb-4 p-4">
          <h1 className="mb-2">Woodwork and Carpentry Services</h1>
          <p className="mb-0 text-body-secondary">
            Click a service box to view the full details. You can add your own image paths later in the data file.
          </p>
        </div>
        <Products />
      </Container>
    </div>
  );
}

export default HomeScreen;
