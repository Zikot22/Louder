import React, { useState } from 'react';
import { Card, Button, Container, Col } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SeatSelectorComponent = ({ name, description, price }) => {
  const [quantity, setQuantity] = useState(0);

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = price * quantity;

  return (
    <Container className='pb-3'>  
        <h3 className='mb-3'>Купить билет</h3>
        <Card>
        <Card.Body>
            <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
                <Card.Title>{name} - {price} рублей</Card.Title>
                <Card.Text>{description}</Card.Text>
            </div>
            <div className="d-flex align-items-center">
                <FaChevronLeft onClick={handleDecrease} />
                <div className="mx-2">{quantity}</div>
                <FaChevronRight onClick={handleIncrease} />
            </div>
            </div>
            <Col className='d-flex justify-content-end'>
                <div className='mb-2'>Итог: {totalPrice} рублей</div>
            </Col>
            <Col className='d-flex justify-content-end'>
                <Button color="primary" className="">
                    Купить
                </Button>
            </Col>
        </Card.Body>
        </Card>
    </Container>
  );
};

export default SeatSelectorComponent;