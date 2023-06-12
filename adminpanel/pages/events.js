import { useState, useEffect } from 'react';
import { Container, Table, Col, Button } from 'react-bootstrap';
import packageInfo from '../package.json';
import AddEventModal from '../components/events/add-event-modal';
import EditEventModal from '../components/events/edit-event-modal';
import { FaEye, FaPen, FaTrash } from 'react-icons/fa';
import { getCookie } from 'cookies-next';
import DeleteModal from '../components/delete-modal';
import ErrorMessage from '../components/error';

const Events = () => {
  const [searchPattern, setSearchPattern] = useState('');
  const [events, setEvents] = useState([]);
  const [modalCreation, setModalCreation] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState('');

  const handleCloseError = () => {
    setError('');
  };

  const domain = packageInfo.domain;

  useEffect(() => {
    fetchEvents();
  }, [searchPattern]);

  const fetchEvents = async () => {
    try {
        const response = await fetch(`${domain}/Event?searchPattern=${searchPattern}`, {
            headers: {
                'Authorization': 'Bearer ' + getCookie('token'),
            },
        });
        if(response.ok) {
            const events = await response.json();
            setEvents(events);
        }
        else {
            var answer = await response.json();
            setError(answer.error)
        };
    } 
    catch (error) {
        setError(error)
    }
  };

  const handleAddEvent = () => {
    setModalCreation(true);
  };

  const handleCreationClose = async () => {
    setModalCreation(false);
    await fetchEvents();
  };
    
  const handleDeleteEvent = (event) => {
    setSelectedEvent(event);
    setModalDelete(true);
  };

  const handleDeleteConfirm = async () =>
  {
    try {
      const response = await fetch(`${domain}/Event/${selectedEvent.id}`, {  
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + getCookie('token')
      }});
      if(response.ok) { 
        setModalDelete(false);
        fetchEvents(); 
      }
      else {
        setModalDelete(false);
        var answer = await response.json();
        setError(answer.error);
      };
    } 
    catch (error) {
      setModalDelete(false);
      setError(error);
    } 
  };

  const handleDeleteClose = async () => 
  {
    setModalDelete(false);
  }

  const handleSearchChange = (e) => {
    setSearchPattern(e.target.value);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setModalEdit(true);
  };

  const handleEditClose = async () => {
    setModalEdit(false);
    await fetchEvents();
  };

  const handleChangeCover = (event) => 
  {
    setSelectedEvent(event);
    document.getElementById('cover-input').click();
  }

  const handleCoverUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('cover', file);
    try{
      const response = await fetch(`${domain}/Event/${selectedEvent.id}/cover`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + getCookie('token'),
        },
        body: formData
      })
      if(!response.ok) {
        var answer = await response.json();
        setError(answer.error);
      };
    } 
    catch (error) {
      setModalDelete(false);
      setError(error);
    } 
  };

  return (
    <Container>
      <h1 className='mt-2'>Мероприятия</h1>
        <Col className='mt-4'>
          <input type='text' className='px-2 py-1' placeholder='Поиск' value={searchPattern} onChange={handleSearchChange} />
        </Col>
        <Col className='mt-2'>
          <Button onClick={handleAddEvent}>Добавить мероприятие</Button>
        </Col>
        <div className='table-responsive'>
            <Table striped className='mt-4 table-responsive'>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Описание</th>
                    <th>Город</th>
                    <th>Адрес</th>
                    <th>Дата</th>
                    <th>Количество</th>
                    <th>Обложка</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {events.map((event) => (
                    <tr key={event.id}>
                    <td className='overflow-cell'>{event.id}</td>
                    <td className='overflow-cell'>{event.name}</td>
                    <td className='overflow-cell'>{event.description}</td>
                    <td className='overflow-cell'>{event.city}</td>
                    <td className='overflow-cell'>{event.adress}</td>
                    <td className='overflow-cell'>{event.dateTime}</td>
                    <td className='overflow-cell'>{event.amount}</td>
                    <td className='overflow-cell'>
                      <FaPen className='ms-1 mb-1 me-3' onClick={() => handleChangeCover(event)} style={{cursor: 'pointer'}}></FaPen>
                      <a href={`${domain}/images/covers/${event.id}.jpg`} target='_blank'>
                        <FaEye className='mb-1 me-3' style={{cursor: 'pointer', color: 'black'}}></FaEye>
                      </a>
                      </td>
                    <td className='overflow-cell'>
                        <FaPen onClick={() => handleEditEvent(event)} className='ms-1 mb-1 me-3' style={{cursor: 'pointer'}}></FaPen>
                        <FaTrash onClick={() => handleDeleteEvent(event)} className='mb-1' style={{cursor: 'pointer'}}></FaTrash>
                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
        <input
          id='cover-input'
          type='file'
          accept='image/jpeg'
          style={{ display: 'none' }}
          onChange={handleCoverUpload}
          />
        { modalCreation && <AddEventModal onClose={handleCreationClose}/> }
        { modalDelete && <DeleteModal onClose={handleDeleteClose} onConfirm={handleDeleteConfirm}/> }
        { modalEdit && <EditEventModal onClose={handleEditClose} selectedEvent={selectedEvent}/> }
        { error && <ErrorMessage error={error} onClose={handleCloseError}/> }
    </Container>
  );
};

export default Events;