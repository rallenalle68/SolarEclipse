// Information.js
import React, { useState } from 'react';
import InfoModal from './InfoModal';
import infoData from '../Assets/info.json';
import { signOut } from "firebase/auth";
import {auth} from '../Assets/firebase-config'

const Information = () => {
  const [user, setUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState({ title: '', content: '' });

  const openModal = (title, content) => {
    setSelectedInfo({ title, content });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error.message);
    }
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
            <h3 style={{ borderBottom: '1px solid #000' }}>This project was made possible by the people below</h3>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ textDecoration: 'underline' }}>Author</p>
              <p>Rasmus Seppänen</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ textDecoration: 'underline' }}>Sources</p>
              <p>Dr. David Horne</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ textDecoration: 'underline' }}>Special thanks</p>
              <p>Dr. Kefei Wang</p>
              <p>Nicholas Hubert</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ textDecoration: 'underline' }}>Other Contributors</p>
              <p>Matthew Gentry</p>
              <p>Phu</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ textDecoration: 'underline' }}>Sponsors</p>
              <p>Computer & Information Science department</p>
              <p>Gannon Bookstore</p>
            </div>
          </div>

        <button className='SignOutButton' onClick={handleSignOut}> Sign Out</button>
      </div>
    </div>
  );
};

export default Information;
