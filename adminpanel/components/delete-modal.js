import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import packageInfo from '../package.json'; 

const DeleteModal = ({ onClose, onConfirm }) => {
  const [show, setShow] = useState(true);

  const domain = packageInfo.domain;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header>
        <Modal.Title as='h4'>Вы уверены?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Удаление - необратимый процесс</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>
          Нет
        </Button>
        <Button onClick={onConfirm}>
          Да
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;