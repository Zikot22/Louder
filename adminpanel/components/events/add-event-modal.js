import { Button, Alert, Form, Modal, Container } from 'react-bootstrap';
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
        setCreationError(answer.error  ?? 'Ошибка валидации')
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
        <Container className='d-flex align-items-center justify-content-center text-center'>
          <Form onSubmit={handleCreationSubmit} className='p-0 col-8' as='form'>
            <Form.Group as='fieldset'>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Имя'
                name='name' 
                value={creationData.name}
                onChange={handleCreationChange}
                required/>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Описание'
                name='description' 
                value={creationData.description}
                onChange={handleCreationChange}
                required/>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Город'
                name='city' 
                value={creationData.city}
                onChange={handleCreationChange}/>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Адрес'
                name='adress' 
                value={creationData.adress}
                onChange={handleCreationChange}/>
              <Form.Control type='datetime-local'
                className='mb-2'
                name='dateTime' 
                value={creationData.dateTime}
                onChange={handleCreationChange}
                required/>
              <Form.Control type='text'
                className='mb-3'
                placeholder='Количество билетов'
                name='amount' 
                value={creationData.amount}
                onChange={handleCreationChange}
                required/>
            </Form.Group>
            <Button type='submit'>Создать</Button>
          </Form>
        </Container>
        {creationError && <Alert className='text-center' variant='danger'>{creationError}</Alert>}
      </Modal.Body>
    </Modal>
  );
};

export default AddEventModal;