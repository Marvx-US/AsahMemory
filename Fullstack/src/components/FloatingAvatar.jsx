import React from 'react';
import { motion } from 'framer-motion';

const FloatingAvatar = ({ image, name, title, rarity, top, left, duration, delay, size = 100, onClick, dragConstraints }) => {
  // Generate random drift range for unique movement per avatar
  const driftX = React.useMemo(() => [0, 30 + Math.random() * 20, 0, -30 - Math.random() * 20, 0], []);
  const driftY = React.useMemo(() => [0, -30 - Math.random() * 20, 0, 30 + Math.random() * 20, 0], []);

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      dragMomentum={true}
      dragElastic={0.2}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0, top, left }}
      animate={{
        opacity: 1,
        scale: 1,
        x: driftX, // Float horizontally
        y: driftY, // Float vertically
        rotate: [0, 5, -5, 0] // Gentle rotation
      }}
      whileHover={{ scale: 1.2, zIndex: 50, filter: 'brightness(1.1)', cursor: 'grab' }}
      whileTap={{ cursor: 'grabbing', scale: 1.1 }}
      transition={{
        opacity: { duration: 1 },
        scale: { duration: 1 },
        x: {
          duration: duration,
          ease: "easeInOut",
          repeat: Infinity,
          delay: delay
        },
        y: {
          duration: duration * 1.2, // Different timing for XY to look natural
          ease: "easeInOut",
          repeat: Infinity,
          delay: delay
        },
        rotate: {
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
        }
      }}
      style={{
        ...styles.container,
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }}
    >
      {/* Scribble Effect on Hover */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '150%', height: '150%', pointerEvents: 'none', zIndex: -1, opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s' }}>
        <Scribble />
      </div>

      {/* Legendary Aura (Red Scribble Rotating) */}
      {rarity === 'Legendary' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '180%', // Slightly larger to clear avatar
            height: '180%',
            zIndex: -1,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            style={{ width: '100%', height: '100%' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          >
            <Scribble color="#FF0000" opacity={0.8} />
          </motion.div>
        </div>
      )}

      {/* Pink Aura (Pink Scribble Rotating) */}
      {rarity === 'Pink' && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '180%',
            height: '180%',
            zIndex: -1,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            style={{ width: '100%', height: '100%' }}
            animate={{ rotate: -360 }} // Rotate opposite for variety
            transition={{ duration: 12, ease: "linear", repeat: Infinity }}
          >
            <Scribble color="#FF69B4" opacity={0.7} />
          </motion.div>
        </div>
      )}

      <div style={{
        ...styles.avatarWrapper,
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size
      }}>
        <div style={styles.avatarInner}>
          {image ? (
            <img src={image} alt={name} style={styles.image} />
          ) : (
            <div style={styles.placeholder} />
          )}
        </div>
      </div>

      {
        name && (
          <motion.div
            style={styles.nameContainer}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 1)' }}
          >
            <span style={styles.name}>{name}</span>
            {title && (
              <div style={{
                ...styles.badge,
                background: rarityColors[rarity]?.bg || '#eee',
                color: rarityColors[rarity]?.text || '#333',
                border: `1px solid ${rarityColors[rarity]?.border || '#ccc'}`,
                boxShadow: rarity === 'Legendary' ? '0 0 15px #FF0000' : rarity === 'Pink' ? '0 0 15px #FF69B4' : 'none',
                whiteSpace: 'nowrap', // Prevent wrapping
              }}>
                {title}
              </div>
            )}
          </motion.div>
        )
      }
    </motion.div >
  );
};

const rarityColors = {
  Common: { bg: '#f0f0f0', text: '#666', border: '#ddd' },
  Rare: { bg: '#e6f7ff', text: '#0055D4', border: '#91d5ff' },
  Epic: { bg: '#f9f0ff', text: '#722ed1', border: '#d3adf7' },
  Legendary: { bg: '#330000', text: '#FF0000', border: '#FF0000' }, // Darker BG
  Pink: { bg: '#FFF0F5', text: '#FF1493', border: '#FF69B4' },
};

const Scribble = ({ color = "#0055D4", opacity = 0.6 }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <motion.path
      d="M45.5 98.5C45.5 98.5 25.5 68.5 56.5 49.5C87.5 30.5 130.5 34.5 149.5 59.5C168.5 84.5 158.5 131.5 125.5 152.5C92.5 173.5 45.4999 158.5 35.5 128.5C25.5 98.5 53.5 58.5 91.5 52.5C129.5 46.5 171.5 73.5 178.5 120.5"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: opacity }}
      transition={{ duration: 0.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 0.5 }}
    />
    <motion.path
      d="M30 100 C 30 100, 50 10, 150 50 C 150 50, 200 150, 100 180 C 100 180, 10 150, 30 100"
      stroke={color === "#0055D4" ? "#00F2FF" : "#FF6B6B"} // Secondary color automatic
      strokeWidth="5" // Thinner secondary line
      strokeLinecap="round"
      style={{ opacity: 0.4 }}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.7, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
    />
  </svg>
);

const styles = {
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 5,
    cursor: 'pointer',
    pointerEvents: 'auto', // Important for drag
  },
  avatarWrapper: {
    borderRadius: '50%',
    boxShadow: '0 5px 15px rgba(0, 85, 212, 0.15)',
    padding: '4px',
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(0, 85, 212, 0.2)',
    aspectRatio: '1 / 1',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid rgba(0, 85, 212, 0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #E0F0FF, #FFFFFF)',
  },
  nameContainer: {
    marginTop: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '6px 16px',
    borderRadius: '20px',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(0, 85, 212, 0.1)',
    boxShadow: '0 4px 10px rgba(0, 85, 212, 0.1)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  name: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#003380',
    whiteSpace: 'nowrap',
    letterSpacing: '0.5px',
  },
  badge: {
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '2px',
  },
};

export default FloatingAvatar;
