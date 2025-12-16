import React from 'react';
import { motion } from 'framer-motion';

const FloatingAvatar = ({ image, name, radiusX, radiusY, startAngle, duration, direction, size = 100, onClick }) => {
  // Calculate orbit path
  const orbit = React.useMemo(() => {
    const keyframes = { left: [], top: [] };
    const steps = 60; // Number of frames for smoothness

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      // Calculate angle: start + full rotation * direction * progress
      const currentAngle = startAngle + (360 * direction * progress);
      const rad = (currentAngle * Math.PI) / 180;

      // Calculate position percentage (Center is 50%, 50%)
      // x = 50 + rX * cos(theta)
      // y = 50 + rY * sin(theta)
      const x = 50 + radiusX * Math.cos(rad);
      const y = 50 + radiusY * Math.sin(rad);

      keyframes.left.push(`${x}%`);
      keyframes.top.push(`${y}%`);
    }
    return keyframes;
  }, [radiusX, radiusY, startAngle, direction]);

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        left: orbit.left,
        top: orbit.top,
        rotate: [0, 5, -5, 0] // Gentle rotation
      }}
      whileHover={{ scale: 1.2, zIndex: 50, filter: 'brightness(1.1)' }}
      transition={{
        opacity: { duration: 1 },
        scale: { duration: 1 },
        left: {
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        },
        top: {
          duration: duration,
          ease: "linear",
          repeat: Infinity,
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
          </motion.div>
        )
      }
    </motion.div >
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
    pointerEvents: 'auto',
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
  },
  name: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#003380',
    whiteSpace: 'nowrap',
    letterSpacing: '0.5px',
  },
};

export default FloatingAvatar;
