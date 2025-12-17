import React from 'react';
import { motion } from 'framer-motion';

const MadingPost = ({ name, message, image, rotation, tapeVariant, createdAt, isExpanded = false }) => {
    // Tape variant 1: Top Center
    // Tape variant 2: Top Corners
    // Tape variant 3: Messy

    // More extreme rotation for messy look
    const displayRotation = isExpanded ? 0 : rotation;

    return (
        <motion.div
            initial={isExpanded ? { opacity: 0, scale: 0.9 } : { opacity: 0, scale: 0.8, rotate: rotation }}
            animate={{ opacity: 1, scale: 1, rotate: displayRotation }}
            whileHover={isExpanded ? {} : { scale: 1.08, zIndex: 10, rotate: 0, y: -5 }}
            style={{
                backgroundColor: '#fff',
                padding: '15px 15px 25px 15px', // More padding at bottom for text
                boxShadow: isExpanded ? '0 20px 50px rgba(0,0,0,0.5)' : '3px 6px 12px rgba(0,0,0,0.3)', // Stronger shadow
                transform: `rotate(${displayRotation}deg)`,
                width: '100%',
                maxWidth: isExpanded ? '90vw' : '100%', // Responsive max width
                position: 'relative',
                display: 'inline-block',
                margin: isExpanded ? '0' : '10px',
                fontFamily: "'Courier New', Courier, monospace", // Typewriter feel
                cursor: isExpanded ? 'default' : 'pointer', // Pointer when clickable
                border: '1px solid #e5e5e5',
            }}
            className="mading-post"
        >
            <style jsx>{`
                @media (max-width: 640px) {
                    .mading-post {
                        max-width: ${isExpanded ? '95vw' : '100%'} !important;
                        padding: 12px 12px 20px 12px !important;
                    }
                }
            `}</style>
            {/* TAPE VISUALS - MASKING TAPE STYLE (High Contrast) */}
            {/* Variant 1: Top Center (Standard) */}
            {(tapeVariant === 1 || !tapeVariant) && (
                <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(-2deg)',
                    width: '70px',
                    height: '25px',
                    background: 'rgba(235, 220, 190, 0.9)', // Masking Tape Beige
                    border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 2,
                    opacity: 0.95
                }} />
            )}

            {/* Variant 2: Top Left Corner */}
            {tapeVariant === 2 && (
                <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '-15px',
                    transform: 'rotate(-45deg)',
                    width: '60px',
                    height: '22px',
                    background: 'rgba(235, 220, 190, 0.9)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 2,
                    opacity: 0.95
                }} />
            )}

            {/* Variant 3: Double Tape (Top Corners) */}
            {tapeVariant === 3 && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '-10px',
                        transform: 'rotate(-40deg)',
                        width: '50px',
                        height: '20px',
                        background: 'rgba(235, 220, 190, 0.9)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        zIndex: 2,
                        opacity: 0.95
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-10px',
                        transform: 'rotate(40deg)',
                        width: '50px',
                        height: '20px',
                        background: 'rgba(235, 220, 190, 0.9)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        zIndex: 2,
                        opacity: 0.95
                    }} />
                </>
            )}

            {/* IMAGE AREA */}
            <div style={{
                width: '100%',
                aspectRatio: '1/1',
                backgroundColor: '#333',
                overflow: 'hidden',
                marginBottom: '15px',
                border: '1px solid #ddd'
            }}>
                {image ? (
                    <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Photo</div>
                )}
            </div>

            {/* MESSAGE AREA */}
            <div style={{ textAlign: 'center' }}>
                <p style={{
                    fontFamily: "'Outfit', sans-serif", // Clean readable font
                    fontWeight: 500,
                    fontSize: '1rem', // Slightly larger
                    color: '#0044aa', // Slightly darker blue for contrast
                    marginBottom: '5px',
                    width: '100%',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    lineHeight: '1.5',
                    // Truncate text if not expanded (Limit to 3 lines)
                    display: isExpanded ? 'block' : '-webkit-box',
                    WebkitLineClamp: isExpanded ? 'none' : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    height: isExpanded ? 'auto' : '4.5rem' // Fixed height for alignment
                }}>
                    {message}
                </p>
                <div style={{
                    fontSize: '0.7rem',
                    color: '#888',
                    marginTop: '10px',
                    borderTop: '1px solid #eee',
                    paddingTop: '5px',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <span style={{ fontWeight: 'bold' }}>- {name}</span>
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default MadingPost;
