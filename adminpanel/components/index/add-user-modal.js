import { Button, Alert, Form, Modal } from 'react-bootstrap';
import { useState } from 'react';
import packageInfo from "../../package.json"; 
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
        setCreationError(answer.error)
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
        <Form onSubmit={handleCreationSubmit} className='p-0'>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="text"
              className="col-7 px-2 py-1"
              placeholder="Имя"
              name="name" 
              value={creationData.name}
              onChange={handleCreationChange}
              required/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="email"
              className="col-7 px-2 py-1"
              placeholder="Электронная почта"
              name="email" 
              value={creationData.email}
              onChange={handleCreationChange}
              required/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="text"
              className="col-7 px-2 py-1"
              placeholder="Пароль"
              name="password" 
              value={creationData.password}
              onChange={handleCreationChange}
              required/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <Form.Check>
              <input type="checkbox"
                className='me-2'
                onChange={handleCheckbox}/>
              Админ права
            </Form.Check>
          </Form.Group>
            {creationError && <Alert className="text-center" variant="danger">{creationError}</Alert>}
          <Form.Group className='justify-content-center d-flex mt-3'>
            <Button type="submit">Создать</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddUserModal;