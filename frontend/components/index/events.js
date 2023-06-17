import Link from 'next/link';
import { Card, Row, Col, Container } from 'react-bootstrap';
import styles from '../../styles/components/index/events.module.css'
import packageInfo from '../../package.json';

const Events = ({events}) => {
  const domain = packageInfo.domain;
  
  return (
    <Container className='d-flex justify-content-center mt-3' as='section'>
      <Row className='col-12'>
        {events?.map((event, index) => (
          <Col xs='6' sm='4' md='4' lg='3' xl='3' key={index} className='d-flex align-items-stretch mb-3' as='article'>
            <Link href={`/event/${event.id}`} className={styles.link}>
              <Card className='h-100'>
                <Card.Img variation='top' style={{ width: '300px' }} src={`${domain}/images/covers/${event.id}.jpg`} alt='event-cover' className='img-fluid' as='img'/>
                <Card.Body>
                  <Card.Title as='h5'>{event.name}</Card.Title>
                  <Card.Subtitle as='h6' className='mb-2 text-muted'>{new Date(event.dateTime).toLocaleDateString()}</Card.Subtitle>
                  <Card.Text as='p'>{event.adress}</Card.Text>
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