import { Card, Container, Col } from 'react-bootstrap';
import { FaPencilAlt } from 'react-icons/fa';

const UserProfileComponent = ({ name, avatarSrc, onAvatarUpload, onEdit }) => {
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/jpeg') {
      // Perform the avatar upload logic here
      // This function will be triggered when a valid JPG file is selected for upload
      // You can use it to handle the file upload, display a preview, or make an API request
      
      // Example: Displaying a preview of the selected avatar image
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedImageSrc = e.target.result;
        // Invoke the onAvatarUpload function passing the uploadedImageSrc
        onAvatarUpload(uploadedImageSrc);
      };
      reader.readAsDataURL(file);
    } else {
      // Handle the case when the selected file is not a JPG file
      // You can display an error message or perform any other desired action
      console.log('Please select a valid JPG file.');
    }
  };

  return (
    <Container className="d-flex justify-content-center">
        <Col md="4" lg="3" className="d-flex justify-content-center m-0">
            <Card className='background-color-primary border-0'>
                <Card.Img
                top
                src={avatarSrc}
                alt="Avatar"
                className="rounded-circle"
                style={{ width: '200px', height: '200px' }}
                onClick={() => document.getElementById('avatar-input').click()}
                />
                <input
                id="avatar-input"
                type="file"
                accept="image/jpeg"
                style={{ display: 'none' }}
                onChange={handleAvatarUpload}
                />
                <Card.Body className="d-flex align-items-center">
                    <Card.Title tag="h3" className="mr-3">{name} <FaPencilAlt className="pb-1" onClick={onEdit} style={{ cursor: 'pointer' }}/></Card.Title> 
                </Card.Body>
            </Card>
        </Col>
    </Container>
  );
};

export default UserProfileComponent;