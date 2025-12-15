import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FloatingAvatar from './components/FloatingAvatar';
import ProfileControls from './components/ProfileControls';
import BackgroundDecorations from './components/BackgroundDecorations';
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

  // Helper to compress image
  const compressImage = (base64Str, maxWidth = 150, maxHeight = 150) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const getOrbitalParams = (index) => {
    // Distribute into 4 rings based on index for handling 50+ avatars
    const ring = index % 4;
    let minR, maxR;

    // Percentages of viewport
    switch (ring) {
      case 0: minR = 22; maxR = 28; break; // Inner Ring
      case 1: minR = 30; maxR = 36; break; // Mid Ring 1
      case 2: minR = 38; maxR = 42; break; // Mid Ring 2
      case 3: minR = 44; maxR = 48; break; // Outer Ring
      default: minR = 30; maxR = 40;
    }

    return {
      radiusX: Math.floor(Math.random() * (maxR - minR)) + minR,
      radiusY: Math.floor(Math.random() * (maxR - minR)) + minR,
      startAngle: Math.floor(Math.random() * 360),
      duration: Math.floor(Math.random() * 20) + 20 + (ring * 5), // Outer rings move slightly slower
      direction: ring % 2 === 0 ? 1 : -1, // Alternating directions for visual interest
    };
  };

  const addProfile = async (data) => {
    // Compress image if it exists
    let finalImage = data.image;
    if (data.image) {
      try {
        finalImage = await compressImage(data.image);
      } catch (e) {
        console.error("Compression failed", e);
      }
    }

    const params = getOrbitalParams(profiles.length);
    const newProfile = {
      id: Date.now(),
      name: data.name,
      image: finalImage,
      ...params,
      // Responsive size: base clamp * random scale factor
      size: `calc(clamp(50px, 12vw, 90px) * ${(0.8 + Math.random() * 0.4).toFixed(2)})`,
    };
    setProfiles([...profiles, newProfile]);
  };

  const titleText = "ASAH  MEMORY  2025".split("");

  return (
    <div className="app-container">
      <div style={styles.backgroundGlow} />
      <div style={styles.scanline} />
      <BackgroundDecorations />

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
    background: '#FFF8E7',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  scanline: {
    display: 'none', // Removed for cleaner look
  },
  header: {
    position: 'fixed',
    top: '4rem',
    left: 0,
    width: '100%',
    textAlign: 'center',
    zIndex: 20,
    pointerEvents: 'none',
  },
  title: {
    fontSize: 'clamp(2.5rem, 8vw, 5rem)',
    fontWeight: '800',
    color: '#0055D4',
    letterSpacing: '2px',
    margin: 0,
    fontFamily: '"Outfit", sans-serif',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  subtitle: {
    color: '#0044AA',
    marginTop: '0.8rem',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    fontSize: 'clamp(0.75rem, 3vw, 1rem)',
    fontWeight: '600',
    padding: '0 10px',
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
