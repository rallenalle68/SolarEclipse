// Information.js
import React, { useState } from 'react';
import InfoModal from './InfoModal';
import infoData from '../Assets/info.json';

const Information = (handleSignOut) => {

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


      <div className='Credits'>
        <div>
          <h1>Credits</h1>
          <h3>This project was made possible by the people below</h3>
          <p>Rasmus Seppänen</p>
          {/* <p>Matthew Gentry</p>
          <p>Phou</p>
          <p>Dr. Wang</p>
          <p>Dr. Horne</p>
          <a>Nicholas Hubert</a> */}
        </div>
        <button className='SignOutButton' onClick={handleSignOut}> Sign Out</button>
      </div>
    </div>
  );
};

export default Information;
