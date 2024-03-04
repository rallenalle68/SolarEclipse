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
          },
        }}
      >
        <h2>{title}</h2>
        <p>{content}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    );
  };

export default InfoModal;
