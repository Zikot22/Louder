import Link from "next/link";
import { Card, Row, Col, Container } from "react-bootstrap";
import styles from "../../styles/components/index/events.module.css"
import packageInfo from "../../package.json";

const domain = packageInfo.domain;

const Events = ({events}) => {
  return (
    <Container className="d-flex justify-content-center mt-3">
      <Row className="col-12">
        {events?.map((event, index) => (
          <Col xs="6" sm="4" md="4" lg="3" xl="3" key={index} className="d-flex align-items-stretch mb-3">
            <Link href={`/event/${event.id}`} className={styles.link}>
              <Card className="h-100">
                <Card.Img variation="top" style={{ maxWidth: '300px' }} src={`${domain}/images/covers/${event.id}.jpg`} className="img-fluid"/>
                <Card.Body>
                  <Card.Title tag="h5">{event.name}</Card.Title>
                  <Card.Subtitle tag="h6" className="mb-2 text-muted">{new Date(event.dateTime).toLocaleDateString()}</Card.Subtitle>
                  <Card.Text>{event.adress}</Card.Text>
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