// Modal.js
import React from 'react';
import Modal from 'react-modal';
import Planets from '../Assets/NASAEclipse.png';
import DiamondRingEffect from '../Assets/DiamondRingEffect.png';
import BaileysBeads from '../Assets/BaileysBeads.png';

const InfoModal = ({ isOpen, closeModal, title, img,content }) => {
  const handleClick = () => {
    // Define the URL based on the image being displayed
    let url;
    if (img === Planets) {
      url = "https://svs.gsfc.nasa.gov/14563";
    } else if (img === DiamondRingEffect) {
      url = "https://www.nasa.gov/image-article/diamond-ring-effect/";
    } else if (img === BaileysBeads) {
      url = "https://science.nasa.gov/resource/baileys-beads/";
    }
    // Open the URL in a new tab
    window.open(url, "_blank", "noopener noreferrer");
  };
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
              <li style={{listStyleType: 'circle', marginTop: '15px', fontSize: 22, color:'white'}}>{data}</li>
              <hr style={{ width: '70%', margin: '5px auto', fontWeight: 'bold' }} />
            </React.Fragment>
          ))}
        </ul>
        {img && (
        <a href={img === Planets ? "https://svs.gsfc.nasa.gov/14563" : (img === DiamondRingEffect ? "https://www.nasa.gov/image-article/diamond-ring-effect/" : "https://science.nasa.gov/resource/baileys-beads/")} target="_blank" rel="noopener noreferrer">
          <img style={{ width: 320 }} src={img} alt="Info" onClick={handleClick} />
        </a>
      )}
        <button onClick={closeModal}>Close</button>
      </Modal>
    );
  };

export default InfoModal;
