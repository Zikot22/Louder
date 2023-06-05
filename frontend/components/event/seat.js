import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SeatComponent = ({ ticket, setPrice, setTotalQuantity }) => {

    const [quantity, setQuantity] = useState(0);

    const handleIncrease = () => {
        setQuantity(quantity + 1);
        setTotalQuantity(1)
        setPrice(ticket.price);
    };

    const handleDecrease = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
            setTotalQuantity(-1);
            setPrice(-ticket.price);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
                <Card.Title>{ticket.typeName} - {ticket.price} рублей</Card.Title>
                <Card.Text>{ticket.typeDescription}</Card.Text>
            </div>
            <div className="d-flex align-items-center">
                <FaChevronLeft onClick={handleDecrease} />
                <div className="mx-2">{quantity}</div>
                <FaChevronRight onClick={handleIncrease} />
            </div>
        </div>
    );
};

export default SeatComponent;