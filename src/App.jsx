import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FloatingAvatar from './components/FloatingAvatar';
import ProfileControls from './components/ProfileControls';
import './App.css';

function App() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('asah_memory_profiles');
    if (saved) {
      try {
        setProfiles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('asah_memory_profiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  const addProfile = (data) => {
    const newProfile = {
      id: Date.now(),
      name: data.name,
      image: data.image,
      x: Math.floor(Math.random() * 80) + 5,
      y: Math.floor(Math.random() * 60) + 10,
      size: Math.floor(Math.random() * 40) + 80,
      delay: Math.random() * 5,
    };
    setProfiles([...profiles, newProfile]);
  };

  const titleText = "ASAH  MEMORY  2025".split("");

  return (
    <div className="app-container">
      <div style={styles.backgroundGlow} />
      <div style={styles.scanline} />

      <header style={styles.header}>
        <h1 style={styles.title}>
          {titleText.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              style={{ display: 'inline-block', marginRight: char === " " ? '10px' : '0' }}
            >
              {char}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 2, duration: 1 }}
          style={styles.subtitle}
        >
          Connecting Digital Souls in the Void
        </motion.p>
      </header>

      <div style={styles.floatingSpace}>
        {profiles.map((profile) => (
          <FloatingAvatar
            key={profile.id}
            {...profile}
          />
        ))}
      </div>

      <ProfileControls onJoin={addProfile} />
    </div>
  );
}

const styles = {
  backgroundGlow: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    background: 'radial-gradient(circle at 50% 10%, rgba(0, 102, 255, 0.15) 0%, rgba(3, 11, 20, 1) 70%)',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  scanline: {
    background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
    backgroundSize: '100% 4px',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 2,
    opacity: 0.3,
  },
  header: {
    position: 'fixed',
    top: '4rem',
    left: 0,
    width: '100%',
    textAlign: 'center',
    zIndex: 20,
    pointerEvents: 'none',
    textShadow: '0 0 10px rgba(0, 242, 255, 0.5)',
  },
  title: {
    fontSize: '4rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '2px',
    margin: 0,
  },
  subtitle: {
    color: '#00f2ff',
    marginTop: '0.8rem',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    fontSize: '1rem',
    textShadow: '0 0 10px rgba(0, 242, 255, 0.5)',
  },
  floatingSpace: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
  }
}

export default App;
