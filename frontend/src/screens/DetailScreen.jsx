import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb, Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { getWoodworkingServiceBySlug } from '../data/woodworkingServices';
import '../styles/ServiceScreens.css';

function DetailScreen() {
  const { service_slug } = useParams();
  const service = getWoodworkingServiceBySlug(service_slug);

  if (!service) {
    return (
      <Container className="py-5">
        <Card className="border-0 shadow-sm p-4 p-lg-5 text-center">
          <Card.Body>
            <p className="text-uppercase small fw-semibold text-body-secondary mb-2">Service not found</p>
            <h1 className="h2 mb-3">That woodworking service is not available.</h1>
            <p className="text-body-secondary mb-4">Return to the service list to choose another carpentry offering.</p>
            <Button as={Link} to="/" variant="dark" className="rounded-pill px-4">
              Back to Services
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <div className="service-page py-4 py-lg-5">
      <Container>
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Services</Breadcrumb.Item>
          <Breadcrumb.Item active>{service.service_name}</Breadcrumb.Item>
        </Breadcrumb>

        <Row className="g-4 g-lg-5 align-items-start">
          <Col lg={7}>
            <Card className="service-box overflow-hidden">
              {service.sample_image ? (
                <Card.Img src={service.sample_image} alt={service.service_name} className="service-detail-image" />
              ) : (
                <div className="service-image-placeholder service-detail-image-placeholder">
                  Add image for {service.service_name}
                </div>
              )}
              <Card.Body className="p-4 p-lg-5">
                <h1 className="h2 mb-3">{service.service_name}</h1>
                <p className="service-detail-description text-body-secondary mb-3">{service.description}</p>
                <p className="mb-0"><strong>Rating:</strong> {service.rating}</p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="service-box mb-4">
              <Card.Body className="p-4">
                <h2 className="h4 mb-3">Service Details</h2>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between px-0 py-3 bg-transparent">
                    <span className="text-body-secondary">Price</span>
                    <strong>{service.price}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between px-0 py-3 bg-transparent">
                    <span className="text-body-secondary">Duration of service</span>
                    <strong>{service.duration_of_service}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between px-0 py-3 bg-transparent">
                    <span className="text-body-secondary">Name of the expert</span>
                    <strong>{service.name_of_the_expert}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between px-0 py-3 bg-transparent">
                    <span className="text-body-secondary">Service rating</span>
                    <strong>{service.rating} / 5</strong>
                  </ListGroup.Item>
                </ListGroup>
                <div className="d-grid gap-2 mt-4">
                  <Button as={Link} to="/payment" variant="outline-dark" className="rounded-0 py-2">
                    Proceed to Donation Page
                  </Button>
                  <Button as={Link} to="/" variant="outline-dark" className="rounded-0 py-2">
                    Browse More Services
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DetailScreen;