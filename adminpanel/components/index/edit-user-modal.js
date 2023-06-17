import { Modal, Button, Form, Alert, Container } from 'react-bootstrap';
import { useState } from 'react';
import packageInfo from '../../package.json'; 
import { getCookie } from 'cookies-next';

const EditUserModal = ({ onClose, selectedUser }) => {
  const [editData, setEditData] = useState({ name: '', email: '',
     password: selectedUser.password, adminPermissions: selectedUser.adminPermissions })
  const [editError, setEditError] = useState('');
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const domain = packageInfo.domain;

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
        const response = await fetch(`${domain}/User/admin/${selectedUser.id}`, {  
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

  const handleCheckbox = () => {
    setEditData((prevState) => ({
      ...prevState,
      adminPermissions: !prevState.adminPermissions,
    }));
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>Изменить пользователя {selectedUser.name}</Modal.Header>
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
              <Form.Control type='email'
                className='mb-2'
                placeholder='Электронная почта'
                name='email'
                value={editData.email}
                onChange={handleEditChange}/>
              <Form.Control type='text'
                className='mb-2'
                placeholder='Пароль'
                name='password' 
                value={editData.password}
                onChange={handleEditChange}/>
              <Form.Check className='mb-3'>
                <input type='checkbox'
                  defaultChecked={selectedUser.adminPermissions}
                  value={editData.adminPermissions}
                  className='me-2'
                  onChange={handleCheckbox}/>
                Админ права
              </Form.Check>
            </Form.Group>
            <Button type='submit'>Изменить</Button>
          </Form>
        </Container>
        {editError && <Alert className='text-center' variant='danger'>{editError}</Alert>}
      </Modal.Body>
    </Modal>
  );
};

export default EditUserModal;