import { Button, Alert, Form, Modal, Container } from 'react-bootstrap';
import { useState } from 'react';
import packageInfo from '../../package.json'; 
import { getCookie } from 'cookies-next';

const AddUserModal = ( { onClose } ) => {
  const [creationData, setCreationData] = useState({ name: '', email: '', password: '', adminPermissions: false })
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
      const response = await fetch(`${domain}/User`, {  
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
        setCreationError(answer.error ?? 'Ошибка валидации')
      };
    } 
    catch (error) {
      setCreationError('Во время создания произошла ошибка');
    }
  }

  const handleCheckbox = () => {
    setCreationData((prevState) => ({
      ...prevState,
      adminPermissions: !prevState.adminPermissions,
    }));
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>Создать пользователя</Modal.Header>
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
              <Form.Control type='email'
                className='mb-2'
                placeholder='Электронная почта'
                name='email' 
                value={creationData.email}
                onChange={handleCreationChange}
                required/>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Пароль'
                name='password' 
                value={creationData.password}
                onChange={handleCreationChange}
                required/>
              <Form.Check className='mb-3'>
                <input type='checkbox'
                  className='me-2'
                  onChange={handleCheckbox}/>
                Админ права
              </Form.Check>
            </Form.Group>
            <Button type='submit'>Создать</Button>
          </Form>
        </Container>
        {creationError && <Alert className='text-center mt-3' variant='danger'>{creationError}</Alert>}
      </Modal.Body>
    </Modal>
  );
};

export default AddUserModal;