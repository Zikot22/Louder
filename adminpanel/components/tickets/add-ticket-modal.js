import { Button, Alert, Form, Modal, Container } from 'react-bootstrap';
import { useState } from 'react';
import packageInfo from '../../package.json'; 
import { getCookie } from 'cookies-next';

const AddTicketModal = ( { onClose } ) => {
  const [creationData, setCreationData] = useState({ eventId: '', price: '', typeName: '', typeDescription: '' })
  const [creationError, setCreationError] = useState('');
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const domain = packageInfo.domain;

  const handleCreationChange = (e) => {
    const { name, value } = e.target;
    setCreationData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${domain}/Ticket`, {  
        method: 'PUT',
        headers: {  
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookie('token')
        },
        body: JSON.stringify(creationData),
      });
      if(response.ok) { handleClose() }
      else {
        var answer = await response.json();
        setCreationError(answer.error  ?? 'Ошибка валидации')
      };
    } 
    catch (error) {
      setCreationError('Во время создания произошла ошибка');
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>Создать билет</Modal.Header>
      <Modal.Body className='px-0'>
        <Container className='d-flex align-items-center justify-content-center text-center'>
          <Form onSubmit={handleCreationSubmit} className='col-8' as='form'>
            <Form.Group as='fieldset'>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Id мероприятия'
                name='eventId' 
                value={creationData.eventId}
                onChange={handleCreationChange}
                required/>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Цена'
                name='price' 
                value={creationData.price}
                onChange={handleCreationChange}
                required/>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Имя'
                name='typeName' 
                value={creationData.typeName}
                onChange={handleCreationChange}
                required/>
              <Form.Control type='text'
                className='mb-3'
                placeholder='Описание'
                name='typeDescription' 
                value={creationData.typeDescription}
                onChange={handleCreationChange}/>
            </Form.Group>
            <Button type='submit'>Создать</Button>
          </Form>
        </Container>
        {creationError && <Alert className='text-center' variant='danger'>{creationError}</Alert>}
      </Modal.Body>
    </Modal>
  );
};

export default AddTicketModal;