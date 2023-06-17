import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useState } from 'react';
import packageInfo from '../../package.json'; 
import { getCookie } from 'cookies-next';

const EditUserModal = ({ onClose }) => {
  const [editData, setEditData] = useState({ name: '', email: '',
  password: '' })
  const [editError, setEditError] = useState('');
  const [show, setShow] = useState(true);
  const domain = packageInfo.domain;

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
        const response = await fetch(`${domain}/User/${getCookie('userId')}`, {  
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
      setEditError('Во время изменения произошла ошибка');
    }
  }

  return (
    <Modal size='sm' show={show} onHide={handleClose} as='dialog'>
      <Modal.Header>Изменить пользователя</Modal.Header>
      <Modal.Body className='px-0'>
        <Form onSubmit={handleEditSubmit} className='p-0' as='form'>
          <Form.Group className='justify-content-center d-flex mb-2' as='p'>
            <input type='text'
              className='col-10 px-2 py-1'
              placeholder='Имя'
              name='name' 
              value={editData.name}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2' as='p'>
            <input type='email'
              className='col-10 px-2 py-1'
              placeholder='Электронная почта'
              name='email'
              value={editData.email}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2' as='p'>
            <input type='text'
              className='col-10 px-2 py-1'
              placeholder='Пароль'
              name='password' 
              value={editData.password}
              onChange={handleEditChange}/>
          </Form.Group>
            {editError && <Alert className='text-center' variant='danger'>{editError}</Alert>}
          <Form.Group className='justify-content-center d-flex mt-3' as='p'>
            <Button className='button-fr' type='submit'>Изменить</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserModal;