// Modal.js
import React from 'react';
import Modal from 'react-modal';

const InfoModal = ({ isOpen, closeModal, title, content }) => {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Information Modal"
        className={'Information-Modal'}
      >
        <h2>{title}</h2>
        <ul>
          {content && Array.isArray(content) && content.map((data, index) => (
            <React.Fragment key={index}>
              <li style={{listStyleType: 'circle', marginTop: '15px', fontSize: 18, color:'white'}}>{data}</li>
              <hr style={{ width: '70%', margin: '5px auto', fontWeight: 'bold' }} />
            </React.Fragment>
          ))}
        </ul>
        <button onClick={closeModal}>Close</button>
      </Modal>
    );
  };

export default InfoModal;
