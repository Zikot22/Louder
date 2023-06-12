import { useState } from 'react';
import { Card, Button, Container, Col } from 'react-bootstrap';
import SeatComponent from './seat';

const SeatSelectorComponent = ({ tickets, onBuy }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [purchases, setPurchases] = useState([]);

  const setPrice = (value) => {
    setTotalPrice(totalPrice + value);
  };

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
    <Container className='pb-3' as='section'>  
        <h3 className='mb-3'>Купить билет</h3>
        <Card>
          <Card.Body>
            {tickets?.map((ticket, index) =>(
              <SeatComponent key={index} ticket={ticket} setPrice={setPrice} onSelectTicket={handleSelectTicket}></SeatComponent>
            ))}
            <Col className='d-flex justify-content-end'>
                <p className='mb-2'>Итог: {totalPrice} рублей</p>
            </Col>
            <Col className='d-flex justify-content-end'>
                <Button className='button-fr' onClick={() => onBuy(purchases)}>
                    Купить
                </Button>
            </Col>
          </Card.Body>
        </Card>
    </Container>
  );
};

export default SeatSelectorComponent;