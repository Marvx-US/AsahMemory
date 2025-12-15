import React from 'react';
import { motion } from 'framer-motion';

const BackgroundDecorations = () => {
    return (
        <div style={styles.container}>
            {/* Paper Plane */}
            <motion.div
                initial={{ x: '-10vw', y: '20vh', rotate: 10, opacity: 0 }}
                animate={{
                    x: '110vw',
                    y: ['20vh', '15vh', '25vh', '20vh'],
                    rotate: [10, 5, 15, 10],
                    opacity: 1
                }}
                transition={{
                    x: { duration: 25, repeat: Infinity, ease: "linear" },
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 1, delay: 0.5 }
                }}
                style={{ position: 'absolute', width: '150px', zIndex: 1 }}
            >
                <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Plane Body */}
                    <path d="M160 40 L40 10 L60 50 L160 40 Z" fill="none" stroke="#0055D4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M40 10 L60 50 L50 60 L40 10 Z" fill="none" stroke="#0055D4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M60 50 L160 40" fill="none" stroke="#0055D4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Trails - Orange/Red */}
                    <path d="M30 15 C 20 20, 10 25, 0 30" stroke="#FF6B00" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
                    <path d="M35 30 C 25 35, 15 40, 5 45" stroke="#FF6B00" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
                    <path d="M40 45 C 30 50, 20 55, 10 60" stroke="#FF6B00" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
                </svg>
            </motion.div>

            {/* Sky Flower 1 */}
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', top: '15%', left: '10%', width: '100px', zIndex: 1, opacity: 0.6 }}
            >
                <SkyFlower color="#0055D4" />
            </motion.div>

            {/* Sky Flower 2 */}
            <motion.div
                initial={{ rotate: 45 }}
                animate={{ rotate: -315 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', bottom: '20%', right: '10%', width: '80px', zIndex: 1, opacity: 0.5 }}
            >
                <SkyFlower color="#FF6B00" />
            </motion.div>

            {/* Sparkles */}
            <Star x="80%" y="15%" delay={0} color="#0055D4" />
            <Star x="20%" y="80%" delay={2} color="#0055D4" />
        </div>
    );
};

// Flower Component (SpongeBob style)
const SkyFlower = ({ color }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Petals */}
        <path d="M50 20 C 60 5, 75 20, 65 35" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M80 50 C 95 60, 80 75, 65 65" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M50 80 C 40 95, 25 80, 35 65" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M20 50 C 5 40, 20 25, 35 35" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M35 35 C 30 20, 45 15, 52 25" stroke={color} strokeWidth="3" strokeLinecap="round" strokeOpacity="0" />

        {/* Simple Flower Shape */}
        <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="3" />
        <path d="M50 40 Q 60 20 70 40 T 90 50 T 70 60 T 50 80 T 30 60 T 10 50 T 30 40 Z" fill="none" stroke={color} strokeWidth="3" />
    </svg>
);

const Star = ({ x, y, delay, color }) => (
    <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, delay: delay }}
        style={{ position: 'absolute', left: x, top: y, width: '30px', zIndex: 1 }}
    >
        <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" fill={color} />
        </svg>
    </motion.div>
);

const styles = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1, // Behind content but in front of background color
        overflow: 'hidden',
    }
};

export default BackgroundDecorations;
