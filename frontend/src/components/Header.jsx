import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <Navbar bg="light" expand="lg" className="border-bottom border-dark-subtle bg-opacity-75 backdrop-blur-sm sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-uppercase">
          MorningWood Studio
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navigation" />
        <Navbar.Collapse id="main-navigation">
          <Nav className="ms-auto align-items-lg-center gap-lg-2">
            <Nav.Link as={NavLink} to="/" end>
              Services
            </Nav.Link>
            <Nav.Link as={NavLink} to="/payment">
              Donation
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;