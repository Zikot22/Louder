import { Modal, Button, Form, Alert } from 'react-bootstrap';
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
        setEditError(answer.error)
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
        <Form onSubmit={handleEditSubmit} className='p-0'>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='text'
              className='col-7 px-2 py-1'
              placeholder='Имя'
              name='name' 
              value={editData.name}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='email'
              className='col-7 px-2 py-1'
              placeholder='Электронная почта'
              name='email'
              value={editData.email}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type='text'
              className='col-7 px-2 py-1'
              placeholder='Пароль'
              name='password' 
              value={editData.password}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <Form.Check>
              <input type='checkbox'
                defaultChecked={selectedUser.adminPermissions}
                value={editData.adminPermissions}
                className='me-2'
                onChange={handleCheckbox}/>
              Админ права
            </Form.Check>
          </Form.Group>
            {editError && <Alert className='text-center' variant='danger'>{editError}</Alert>}
          <Form.Group className='justify-content-center d-flex mt-3'>
            <Button type='submit'>Изменить</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserModal;