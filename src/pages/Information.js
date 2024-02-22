// Information.js
import React, { useState } from 'react';
import InfoModal from './InfoModal';
import infoData from '../Assets/info.json';

const Information = () => {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState({ title: '', content: '' });

  const openModal = (title, content) => {
    setSelectedInfo({ title, content });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>       
      <div className='Info'>
      {infoData.map((info, index) => (
        <div key={index} className='infoBox' onClick={() => openModal(info.title, info.content)}>
          <p>{info.title}</p>
        </div>
      ))}

      <InfoModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        title={selectedInfo.title}
        content={selectedInfo.content}
      />
    </div>


      <div className='Sources'>
        <div>
          <p>By: Rasmus Seppänen</p>
          
        </div>
      </div>
    </div>
  );
};

export default Information;
