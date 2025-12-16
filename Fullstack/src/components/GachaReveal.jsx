import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GachaReveal = ({ rarity, title, name, onComplete }) => {
    const [phase, setPhase] = useState('charging'); // charging -> explode -> reveal

    useEffect(() => {
        // Timeline
        const timer1 = setTimeout(() => setPhase('explode'), 2000); // 2s charge
        const timer2 = setTimeout(() => onComplete(), 5500); // End after 5.5s

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onComplete]);

    const isLegendary = rarity === 'Legendary';
    const isPink = rarity === 'Pink';
    const isRare = rarity === 'Rare' || rarity === 'Epic';

    // Rarity Colors
    const colors = {
        Common: '#A0A0A0',
        Rare: '#0055D4',
        Epic: '#722ed1',
        Legendary: '#FF0000',
        Pink: '#FF69B4'
    };

    const mainColor = colors[rarity] || colors.Common;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.9)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontFamily: 'var(--font-permanent-marker)',
            }}
        >
            <AnimatePresence>
                {/* PHASE 1: CHARGING ORB */}
                {phase === 'charging' && (
                    <motion.div
                        key="orb"
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, #fff, ${mainColor})`,
                            boxShadow: `0 0 20px ${mainColor}, 0 0 50px ${mainColor}`,
                        }}
                        animate={{
                            scale: [1, 1.2, 1, 1.5, 0.5], // Pulse then shrink before explode
                            rotate: [0, 10, -10, 20, -20, 0], // Shake
                            filter: ['brightness(1)', 'brightness(2)'],
                        }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                )}

                {/* PHASE 2: EXPLOSION & REVEAL */}
                {phase === 'explode' && (
                    <motion.div
                        key="content"
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        {/* Rarity Text */}
                        <motion.h2
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                fontSize: '2rem',
                                color: mainColor,
                                textTransform: 'uppercase',
                                letterSpacing: '0.2em',
                                filter: `drop-shadow(0 0 10px ${mainColor})`
                            }}
                        >
                            {rarity}
                        </motion.h2>

                        {/* Main Title */}
                        <motion.h1
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            style={{
                                fontSize: '4rem',
                                margin: '20px 0',
                                textAlign: 'center',
                                background: `-webkit-linear-gradient(${isLegendary ? '45deg, #FFD700, #FF0000' : isPink ? '45deg, #FF69B4, #FFF' : '#fff, #ccc'})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.8 }}
                            transition={{ delay: 1 }}
                            style={{ fontSize: '1.2rem', marginTop: '1rem' }}
                        >
                            {name}
                        </motion.p>

                        {/* Particles for High Rarity */}
                        {(isLegendary || isPink) && (
                            <Particles color={mainColor} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Lightweight particle effect
const Particles = ({ color }) => {
    return (
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: 10,
                        height: 10,
                        background: color,
                        borderRadius: '50%',
                    }}
                    animate={{
                        x: (Math.random() - 0.5) * 600,
                        y: (Math.random() - 0.5) * 600,
                        opacity: [1, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 0.5
                    }}
                />
            ))}
        </div>
    )
}

export default GachaReveal;
