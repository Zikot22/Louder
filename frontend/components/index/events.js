import Link from "next/link";
import {Card, Row, Col, Container} from "react-bootstrap";
import styles from "../../styles/components/index/events.module.css"

const cardsData = [
  {
    image: '/mer.jpg',
    name: 'Card 1',
    datetime: 'May 25, 2023',
    location: 'Location 1',
    price: '$10.00'
  },
  {
    image: '/mer.jpg',
    name: 'Card 1',
    datetime: 'May 25, 2023',
    location: 'Location 1',
    price: '$10.00'
  },
  {
    image: '/mer.jpg',
    name: 'Card 2',
    datetime: 'May 26, 2023',
    location: 'Location 2',
    price: '$15.00'
  },
  {
    image: '/mer.jpg',
    name: 'Card 2',
    datetime: 'May 26, 2023',
    location: 'Location 2',
    price: '$15.00'
  },
  {
    image: '/mer.jpg',
    name: 'Card 2',
    datetime: 'May 26, 2023',
    location: 'Location 2',
    price: '$15.00'
  },
  {
    image: '/mer.jpg',
    name: 'Card 2',
    datetime: 'May 26, 2023',
    location: 'Location 2',
    price: '$15.00'
  },
  {
    image: '/mer.jpg',
    name: 'Card 2',
    datetime: 'May 26, 2023',
    location: 'Location 2',
    price: '$15.00'
  }
];

const Events = () => {
  return (
    <Container className="d-flex justify-content-center mt-3">
      <Row>
        {cardsData.map((card, index) => (
          <Col xs="6" sm="4" md="4" lg="3" xl="3" key={index} className="d-flex align-items-stretch mb-3">
            <Link href="/event" className={styles.link}>
              <Card>
                <Card.Img variation="top" style={{ maxWidth: '300px'}} src={card.image} alt={card.name} className="img-fluid"/>
                <Card.Body>
                  <Card.Title tag="h5">{card.name}</Card.Title>
                  <Card.Subtitle tag="h6" className="mb-2 text-muted">{card.datetime}</Card.Subtitle>
                  <Card.Text>{card.location}</Card.Text>
                  <Card.Text>{card.price}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Events;