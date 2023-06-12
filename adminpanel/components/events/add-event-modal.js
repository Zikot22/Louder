import { Button, Alert, Form, Modal } from 'react-bootstrap';
import { useState } from 'react';
import packageInfo from '../../package.json'; 
import { getCookie } from 'cookies-next';

const AddEventModal = ( { onClose } ) => {
  const [creationData, setCreationData] = useState({ name: '', description: '', city: '',
   adress: '', dateTime: '', amount: '' })
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
      const response = await fetch(`${domain}/Event`, {  
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
      <Modal.Header>Создать мероприятие</Modal.Header>
      <Modal.Body className='px-0'>
        <Form onSubmit={handleCreationSubmit} className='p-0'>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='text'
              className='col-7 px-2 py-1'
              placeholder='Имя'
              name='name' 
              value={creationData.name}
              onChange={handleCreationChange}
              required/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='text'
              className='col-7 px-2 py-1'
              placeholder='Описание'
              name='description' 
              value={creationData.description}
              onChange={handleCreationChange}
              required/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='text'
              className='col-7 px-2 py-1'
              placeholder='Город'
              name='city' 
              value={creationData.city}
              onChange={handleCreationChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='text'
              className='col-7 px-2 py-1'
              placeholder='Адрес'
              name='adress' 
              value={creationData.adress}
              onChange={handleCreationChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='datetime-local'
              className='col-7 px-2 py-1'
              name='dateTime' 
              value={creationData.dateTime}
              onChange={handleCreationChange}
              required/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='text'
              className='col-7 px-2 py-1'
              placeholder='Количество билетов'
              name='amount' 
              value={creationData.amount}
              onChange={handleCreationChange}
              required/>
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

export default AddEventModal;