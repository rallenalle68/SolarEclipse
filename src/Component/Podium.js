import { motion } from 'framer-motion'
import copper from '../Assets/cooper.png';
import silver from '../Assets/silver.png';
import gold from '../Assets/gold.png'

export default function Podium({ podium, winner, index }) {
    const medal = [gold, silver, copper];
    const backgroundColors = ['#ffd700', '#c0c0c0', '#b87333']; // Gold, Silver, Copper

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div
                custom={index}
                initial="hidden"
                animate="visible"
                variants={{
                visible: () => ({
                    height: 200 * ((podium.length - index) / podium.length),
                    opacity: 2,
                    transition: {
                    delay: (podium.length - index)-1,
                    duration: 0.75,
                    ease: 'backInOut'
                    }
                }),
                hidden: { opacity: 0, height: 0 }
                }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '5rem', // Adjust width as needed
                    border: '1px solid black', // Adjust border color as needed
                    borderBottom: 0,
                    borderRadius: '0.5rem 0.5rem 0 0', // Adjust border radius as needed
                    boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)', // Adjust shadow as needed
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: backgroundColors[index], // Set background color based on index
                  }}
            >
                <img src={medal[index]} alt='' style={{ marginBottom: '0.5rem' }} /> {/* Move medal image to top */}
                <p style={{ color: "#FFF", fontWeight: "bold", alignSelf: "center", marginTop: 'auto' }}>
                    {winner.username}
                </p>
            </motion.div>
        </div>
    )
}
