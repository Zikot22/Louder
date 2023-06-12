import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SeatComponent = ({ ticket, onSelectTicket, setPrice }) => {
  const [quantity, setQuantity] = useState(0);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    onSelectTicket(ticket.id, quantity + 1);
    setPrice(ticket.price);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      onSelectTicket(ticket.id, quantity - 1);
      setPrice(-ticket.price);
    }
  };

  return (
    <section className='d-flex align-items-center justify-content-between mb-3'>
      <div>
        <Card.Title as='h5'>{ticket.typeName} - {ticket.price} рублей</Card.Title>
        <Card.Text as='p'>{ticket.typeDescription}</Card.Text>
      </div>
      <div className='d-flex align-items-center'>
        <FaChevronLeft onClick={handleDecrease} />
        <p className='mx-2 mb-1 fs-5'>{quantity}</p>
        <FaChevronRight onClick={handleIncrease} />
      </div>
    </section>
  );
};

export default SeatComponent;