import { Container, Row, Col } from 'react-bootstrap';
import packageInfo from "../../package.json";

const domain = packageInfo.domain;

const EventInformationComponent = ({event}) => {
  return (
    <Container className='pt-3 mb-4' style={{wordWrap: 'break-word'}}>
      <Row>
        <Col xs={12} md={6} lg={4} xl={4} xxl={4} className='mb-3 d-flex justify-content-center'>
          <img
              src={`${domain}/images/covers/${event.id}.jpg `}
              alt="Event Cover"
              className="img-fluid"
              style={{ maxWidth: '300px', height: "auto" }}
          />
        </Col>
        <Col xs={12} md={5}>
            <h2>{event.name}</h2>
            <p className='m-0'>{new Date(event.dateTime).toLocaleDateString()}</p>
            <p>{`г. ${event.city}, ${event.adress}`}</p>
            <p className='mt-3'>{event.description}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default EventInformationComponent;