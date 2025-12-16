'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FloatingAvatar from '../components/FloatingAvatar';
import ProfileControls from '../components/ProfileControls';
import BackgroundDecorations from '../components/BackgroundDecorations';

export default function Home() {
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const constraintsRef = useRef(null);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                // Changed to relative URL for Next.js API Route
                const response = await fetch('/api/profiles');
                if (response.ok) {
                    const data = await response.json();
                    // Server handles filtering now (Resets at 01:00 WIB)
                    setProfiles(data);
                }
            } catch (error) {
                console.error("Failed to fetch profiles:", error);
            }
        };

        fetchProfiles();

        // Poll for updates every 5 seconds
        const interval = setInterval(fetchProfiles, 5000);
        return () => clearInterval(interval);
    }, []);

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

    const generateGachaTitle = () => {
        const rand = Math.random() * 100;
        let tier, titles;

        if (rand < 60) {
            tier = 'Common';
            titles = ["Kerja Tanpa Riuh", "Cadangan Tim", "Anak Baik"];
        } else if (rand < 90) {
            tier = 'Rare';
            titles = ["Penambal Lubang", "Pemadam Deadline", "Pekerja Bayangan"];
        } else if (rand < 99) {
            tier = 'Epic';
            titles = ["Satu Orang Banyak Peran", "Tim = Aku", "Fullstack Dipaksa"];
        } else {
            tier = 'Legendary';
            titles = ["Tiang Penyangga Kelompok", "Sendirian Tapi Lulus", "Penggendong Handal"];
        }

        return {
            title: titles[Math.floor(Math.random() * titles.length)],
            rarity: tier
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
        const { title, rarity } = generateGachaTitle();

        const newProfile = {
            id: Date.now(),
            name: data.name,
            image: finalImage,
            title,
            rarity,
            ...params,
            // Responsive size: base clamp * random scale factor
            size: `calc(clamp(50px, 12vw, 90px) * ${(0.8 + Math.random() * 0.4).toFixed(2)})`,
        };

        try {
            // Changed to relative URL for Next.js API Route
            await fetch('/api/profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProfile),
            });
            // Optimistic update
            setProfiles([...profiles, newProfile]);
        } catch (error) {
            console.error("Failed to save profile:", error);
        }
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

            <div style={styles.floatingSpace} ref={constraintsRef}>
                {profiles.map((profile) => (
                    <FloatingAvatar
                        key={profile.id}
                        {...profile}
                        onClick={() => setSelectedProfile(profile)}
                        dragConstraints={constraintsRef}
                    />
                ))}
            </div>

            <ProfileControls onJoin={addProfile} />

            {/* Profile Detail Modal */}
            <motion.div
                initial={false}
                animate={selectedProfile ? { opacity: 1, pointerEvents: 'auto' } : { opacity: 0, pointerEvents: 'none' }}
                style={styles.modalOverlay}
                onClick={() => setSelectedProfile(null)}
            >
                {selectedProfile && (
                    <motion.div
                        layoutId={`avatar-${selectedProfile.id}`}
                        style={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <div style={styles.modalImageWrapper}>
                            {selectedProfile.image ? (
                                <img src={selectedProfile.image} alt={selectedProfile.name} style={styles.modalImage} />
                            ) : (
                                <div style={styles.placeholder} />
                            )}
                        </div>
                        <h2 style={styles.modalName}>{selectedProfile.name}</h2>
                        <p style={{ color: '#003380', fontSize: '1rem', fontWeight: '500', opacity: 0.8 }}>Exploring the Void</p>
                        <button style={styles.closeButton} onClick={() => setSelectedProfile(null)}>Close</button>
                    </motion.div>
                )}
            </motion.div>
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
        fontFamily: 'var(--font-permanent-marker), "Outfit", sans-serif',
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
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 20px 50px rgba(0, 85, 212, 0.15)',
        textAlign: 'center',
        maxWidth: '90%',
        width: '400px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    modalImageWrapper: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid #0055D4',
        boxShadow: '0 0 20px rgba(0, 85, 212, 0.2)',
        marginBottom: '20px',
        background: '#fff',
    },
    modalImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    modalName: {
        fontSize: '2rem',
        color: '#0055D4',
        margin: '10px 0 5px 0',
        fontFamily: '"Outfit", sans-serif',
        fontWeight: '700',
        letterSpacing: '1px',
    },
    closeButton: {
        marginTop: '30px',
        padding: '12px 30px',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(90deg, #0055D4, #0077FF)',
        color: '#fff',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'background 0.3s',
        boxShadow: '0 4px 15px rgba(0, 85, 212, 0.3)',
        letterSpacing: '1px',
    }
}
