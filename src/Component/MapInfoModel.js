// Modal.js
import React from 'react';
import Modal from 'react-modal';
import mapInfo from './mapInfo';
import zurnImg from "../Assets/zurn.jpg"
import GannonArchImg from "../Assets/GannonArch.jpg"
import ihack from "../Assets/ihack.jpg"

const MapInfoModal = ({ index, isOpen, closeModal }) => {
    const imageSource = [zurnImg, GannonArchImg, ihack]
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
        <h2>{mapInfo[index].title}</h2>
        <p className='p4' style={{fontSize:20}}>{mapInfo[index].description}</p>
        <p className='p2' style={{color:'black'}}>{mapInfo[index].address}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    );
  };

export default MapInfoModal;
