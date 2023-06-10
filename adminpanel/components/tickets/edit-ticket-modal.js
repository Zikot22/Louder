import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useState } from 'react';
import packageInfo from "../../package.json"; 
import { getCookie } from 'cookies-next';

const EditTicketModal = ({ onClose, selectedTicket }) => {
  const domain = packageInfo.domain;
  const [editData, setEditData] = useState({ eventId: selectedTicket.eventId, price: selectedTicket.price, typeName: '', typeDescription: '' })
  const [editError, setEditError] = useState('');
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    onClose();
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${domain}/Ticket/${selectedTicket.id}`, {  
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookie('token')
        },
        body: JSON.stringify(editData),
      });

      if(response.ok) { handleClose() }
      else {
        var answer = await response.json();
        setEditError(answer.error)
      };
    } 
    catch {
      setEditError("Во время изменения произошла ошибка");
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>Изменить билет {selectedTicket.typeName}</Modal.Header>
      <Modal.Body className='px-0'>
        <Form onSubmit={handleEditSubmit} className='p-0'>
        <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="text"
              className="col-7 px-2 py-1"
              placeholder="Id мероприятия"
              name="eventId" 
              value={editData.eventId}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="text"
              className="col-7 px-2 py-1"
              placeholder="Цена"
              name="price" 
              value={editData.price}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="text"
              className="col-7 px-2 py-1"
              placeholder="Имя"
              name="typeName" 
              value={editData.typeName}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="text"
              className="col-7 px-2 py-1"
              placeholder="Описание"
              name="typeDescription" 
              value={editData.typeDescription}
              onChange={handleEditChange}/>
          </Form.Group>
            {editError && <Alert className="text-center" variant="danger">{editError}</Alert>}
          <Form.Group className='justify-content-center d-flex mt-3'>
            <Button type="submit">Изменить</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditTicketModal;