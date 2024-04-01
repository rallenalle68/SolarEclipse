// Information.js
import React, { useState } from 'react';
import InfoModal from './InfoModal';
import infoData from '../Assets/info.json';
import { signOut } from "firebase/auth";
import {auth} from '../Assets/firebase-config';
import { Map, Marker,ZoomControl } from 'pigeon-maps';
import MapInfoModal from '../Component/MapInfoModel';

const Information = () => {
  const [user, setUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState({ title: '', content: '' });
  const [selectedMapInfo, setSelectedMapInfo] = useState(-1);
  const [isMap, setIsMap] = useState(false);

  /*================ Variables for maps config ====================*/
  const [center, setCenter] = useState([42.125672535019156, -80.08600618194332])
  const [zoom, setZoom] = useState(17)
  const [hue, setHue] = useState(0)
  const color = `hsl(${hue % 360}deg 39% 70%)`

  const openModal = (title, content) => {
    setSelectedInfo({ title, content });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setIsMap(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  const openMapModel = (index) => {
    setModalIsOpen(true);
    setIsMap(true);
    setSelectedMapInfo(index);
  }


  return (
    <div>
      <div className='Info'>
      {infoData.map((info, index) => (
        <div key={index} className='infoBox' onClick={() => openModal(info.title, info.content)}>
          <p>{info.title}</p>
        </div>
      ))}

      {isMap === false && <InfoModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        title={selectedInfo.title}
        content={selectedInfo.content}
      />}
      </div>

      {/*===================== Map =======================*/}
      <div style={{position: 'relative', width: '70%', height: '90%', margin: '0px auto', border: '3px solid black'}}>
        <Map
          height={700}
          center={center} 
          defaultZoom={zoom}
          zoom={zoom}
          color={color} 
          onClick={() => setHue(hue + 20)}  
          onBoundsChanged={({ center, zoom }) => { 
            setCenter(center) 
            setZoom(zoom) 
          }} 
        >
          <ZoomControl />
          <Marker 
              width={50}
              anchor={[42.12941876874667, -80.09093876248161]} 
              color={color} 
              onClick={() => {setHue(hue + 20); openMapModel(0)}} 
          />
          
        </Map>
        {(modalIsOpen&&isMap === true) && <MapInfoModal
        index={selectedMapInfo}
        isOpen={modalIsOpen}
        closeModal={closeModal} />}
        <button
          style={{ position: 'absolute', top: '20px', right: '20px'}}
          onClick={() => {
            setCenter([42.125672535019156, -80.08600618194332]);
            setZoom(17);
          }}
        >
          Re-center
        </button>
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
              <p>Alia Scotca</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ textDecoration: 'underline' }}>Other Contributors</p>
              <p>Matthew Gentry</p>
              <p>Quang Phu Ly</p>

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
