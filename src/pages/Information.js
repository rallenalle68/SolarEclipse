import React, { useState } from 'react';
import InfoModal from './InfoModal';
import infoData from '../Assets/info.json';
import { signOut } from "firebase/auth";
import { auth } from '../Assets/firebase-config';
import { Map, Marker, ZoomControl } from 'pigeon-maps';
import MapInfoModal from '../Component/MapInfoModel';
import Planets from '../Assets/NASAEclipse.png';
import DiamondRingEffect from '../Assets/DiamondRingEffect.png';
import BaileysBeads from '../Assets/BaileysBeads.png';


const Information = () => {
  const [user, setUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState({ title: '', img: '', content: '' });
  const [selectedMapInfo, setSelectedMapInfo] = useState(-1);
  const [isMap, setIsMap] = useState(false);
  /*================ Variables for maps config ====================*/
  const [center, setCenter] = useState([42.12841284953883, -80.08891550873273])
  const [zoom, setZoom] = useState(16)
  const [hue, setHue] = useState(0)
  const color = `hsl(${hue % 360}deg 39% 70%)`;
  
  const openModal = (title, img, content, index) => {
    let selectedImg = img; // Default to the provided image
    // Check if it's the 4th box (index 3) or the 6th box (index 5)
    if (index === 3) {
      selectedImg = Planets; // Set image source to Planets for the 4th index
    } else if (index === 7) {
      selectedImg = DiamondRingEffect; // Set image source to DiamondRingEffect for the 6th index
    } else if(index === 8){
      selectedImg = BaileysBeads; // Set image source to DiamondRingEffect for the 7th index
    }
    setSelectedInfo({
      title,
      img: selectedImg,
      content
    });
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
  };

  return (
    <div>
      <div className='Info'>
        {infoData.map((info, index) => (
          <div key={index} className='infoBox' onClick={() => openModal(info.title, info.img, info.content, index)}>
            <p>{info.title}</p>
          </div>
        ))}

        {isMap === false && <InfoModal
          isOpen={modalIsOpen}
          closeModal={closeModal}
          title={selectedInfo.title}
          img={selectedInfo.img}
          content={selectedInfo.content}
        />}
      </div>
      {/*===================== Map =======================*/}
      <p className='p1' style={{backgroundColor:'green'}}>Campus events</p>
      <p className='p2' style={{backgroundColor:'green', padding:30}}>The Gannon Students, faculty, staff and community are invited to view the solar eclipse on Friendship Green and The McConnell Family Stadium. Weather permitting, Gannon staff/faculty will be providing a safe, educational viewing experience. Solar eclipse glasses will be provided as well as the opportunity to view the eclipse through high powered telescopes and a specially designed large format viewing window.</p>
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
          <Marker 
              width={50}
              anchor={[42.127744903761894, -80.08712566175154]} 
              color={color} 
              onClick={() => {setHue(hue + 20); openMapModel(1)}} 
          />
        </Map>
        {(modalIsOpen&&isMap === true) && <MapInfoModal
        index={selectedMapInfo}
        isOpen={modalIsOpen}
        closeModal={closeModal} />}
        <button
          style={{ position: 'absolute', top: '20px', right: '20px'}}
          onClick={() => {
            setCenter([42.12841284953883, -80.08891550873273]);
            setZoom(16);
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

              <div style={{ marginBottom: '10px' }}>
              <p style={{ textDecoration: 'underline' }}>Co-developer</p>
              <p>Quang Phu Ly</p>
            </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ textDecoration: 'underline' }}>Sources</p>
              <p>Dr. David Horne</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ textDecoration: 'underline' }}>Special thanks</p>
              <p>Dr. Kefei Wang</p>
              <p>Nicholas Hubert</p>
              <p>Alia Scotka</p>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ textDecoration: 'underline' }}>Other Contributors</p>
              <p>Matthew Gentry</p>

            </div>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ textDecoration: 'underline' }}>Sponsors</p>
              <p>Computer & Information Science department</p>
              <p>Gannon Bookstore</p>
            </div>
          </div>

        <button style={{marginBottom:30}}className='SignOutButton' onClick={handleSignOut}> Sign Out</button>
      </div>
    </div>
  );
};

export default Information;
