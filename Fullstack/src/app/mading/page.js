'use client';

import React from 'react';
import MadingBoard from '../../components/MadingBoard';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BackgroundDecorations from '../../components/BackgroundDecorations';

// RANSOM NOTE ASSETS
const BG_COLORS = ['#FF4136', '#0074D9', '#FFDC00', '#2ECC40', '#111111', '#AAAAAA', '#FFFFFF'];
const TEXT_COLORS = ['#FFFFFF', '#FFFFFF', '#111111', '#FFFFFF', '#FFFFFF', '#111111', '#111111'];
const FONTS = ['"Courier New", monospace', 'Arial, sans-serif', '"Times New Roman", serif', '"Verdana", sans-serif', 'Impact, sans-serif'];

const RansomTitle = ({ text }) => {
    const [letterStyles, setLetterStyles] = React.useState([]);

    React.useEffect(() => {
        // Generate random styles only on client-side
        const styles = text.split('').map(() => ({
            rotation: Math.random() * 20 - 10,
            colorIdx: Math.floor(Math.random() * BG_COLORS.length),
            fontIdx: Math.floor(Math.random() * FONTS.length),
            size: 4 + Math.random() * 1.5 // Increased size as requested
        }));
        setLetterStyles(styles);
    }, [text]);

    // Prevent hydration mismatch by not rendering decoration until mounted
    if (letterStyles.length === 0) {
        return <div style={{ opacity: 0 }}>{text}</div>;
    }

    return (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {text.split('').map((char, i) => {
                const style = letterStyles[i] || {}; // Fallback

                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -50, rotate: 0 }}
                        animate={{ opacity: 1, y: 0, rotate: style.rotation }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        whileHover={{ scale: 1.2, rotate: 0, zIndex: 10 }}
                        style={{
                            background: BG_COLORS[style.colorIdx],
                            color: TEXT_COLORS[style.colorIdx],
                            fontFamily: FONTS[style.fontIdx],
                            fontSize: `${style.size}rem`,
                            fontWeight: 'bold',
                            padding: '5px 10px',
                            boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
                            transform: `rotate(${style.rotation}deg)`,
                            border: '1px solid rgba(0,0,0,0.1)'
                        }}
                    >
                        {char}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default function MadingPage() {
    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw', // Force full width to cover body background
            background: '#FFF8E7', // Warm Cream
            position: 'relative',
            overflowX: 'hidden'
        }}>
            {/* Reuse Background Decorations for consistency */}
            <div style={{ position: 'fixed', inset: 0, opacity: 0.5, pointerEvents: 'none' }}>
                <BackgroundDecorations />
            </div>

            {/* Header */}
            <header style={{
                padding: '40px 20px 20px',
                textAlign: 'center',
                position: 'relative',
                zIndex: 10
            }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <motion.div
                        whileHover={{ x: -5 }}
                        style={{
                            position: 'absolute',
                            left: '20px',
                            top: '40px',
                            color: '#0055D4',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        ⬅ Kembali
                    </motion.div>
                </Link>

                {/* RANSOM NOTE TITLE */}
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <RansomTitle text="MADING" />
                    <div style={{ width: '20px' }}></div> {/* Spacer */}
                    <RansomTitle text="ASAH" />
                </div>

                <div style={{
                    width: '100px',
                    height: '4px',
                    background: '#0055D4',
                    margin: '20px auto',
                    borderRadius: '2px'
                }} />
            </header>

            {/* Board */}
            <main>
                <MadingBoard />
            </main>
        </div>
    );
}
