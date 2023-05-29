import { Container, Row, Col, Media } from 'react-bootstrap';

const EventInformationComponent = () => {
  return (
    <Container className='pt-3'>
      <Row>
        <Col xs={12} md={6} lg={4} xl={4} xxl={3} className='mb-3 d-flex justify-content-center'>
        <img
            src="mer.jpg"
            alt="Event Cover"
            className="img-fluid"
            style={{ maxWidth: '300px', height: "auto" }}
          />
        </Col>
        <Col xs={12} md={6}>
          <div>
            <h2>Название мероприятия</h2>
            <p className='m-0'>12.12.2024</p>
            <p>улица Тургеневская 10/6</p>
            <p className='mt-3'>Lorem ipsum dolor sit amet,
             consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
               Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EventInformationComponent;