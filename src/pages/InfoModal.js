// Modal.js
import React from 'react';
import Modal from 'react-modal';

const InfoModal = ({ isOpen, closeModal, title, content }) => {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Information Modal"
        style={{
          content: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            width: '300px', // Adjust the width as needed
            height: '500px', // Adjust the height as needed
            margin: 'auto', // Center the modal in the viewport
            border: '2px solid black'
          },
        }}
      >
        <h2>{title}</h2>
        <ul>
          {content && Array.isArray(content) && content.map((data, index) => (
            <React.Fragment key={index}>
              <li style={{listStyleType: 'circle', marginTop: '15px'}}>{data}</li>
              <hr style={{ width: '70%', margin: '5px auto', fontWeight: 'bold' }} />
            </React.Fragment>
          ))}
        </ul>
        <button onClick={closeModal}>Close</button>
      </Modal>
    );
  };

export default InfoModal;
