'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingAvatar from '../components/FloatingAvatar';
import GachaReveal from '../components/GachaReveal';
import ProfileControls from '../components/ProfileControls';
import BackgroundDecorations from '../components/BackgroundDecorations';
import { supabase, isSupabaseConfigured } from '../lib/supabase'; // Import supabase and helper

export default function Home() {
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [gachaResult, setGachaResult] = useState(null); // New state for overlay
    const constraintsRef = useRef(null);

    // Helper to merge new profiles efficiently with Smart Filtering
    // Defined outside effect to be used by both Polling (fallback) and Realtime
    const handleNewProfiles = (currentProfiles, incomingProfiles) => {
        // 1. Identify truly new items (avoid duplicates by ID)
        const currentIds = new Set(currentProfiles.map(p => p.id));
        const uniqueIncoming = incomingProfiles.filter(p => !currentIds.has(p.id));

        if (uniqueIncoming.length === 0 && incomingProfiles.length > 0) {
            // If incomingProfiles exist but none are unique, it means we're just re-fetching existing data.
            // In this case, we might want to re-apply filtering or just return currentProfiles if no changes.
            // For now, if no new unique items, just return current.
            return currentProfiles;
        }

        // 2. Combine and Filter
        const allProfiles = [...currentProfiles, ...uniqueIncoming];

        // --- SMART FILTERING ---
        const vips = allProfiles.filter(p => p.rarity === 'Legendary' || p.rarity === 'Pink');
        const commons = allProfiles.filter(p => p.rarity !== 'Legendary' && p.rarity !== 'Pink');

        // Sort Normals by ID (newest first)
        commons.sort((a, b) => b.id - a.id);

        const MAX_DISPLAY = 50;
        const slotsLeft = Math.max(0, MAX_DISPLAY - vips.length);
        const visibleCommons = commons.slice(0, slotsLeft);

        const combined = [...vips, ...visibleCommons];

        // 3. Process Floating Params (Preserve existing or generate new)
        return combined.map(newProfile => {
            // If profile already counts as "new schema" (has top/left), use it directly.
            if (newProfile.top && newProfile.left) return newProfile;

            // If it's legacy data (missing top/left), check if we already generated params for it.
            const existing = currentProfiles.find(p => p.id === newProfile.id);
            if (existing && existing.top && existing.left) {
                // Preserve the locally generated params so it doesn't jump
                return {
                    ...newProfile,
                    top: existing.top,
                    left: existing.left,
                    duration: existing.duration,
                    delay: existing.delay
                };
            }

            // If it's legacy and seen for the first time, generate params.
            return { ...newProfile, ...getFloatingParams() };
        });
    };

    useEffect(() => {
        // Initial Fetch
        const fetchExisting = async () => {
            try {
                const response = await fetch('/api/profiles');
                if (response.ok) {
                    const data = await response.json();
                    setProfiles(prev => handleNewProfiles(prev, data));
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchExisting();

        // --- REALTIME SETUP ---
        // Only run if Supabase is configured in the environment
        let realtimeChannel = null;
        let pollingInterval = null;

        if (isSupabaseConfigured()) {
            console.log("🔌 Connecting to Supabase Realtime...");
            realtimeChannel = supabase
                .channel('realtime_profiles')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, (payload) => {
                    const newProfile = payload.new.content; // Extract JSON content
                    // Update state using functional update to access latest state
                    setProfiles(prev => handleNewProfiles(prev, [newProfile]));
                })
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') console.log("✅ Realtime Connected!");
                });
        } else {
            console.log("⚠️ Supabase not configured. Using Polling Fallback.");
            pollingInterval = setInterval(fetchExisting, 5000);
        }

        // Cleanup
        return () => {
            if (realtimeChannel) supabase.removeChannel(realtimeChannel);
            if (pollingInterval) clearInterval(pollingInterval);
        };
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

    const getFloatingParams = () => {
        // Random position between 5% and 90% to keep away from edges
        const top = Math.floor(Math.random() * 85) + 5;
        const left = Math.floor(Math.random() * 85) + 5;

        // Random drift characteristics
        const duration = Math.floor(Math.random() * 15) + 20; // 20-35s duration
        const delay = Math.random() * -20; // Start at random time

        return {
            top: `${top}%`,
            left: `${left}%`,
            duration,
            delay
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

        const params = getFloatingParams();

        // Prepare payload (Client sends RAW name, Server handles cheat codes & title & size)
        const payload = {
            name: data.name,
            image: finalImage,
            ...params,
            // Size is now generated on server
        };

        try {
            // Changed to relative URL for Next.js API Route
            const response = await fetch('/api/profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // With Realtime, we technically don't need to do anything if connected.
                // The INSERT event will trigger and update the state.
                // However, for immediate feedback (optimistic), we can simulate it.
                // BUT, to avoid "double appearance" (optimistic + realtime), it's often safer to just wait for Realtime
                // OR duplicate check handling in handleNewProfiles handles it.

                // Let's rely on handleNewProfiles deduping logic.
                const savedProfile = await response.json();

                // --- TRIGGER GACHA REVEAL ---
                // Instead of silent update, we show the animation first.
                // The realtime update might happen in background, but the user sees the overlay.
                setGachaResult({
                    name: savedProfile.name,
                    title: savedProfile.title,
                    rarity: savedProfile.rarity
                });

                // Add to state is handled by Realtime listener mostly, 
                // but we can call it here locally too safely due to dedup logic
                setProfiles(prev => handleNewProfiles(prev, [savedProfile]));
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
        }
    };

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
            // USER REQUESTED THEME: Warm Cream/Beige
            background: '#FFF8E7',
            // REMOVED global marker font. Now uses 'Outfit' from globals.css by default.
            color: '#333'
        }}>
            {/* GACHA REVEAL OVERLAY */}
            <AnimatePresence>
                {gachaResult && (
                    <GachaReveal
                        {...gachaResult}
                        onComplete={() => setGachaResult(null)}
                    />
                )}
            </AnimatePresence>

            {/* Background Decorations */}
            <div style={{ opacity: 1, position: 'absolute', inset: 0, zIndex: 0 }}>
                <BackgroundDecorations />
            </div>

            {/* Floating Avatars Layer */}
            <div ref={constraintsRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
                <AnimatePresence>
                    {profiles.map((profile) => (
                        <FloatingAvatar
                            key={profile.id}
                            {...profile}
                            dragConstraints={constraintsRef}
                            onClick={() => setSelectedProfile(profile)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Controls Layer */}
            <div style={{ position: 'relative', zIndex: 100, pointerEvents: 'none' }}>
                <ProfileControls onJoin={addProfile} />
            </div>

            {/* Title / Header */}
            <div style={{
                position: 'fixed',
                top: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 40,
                pointerEvents: 'none',
                textAlign: 'center',
                width: '100%'
            }}>
                <motion.h1
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{
                        fontFamily: 'var(--font-permanent-marker)', // ONLY Title gets the marker font
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        color: '#0055D4', // Deep Blue
                        letterSpacing: '2px', // Tighter spacing like marker
                        margin: 0,
                        textShadow: 'rgba(0,0,0,0.1) 5px 5px 0px' // Simple shadow
                    }}
                >
                    ASAH MEMORY 2025
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        fontFamily: "'Outfit', sans-serif", // Explicitly clean font
                        color: '#446688',
                        fontSize: '1rem',
                        marginTop: '15px', // More spacing
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        fontWeight: '700', // Bolder like reference
                        opacity: 0.9
                    }}
                >
                    Connecting Digital Souls in the Void ☁️
                </motion.p>
            </div>
            {/* Profile Detail Modal */}
            <AnimatePresence>
                {selectedProfile && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => setSelectedProfile(null)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(0, 0, 0, 0.4)', // Dimmed backdrop
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 200,
                            cursor: 'pointer'
                        }}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'rgba(255, 255, 255, 0.95)', // White Paper
                                padding: '40px',
                                borderRadius: '30px',
                                // DYNAMIC CARD SHADOW (Outer Glow)
                                boxShadow: rarityColors[selectedProfile.rarity]?.cardShadow || '0 20px 60px rgba(0,0,0,0.1)',
                                maxWidth: '350px',
                                width: '90%',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                color: '#333',
                                border: '1px solid white',
                                position: 'relative', // For particles
                                overflow: 'visible' // Allow avatar glow to bleed out if needed
                            }}
                        >
                            {/* Particles for High Rarity */}
                            {selectedProfile.rarity === 'Legendary' && <Particles color="#FFD700" />}
                            {selectedProfile.rarity === 'Pink' && <Particles color="#FF69B4" />}

                            <img
                                src={selectedProfile.image}
                                alt={selectedProfile.name}
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    marginBottom: '20px',
                                    objectFit: 'cover',
                                    border: `3px solid ${rarityColors[selectedProfile.rarity]?.text || '#ccc'}`,
                                    // DYNAMIC AVATAR SHADOW (GLOW)
                                    boxShadow: rarityColors[selectedProfile.rarity]?.shadow || '0 10px 30px rgba(0,0,0,0.1)',
                                    zIndex: 2,
                                    background: '#fff'
                                }}
                            />
                            <h2 style={{
                                margin: 0,
                                color: '#0055D4',
                                fontSize: '2rem',
                                fontFamily: "'Outfit', sans-serif", // Clean font for name
                                fontWeight: '800', // Extra bold
                                letterSpacing: '-1px',
                                zIndex: 2
                            }}>{selectedProfile.name}</h2>
                            {selectedProfile.title && (
                                <div style={{
                                    marginTop: '15px',
                                    padding: '6px 18px',
                                    borderRadius: '20px',
                                    background: rarityColors[selectedProfile.rarity]?.bg || '#f0f0f0',
                                    color: rarityColors[selectedProfile.rarity]?.text || '#333',
                                    border: `1px solid ${rarityColors[selectedProfile.rarity]?.border || '#ccc'}`,
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    letterSpacing: '1px',
                                    boxShadow: selectedProfile.rarity === 'Legendary' ? '0 0 15px #FFD700' : 'none',
                                    zIndex: 2
                                }}>
                                    {selectedProfile.title}
                                </div>
                            )}
                            <p style={{ marginTop: '25px', color: '#666', fontSize: '0.8rem', opacity: 0.8, letterSpacing: '0.5px', zIndex: 2 }}>
                                "FLOATING IN THE VOID"
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const rarityColors = {
    Common: { bg: '#fff', text: '#555', border: '#ddd', shadow: '0 10px 30px rgba(0,0,0,0.1)', cardShadow: '0 20px 60px rgba(0,0,0,0.1)' },
    Rare: { bg: '#e6f7ff', text: '#0055D4', border: '#91d5ff', shadow: '0 10px 30px rgba(0, 85, 212, 0.3)', cardShadow: '0 20px 60px rgba(0, 85, 212, 0.2)' },
    Epic: { bg: '#f9f0ff', text: '#722ed1', border: '#d3adf7', shadow: '0 10px 30px rgba(114, 46, 209, 0.4)', cardShadow: '0 20px 60px rgba(114, 46, 209, 0.25)' },
    Legendary: { bg: 'linear-gradient(45deg, #850000, #ff0000)', text: '#FFD700', border: '#FFD700', shadow: '0 0 30px #FF0000, 0 0 60px #FFD700', cardShadow: '0 0 60px rgba(255, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)' },
    Pink: { bg: '#FFF0F5', text: '#FF1493', border: '#FF69B4', shadow: '0 0 50px #FF1493, 0 0 20px #FF69B4', cardShadow: '0 0 60px rgba(255, 105, 180, 0.5)' },
};

// Reused Particle Effect
const Particles = ({ color }) => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        background: color,
                        borderRadius: '50%',
                        left: '50%',
                        top: '50%'
                    }}
                    animate={{
                        x: (Math.random() - 0.5) * 400,
                        y: (Math.random() - 0.5) * 400,
                        opacity: [1, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 1
                    }}
                />
            ))}
        </div>
    )
}
