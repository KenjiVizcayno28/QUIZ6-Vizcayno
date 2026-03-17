import React from 'react';
import { Card, Container, Table } from 'react-bootstrap';
import '../styles/ServiceScreens.css';
import { getStoredUser } from '../utils/auth';

const ORDERS_KEY = 'morningwood_orders';

const getOrdersByEmail = (email) => {
  try {
    const rawOrders = localStorage.getItem(ORDERS_KEY);
    const orders = rawOrders ? JSON.parse(rawOrders) : [];

    return orders
      .filter((order) => order.email?.toLowerCase() === email?.toLowerCase())
      .sort((left, right) => new Date(right.created_at) - new Date(left.created_at));
  } catch (error) {
    return [];
  }
};

function UserProfile() {
  const currentUser = getStoredUser();
  const orders = currentUser ? getOrdersByEmail(currentUser.email) : [];

  if (!currentUser) {
    return (
      <div className="service-page py-5">
        <Container>
          <Card className="service-box border-0 mx-auto" style={{ maxWidth: '40rem' }}>
            <Card.Body className="p-4 p-md-5 text-center">
              <h1 className="h3 mb-3">Profile Unavailable</h1>
              <p className="text-body-secondary mb-0">You need to sign in first to view your profile.</p>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="service-page py-5">
      <Container>
        <Card className="service-box border-0 mb-4">
          <Card.Body className="p-4 p-md-5">
            <h1 className="h3 mb-3">User Profile</h1>
            <div className="row g-3">
              <div className="col-md-6"><strong>First Name:</strong> {currentUser.first_name}</div>
              <div className="col-md-6"><strong>Last Name:</strong> {currentUser.last_name}</div>
              <div className="col-md-6"><strong>Email:</strong> {currentUser.email}</div>
              <div className="col-md-6"><strong>Username:</strong> {currentUser.username}</div>
              <div className="col-md-6"><strong>Phone Number:</strong> {currentUser.phone_number}</div>
              <div className="col-md-6"><strong>Location:</strong> {currentUser.location}</div>
              <div className="col-md-6"><strong>Gender:</strong> {currentUser.gender}</div>
              <div className="col-md-6"><strong>Account Type:</strong> {currentUser.user_type}</div>
            </div>
          </Card.Body>
        </Card>

        <Card className="service-box border-0">
          <Card.Body className="p-4 p-md-5">
            <h2 className="h4 mb-3">Services You Availed</h2>
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>Service Availed</th>
                  <th>Invoice</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No availed services found.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.service_name}</td>
                      <td>{order.invoice}</td>
                      <td>₱{order.amount}</td>
                      <td>{order.status}</td>
                      <td>{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default UserProfile;
