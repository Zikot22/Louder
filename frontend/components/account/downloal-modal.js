import { useState } from 'react';
import { Modal } from 'react-bootstrap';

const DownloadModal = ({ downloadLink, onClose }) => {
  const show = true;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header>Ваша ссылка на скачивание готова</Modal.Header>
      <Modal.Body className='d-flex justify-content-center'>
        <a href={downloadLink} onClick={onClose}>Скачать</a>
      </Modal.Body>
    </Modal>
  );
};

export default DownloadModal;