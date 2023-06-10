import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useState } from 'react';
import packageInfo from "../../package.json"; 
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
        setEditError(answer.error)
      };
    } 
    catch {
      setEditError("Во время изменения произошла ошибка");
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>Изменить мероприятие {selectedEvent.name}</Modal.Header>
      <Modal.Body className='px-0'>
        <Form onSubmit={handleEditSubmit} className='p-0'>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="text"
              className="col-7 px-2 py-1"
              placeholder="Имя"
              name="name" 
              value={editData.name}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="text"
              className="col-7 px-2 py-1"
              placeholder="Описание"
              name="description" 
              value={editData.description}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="text"
              className="col-7 px-2 py-1"
              placeholder="Город"
              name="city" 
              value={editData.city}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="text"
              className="col-7 px-2 py-1"
              placeholder="Адрес"
              name="adress" 
              value={editData.adress}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="datetime-local"
              className="col-7 px-2 py-1"
              name="dateTime" 
              value={editData.dateTime}
              onChange={handleEditChange}/>
          </Form.Group>
          <Form.Group className='justify-content-center d-flex mb-2'>
            <input type="text"
              className="col-7 px-2 py-1"
              placeholder="Количество билетов"
              name="amount" 
              value={editData.amount}
              onChange={handleEditChange}/>
          </Form.Group>
            {editError && <Alert className="text-center" variant="danger">{editError}</Alert>}
          <Form.Group className='justify-content-center d-flex mt-3'>
            <Button type="submit">Изменить</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditEventModal;