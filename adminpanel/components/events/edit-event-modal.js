import { Modal, Button, Form, Alert, Container } from 'react-bootstrap';
import { useState } from 'react';
import packageInfo from '../../package.json'; 
import { getCookie } from 'cookies-next';

const EditEventModal = ({ onClose, selectedEvent }) => {
  const domain = packageInfo.domain;
  const [editData, setEditData] = useState({ name: '', description: '', city: '',
    adress: '', dateTime: selectedEvent.dateTime, amount: selectedEvent.amount })
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
        const response = await fetch(`${domain}/Event/${selectedEvent.id}`, {  
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
        setEditError(answer.error ?? 'Ошибка валидации')
      };
    } 
    catch {
      setEditError('Во время изменения произошла ошибка');
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>Изменить мероприятие {selectedEvent.name}</Modal.Header>
      <Modal.Body className='px-0'>
        <Container className='d-flex align-items-center justify-content-center text-center'>
          <Form onSubmit={handleEditSubmit} className='p-0 col-8' as='form'>
            <Form.Group as='fieldset'>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Имя'
                name='name' 
                value={editData.name}
                onChange={handleEditChange}/>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Описание'
                name='description' 
                value={editData.description}
                onChange={handleEditChange}/>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Город'
                name='city' 
                value={editData.city}
                onChange={handleEditChange}/>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Адрес'
                name='adress' 
                value={editData.adress}
                onChange={handleEditChange}/>
              <Form.Control type='datetime-local'
                className='mb-2'
                name='dateTime' 
                value={editData.dateTime}
                onChange={handleEditChange}/>
              <Form.Control type='text'
                className='mb-3'
                placeholder='Количество билетов'
                name='amount' 
                value={editData.amount}
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

export default EditEventModal;