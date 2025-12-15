import React from 'react';
import { motion } from 'framer-motion';

const FloatingAvatar = ({ image, name, x, y, size = 100, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0]
      }}
      whileHover={{ scale: 1.2, zIndex: 50, filter: 'brightness(1.2)' }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        y: {
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          delay: delay
        },
        rotate: {
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
          delay: delay + 1
        }
      }}
      style={{
        ...styles.container,
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
      }}
    >
      <div style={{ ...styles.avatarWrapper, width: `${size}px`, height: `${size}px` }}>
        <div style={styles.avatarInner}>
          {image ? (
            <img src={image} alt={name} style={styles.image} />
          ) : (
            <div style={styles.placeholder} />
          )}
        </div>
      </div>
      {name && (
        <motion.div
          style={styles.nameContainer}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 100, 255, 0.8)' }}
        >
          <span style={styles.name}>{name}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 5,
    cursor: 'pointer',
  },
  avatarWrapper: {
    borderRadius: '50%',
    boxShadow: '0 0 25px rgba(0, 102, 255, 0.3), inset 0 0 10px rgba(0, 102, 255, 0.2)',
    padding: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(0, 242, 255, 0.3)',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#051020',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid rgba(0,0,0,0.5)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #0066ff, #00f2ff)',
  },
  nameContainer: {
    marginTop: '10px',
    backgroundColor: 'rgba(5, 20, 40, 0.75)',
    padding: '6px 16px',
    borderRadius: '20px',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(0, 242, 255, 0.2)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease',
  },
  name: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#e0faff',
    whiteSpace: 'nowrap',
    letterSpacing: '0.5px',
  },
};

export default FloatingAvatar;
