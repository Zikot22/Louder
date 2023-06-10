import { useState, useEffect } from 'react';
import { Container, Table, Col, Button } from 'react-bootstrap';
import packageInfo from "../package.json";
import AddTicketModal from '../components/tickets/add-ticket-modal';
import EditTicketModal from '../components/tickets/edit-ticket-modal';
import { FaPen, FaTrash } from 'react-icons/fa';
import { getCookie } from 'cookies-next';
import DeleteModal from '../components/delete-modal';
import ErrorMessage from '../components/error';

const Tickets = () => {
  const [searchPattern, setSearchPattern] = useState('');
  const [tickets, setTickets] = useState([]);
  const [modalCreation, setModalCreation] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [error, setError] = useState('');

  const handleCloseError = () => {
    setError('');
  };

  const domain = packageInfo.domain;

  useEffect(() => {
    fetchTickets();
  }, [searchPattern]);

  const fetchTickets = async () => {
    try {
        const response = await fetch(`${domain}/Ticket?searchPattern=${searchPattern}`, {
            headers: {
                'Authorization': 'Bearer ' + getCookie('token'),
            },
        });
        if(response.ok) {
            const tickets = await response.json();
            setTickets(tickets);
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

  const handleAddTicket = () => {
    setModalCreation(true);
  };

  const handleCreationClose = async () => {
    setModalCreation(false);
    await fetchTickets();
  };
    
  const handleDeleteTicket = (ticket) => {
    setSelectedTicket(ticket);
    setModalDelete(true);
  };

  const handleDeleteConfirm = async () =>
  {
    try {
      const response = await fetch(`${domain}/Ticket/${selectedTicket.id}`, {  
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + getCookie('token')
      }});
      if(response.ok) { 
        setModalDelete(false);
        fetchTickets(); 
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

  const handleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
    setModalEdit(true);
  };

  const handleEditClose = async () => {
    setModalEdit(false);
    await fetchTickets();
  };

  return (
    <Container>
      <h1 className='mt-2'>Билеты</h1>
        <Col className='mt-4'>
          <input type="text" className='px-2 py-1' placeholder="Поиск" value={searchPattern} onChange={handleSearchChange} />
        </Col>
        <Col className='mt-2'>
          <Button onClick={handleAddTicket}>Добавить билет</Button>
        </Col>
        <div className="table-responsive">
            <Table striped className="mt-4 table-responsive">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>ID мероприятия</th>
                    <th>Имя</th>
                    <th>Описание</th>
                    <th>Цена</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                        <td className="overflow-cell">{ticket.id}</td>
                        <td className="overflow-cell" style={{maxWidth: '200px', width: '200px'}}>{ticket.eventId}</td>
                        <td className="overflow-cell">{ticket.typeName}</td>
                        <td className="overflow-cell">{ticket.typeDescription}</td>
                        <td className="overflow-cell">{ticket.price}</td>
                        <td className="overflow-cell">
                            <FaPen onClick={() => handleEditTicket(ticket)} className='ms-1 mb-1 me-3' style={{cursor: 'pointer'}}></FaPen>
                            <FaTrash onClick={() => handleDeleteTicket(ticket)} className='mb-1' style={{cursor: 'pointer'}}></FaTrash>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
        { modalCreation && <AddTicketModal onClose={handleCreationClose}/> }
        { modalDelete && <DeleteModal onClose={handleDeleteClose} onConfirm={handleDeleteConfirm}/> }
        { modalEdit && <EditTicketModal onClose={handleEditClose} selectedTicket={selectedTicket}/> }
        { error && <ErrorMessage error={error} onClose={handleCloseError}/> }
    </Container>
  );
};

export default Tickets;