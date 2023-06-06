import React, { useState } from 'react';
import { Card, Button, Container, Col } from 'react-bootstrap';
import SeatComponent from './seat';

const SeatSelectorComponent = ({ tickets, onBuy }) => {
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [purchases, setPurchases] = useState([]);
  // const [totalQuantity, setTotalQuantity] = useState(0);

  const setPrice = (value) => {
    setTotalPrice(totalPrice + value);
  };

  // const setQuantity = (value) => {
  //   setTotalQuantity(totalQuantity + value)
  // };

  const handleSelectTicket = (ticketId, count) => {
    const updatedPurchases = [...purchases];
    const index = updatedPurchases.findIndex(item => item.ticketId === ticketId);
    if (index !== -1) {
      updatedPurchases[index].count = count;
    } else {
      updatedPurchases.push({ ticketId, count });
    }

    setPurchases(updatedPurchases);
  };

  return (
    <Container className='pb-3'>  
        <h3 className='mb-3'>Купить билет</h3>
        <Card>
        <Card.Body>
          {tickets?.map((ticket, index) =>(
            <SeatComponent key={index} ticket={ticket} setPrice={setPrice} onSelectTicket={handleSelectTicket}></SeatComponent>
            // setPrice={setPrice} setTotalQuantity={setQuantity}
          ))}
          <Col className='d-flex justify-content-end'>
              <div className='mb-2'>Итог: {totalPrice} рублей</div>
              {/* {totalPrice} рублей */}
          </Col>
          <Col className='d-flex justify-content-end'>
              <Button color="primary" onClick={() => onBuy(purchases)}>
                  Купить
              </Button>
          </Col>
        </Card.Body>
        </Card>
    </Container>
  );
};

export default SeatSelectorComponent;