import { useState, useEffect } from 'react';
import { Container, Table, Col, Button } from 'react-bootstrap';
import packageInfo from "../package.json"; 
import AddUserModal from '../components/index/add-user-modal';
import EditUserModal from '../components/index/edit-user-modal';
import { FaEye, FaPen, FaTrash } from 'react-icons/fa';
import { getCookie } from 'cookies-next';
import DeleteModal from '../components/delete-modal';
import ErrorMessage from '../components/error';

const Index = () => {
  const [searchPattern, setSearchPattern] = useState('');
  const [users, setUsers] = useState([]);
  const [modalCreation, setModalCreation] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  const handleCloseError = () => {
    setError('');
  };

  const domain = packageInfo.domain;

  useEffect(() => {
    fetchUsers();
  }, [searchPattern]);

  const fetchUsers = async () => {
    try {
        const response = await fetch(`${domain}/User?searchPattern=${searchPattern}`, {
            headers: {
                'Authorization': 'Bearer ' + getCookie('token'),
            },
        });
        if(response.ok) {
            const users = await response.json();
            setUsers(users);
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

  const handleAddUser = () => {
    setModalCreation(true);
  };

  const handleCreationClose = async () => {
    setModalCreation(false);
    await fetchUsers();
  };
    
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setModalDelete(true);
  };

  const handleDeleteConfirm = async () =>
  {
    try {
      const response = await fetch(`${domain}/User/${selectedUser.id}`, {  
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + getCookie('token')
      }});
      if(response.ok) { 
        setModalDelete(false);
        fetchUsers(); 
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

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalEdit(true);
  };

  const handleEditClose = async () => {
    setModalEdit(false);
    await fetchUsers();
  };

  const handleChangeAvatar = (user) => 
  {
    setSelectedUser(user);
    document.getElementById('avatar-input').click();
  }

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);
    try{
      const response = await fetch(`${domain}/User/${selectedUser.id}/avatar`, {
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
      <h1 className='mt-2'>Пользователи</h1>
        <Col className='mt-4'>
          <input type="text" className='ps-2 pe-1 py-1' placeholder="Поиск" value={searchPattern} onChange={handleSearchChange} />
        </Col>
        <Col className='mt-2'>
          <Button onClick={handleAddUser}>Добавить пользователя</Button>
        </Col>
        <div className="table-responsive">
            <Table striped className="mt-4 table-responsive">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Почта</th>
                    <th>Пароль</th>
                    <th>Админ</th>
                    <th>Аватар</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                    <td className="overflow-cell">{user.id}</td>
                    <td className="overflow-cell">{user.name}</td>
                    <td className="overflow-cell">{user.email}</td>
                    <td className="overflow-cell">{user.password}</td>
                    <td className="overflow-cell">{user.adminPermissions ? 'Да' : 'Нет'}</td>
                    <td className="overflow-cell">
                      <FaPen className='ms-1 mb-1 me-3' onClick={() => handleChangeAvatar(user)} style={{cursor: 'pointer'}}></FaPen>
                      <a href={`${domain}/images/avatars/${user.id}.jpg`} target="_blank">
                        <FaEye className='mb-1 me-3' style={{cursor: 'pointer', color: 'black'}}></FaEye>
                      </a>
                      </td>
                    <td className="overflow-cell">
                        <FaPen onClick={() => handleEditUser(user)} className='ms-1 mb-1 me-3' style={{cursor: 'pointer'}}></FaPen>
                        <FaTrash onClick={() => handleDeleteUser(user)} className='mb-1' style={{cursor: 'pointer'}}></FaTrash>
                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
        <input
          id="avatar-input"
          type="file"
          accept="image/jpeg"
          style={{ display: 'none' }}
          onChange={handleAvatarUpload}
          />
        { modalCreation && <AddUserModal onClose={handleCreationClose}/> }
        { modalDelete && <DeleteModal onClose={handleDeleteClose} onConfirm={handleDeleteConfirm}/> }
        { modalEdit && <EditUserModal onClose={handleEditClose} selectedUser={selectedUser}/> }
        { error && <ErrorMessage error={error} onClose={handleCloseError}/> }
    </Container>
  );
};

export default Index;