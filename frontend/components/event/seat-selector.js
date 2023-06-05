import React, { useState } from 'react';
import { Card, Button, Container, Col } from 'react-bootstrap';
import SeatComponent from './seat';

const SeatSelectorComponent = ({ tickets, onBuy }) => {
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const setPrice = (value) => {
    setTotalPrice(totalPrice + value);
  };

  const setQuantity = (value) => {
    setTotalQuantity(totalQuantity + value)
  };

  return (
    <Container className='pb-3'>  
        <h3 className='mb-3'>Купить билет</h3>
        <Card>
        <Card.Body>
          {tickets?.map((ticket, index) =>(
            <SeatComponent key={index} ticket={ticket} setPrice={setPrice} setTotalQuantity={setQuantity}></SeatComponent>
          ))}
          <Col className='d-flex justify-content-end'>
              <div className='mb-2'>Итог: {totalPrice} рублей</div>
          </Col>
          <Col className='d-flex justify-content-end'>
              <Button color="primary" onClick={() => onBuy(totalQuantity)}>
                  Купить
              </Button>
          </Col>
        </Card.Body>
        </Card>
    </Container>
  );
};

export default SeatSelectorComponent;