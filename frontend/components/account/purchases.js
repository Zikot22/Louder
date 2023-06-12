import {Card, Row, Col, Container} from 'react-bootstrap';
import styles from '../../styles/components/index/events.module.css'
import packageInfo from '../../package.json';

const Purchases = ({purchases}) => {
  const domain = packageInfo.domain;

  return (
    <Container className='d-flex justify-content-center mt-3' as='section'>
      <Row className='col-12'>
        {purchases?.map((purchase, index) => (
          <Col xs='6' sm='4' md='3' lg='2' xl='2' key={index} className='d-flex align-items-stretch mb-3' as='article'>
            <a className={styles.link}>
              <Card className='h-100'>
                <Card.Img variation='top' style={{ maxWidth: '300px'}} src={`${domain}/images/covers/${purchase.ticket.event.id}.jpg`} className='img-fluid'/>
                <Card.Body>
                  <Card.Title tag='h5'>{purchase.ticket.event.name}</Card.Title>
                  <Card.Subtitle tag='h6' className='mb-2 text-muted'>{purchase.ticket.typeName}</Card.Subtitle>
                  <Card.Text>{'Билетов: ' + purchase.count}</Card.Text>
                  <Card.Text>{'город ' + purchase.ticket.event.city}</Card.Text>
                </Card.Body>
              </Card>
            </a>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Purchases;