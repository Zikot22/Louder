import { Button, Alert, Form, Modal } from 'react-bootstrap';
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
        setCreationError(answer.error)
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
        <Form onSubmit={handleCreationSubmit} className='p-0'>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='text'
              className='col-7 px-2 py-1'
              placeholder='Id мероприятия'
              name='eventId' 
              value={creationData.eventId}
              onChange={handleCreationChange}
              required/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='text'
              className='col-7 px-2 py-1'
              placeholder='Цена'
              name='price' 
              value={creationData.price}
              onChange={handleCreationChange}
              required/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='text'
              className='col-7 px-2 py-1'
              placeholder='Имя'
              name='typeName' 
              value={creationData.typeName}
              onChange={handleCreationChange}
              required/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='text'
              className='col-7 px-2 py-1'
              placeholder='Описание'
              name='typeDescription' 
              value={creationData.typeDescription}
              onChange={handleCreationChange}/>
          </Form.Group>
            {creationError && <Alert className='text-center' variant='danger'>{creationError}</Alert>}
          <Form.Group className='justify-content-center d-flex mt-3'>
            <Button type='submit'>Создать</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddTicketModal;