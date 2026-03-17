import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="border-top border-dark-subtle bg-light bg-opacity-75 mt-5">
      <Container>
        <Row>
          <Col className="text-center py-4 text-body-secondary">
            Copyright &copy; 2026 MorningWood Studio. Custom woodwork, restoration, and built-to-fit carpentry.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;