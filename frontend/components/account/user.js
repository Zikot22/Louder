import { Card, Container, Button } from 'react-bootstrap';
import { FaPencilAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import packageInfo from '../../package.json';
import { getCookie, deleteCookie } from 'cookies-next';
import EditUserModal from './edit-user-modal'

const UserProfileComponent = () => {
  const router = useRouter();
  const domain = packageInfo.domain;
  const [modalEdit, setModalEdit] = useState(false);
  const [username, setUsername] = useState('no user');
  const handleOpenEdit = () => setModalEdit(true);
  const handleCloseEdit = () => setModalEdit(false);

  useEffect(
    () => { getUsername(); }
  );

  const getUsername = async () => {
    const response = await fetch(`${domain}/User/${getCookie('userId')}/username`, {  
        method: 'GET',
        headers: {  
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookie('token')
        }
      });
    const answer = await response.json();
    response.ok && setUsername(answer.name);
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await fetch(`${domain}/User/${getCookie('userId')}/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + getCookie('token'),
      },
      body: formData
    });
    if(response.ok) router.reload();
  };

  const handleLogout = () => 
  {
    deleteCookie('token');
    deleteCookie('userId');
    router.push('/');
  };

  useEffect(() => {
    var img = document.getElementById('profile-avatar');
    var userId = getCookie('userId') || null;
    if (img) {
        img.srcset = `${domain}/images/avatars/${userId}.jpg`;
        img.src = `${domain}/images/avatars/${userId}.jpg`;
    }
  });

  return (
    <Container className='d-flex justify-content-center pt-4' as='section'>
      <Card className='background-color-primary border-0'>
        <Card.Img
        id = 'profile-avatar'
        className='rounded-circle'
        style={{ width: '200px', height: '200px', cursor: 'pointer' }}
        onClick={() => document.getElementById('avatar-input').click()}
        onError={({ currentTarget }) =>
          { currentTarget.onerror = null; currentTarget.src='no_avatar.jpg'; currentTarget.srcset='no_avatar.jpg' }}
        />
        <input
        id='avatar-input'
        type='file'
        accept='image/jpeg'
        style={{ display: 'none' }}
        onChange={handleAvatarUpload}
        />
        <Card.Body>
          <Card.Title as='h5' className='d-flex align-items-center justify-content-center'>{ username }<FaPencilAlt className='pt-1' onClick={handleOpenEdit} style={{ cursor: 'pointer' }}/></Card.Title>
          <Card.Text as='p' className='d-flex align-items-center justify-content-center'>
            <Button className='button-fr' onClick={handleLogout} variant='danger'>
              Выйти
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
      { modalEdit && <EditUserModal onClose={ handleCloseEdit }/> }
    </Container>
  );
};

export default UserProfileComponent;