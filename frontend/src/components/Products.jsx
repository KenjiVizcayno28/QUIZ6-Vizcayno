import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { woodworking_services } from '../data/woodworkingServices';
import Rating from './Rating';


const truncateDescription = (description) => {
  if (description.length <= 120) {
    return description;
  }

  return `${description.slice(0, 117)}...`;
};

function Products() {
  return (
    <Row className="g-4">
      {woodworking_services.map((service) => (
        <Col key={service.service_slug} md={6} xl={4}>
          <Card className="service-box h-100">
            {service.sample_image ? (
              <Card.Img variant="top" src={service.sample_image} alt={service.service_name} className="service-card-image" />
            ) : (
              <div className="service-image-placeholder">Add image for {service.service_name}</div>
            )}
            <Card.Body className="d-flex flex-column p-4">
              <Card.Title className="h4 mb-3">{service.service_name}</Card.Title>
              <Card.Text className="text-body-secondary mb-3 flex-grow-1">
                {truncateDescription(service.description)}
              </Card.Text>
              <Card.Text a='div'>
                <div className='my-3'>
                    <Rating value={service.rating} text={`${service.rating} out of 5`} />
                </div>
              </Card.Text>
              <Button as={Link} to={`/services/${service.service_slug}`} variant="outline-dark" className="align-self-start rounded-0 px-4">
                View Details
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Products;
