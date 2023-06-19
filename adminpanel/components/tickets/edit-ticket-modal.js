import { Modal, Button, Form, Alert, Container } from 'react-bootstrap';
import { useState } from 'react';
import packageInfo from '../../package.json'; 
import { getCookie } from 'cookies-next';

const EditTicketModal = ({ onClose, selectedTicket }) => {
  const domain = packageInfo.domain;
  const [editData, setEditData] = useState({ eventId: selectedTicket.eventId, price: selectedTicket.price, typeName: '', typeDescription: '', templateId: '' })
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
        setEditError(answer.error  ?? 'Ошибка валидации')
      };
    } 
    catch {
      setEditError('Во время изменения произошла ошибка');
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>Изменить билет {selectedTicket.typeName}</Modal.Header>
      <Modal.Body className='px-0'>
        <Container className='d-flex align-items-center justify-content-center text-center'>
          <Form onSubmit={handleEditSubmit} className='p-0 col-8' as='form'>
            <Form.Group as='fieldset'>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Id мероприятия'
                name='eventId' 
                value={editData.eventId}
                onChange={handleEditChange}/>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Цена'
                name='price' 
                value={editData.price}
                onChange={handleEditChange}/>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Имя'
                name='typeName' 
                value={editData.typeName}
                onChange={handleEditChange}/>
              <Form.Control type='text'
                className='mb-3'
                placeholder='Описание'
                name='typeDescription' 
                value={editData.typeDescription}
                onChange={handleEditChange}/>
              <Form.Control type='text'
                className='mb-3'
                placeholder='Шаблон'
                name='templateId' 
                value={editData.templateId}
                onChange={handleEditChange}/>
            </Form.Group>
            <Button type='submit'>Изменить</Button>
          </Form>
        </Container>
        {editError && <Alert className='text-center' variant='danger'>{editError}</Alert>}
      </Modal.Body>
    </Modal>
  );
};

export default EditTicketModal;