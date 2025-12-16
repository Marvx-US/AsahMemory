import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileControls = ({ onJoin }) => {
    const [name, setName] = useState('');
    const [preview, setPreview] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleJoin = () => {
        if (!name.trim()) return;
        onJoin({ name, image: preview });
        setName('');
        setPreview(null);
        setIsFormOpen(false); // Close form after joining
    };

    return (
        <div style={styles.container}>
            <AnimatePresence mode="wait">
                {!isFormOpen ? (
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <motion.button
                            key="join-btn"
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 85, 212, 0.4)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsFormOpen(true)}
                            style={styles.joinButton}
                        >
                            JOIN THE VOID
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <a href="/battle" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 0, 0, 0.4)' }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ ...styles.joinButton, background: 'rgba(255, 0, 0, 0.2)', border: '1px solid rgba(255, 0, 0, 0.4)', color: '#D40000' }}
                                >
                                    ⚔️ BATTLE
                                </motion.button>
                            </a>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        key="form-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        style={styles.card}
                    >
                        <div style={styles.headerRow}>
                            <h3 style={styles.title}>Initialize Profile</h3>
                            <button onClick={() => setIsFormOpen(false)} style={styles.closeBtn}>×</button>
                        </div>

                        {preview && (
                            <div style={styles.previewContainer}>
                                <img src={preview} alt="Preview" style={styles.previewImage} />
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Enter Call sign"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={styles.input}
                            autoFocus
                        />

                        <label style={styles.fileLabel}>
                            {preview ? 'Change Avatar' : 'Upload Avatar'}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={styles.hiddenInput}
                            />
                        </label>

                        <motion.button
                            onClick={handleJoin}
                            whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(0, 242, 255, 0.5)' }}
                            whileTap={{ scale: 0.98 }}
                            style={{ ...styles.button, opacity: name ? 1 : 0.5, pointerEvents: name ? 'auto' : 'none' }}
                        >
                            ENTER THE VOID
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: '28%', // Positioned below the header text
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        pointerEvents: 'auto', // Ensure clicks pass through
    },
    joinButton: {
        padding: '12px 30px',
        borderRadius: '50px',
        background: 'rgba(255, 255, 255, 0.2)', // Glass effect
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        color: '#0055D4',
        fontSize: '1rem',
        fontWeight: '700',
        letterSpacing: '1.5px',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0, 85, 212, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.3s',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(25px)',
        padding: '25px',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 85, 212, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        width: '90%',
        maxWidth: '360px',
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px',
    },
    title: {
        color: '#0055D4',
        fontSize: '1.1rem',
        fontWeight: '800',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        margin: 0,
    },
    closeBtn: {
        background: 'transparent',
        border: 'none',
        fontSize: '1.5rem',
        color: '#0055D4',
        cursor: 'pointer',
        lineHeight: 1,
        padding: '0 5px',
    },
    previewContainer: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        overflow: 'hidden',
        alignSelf: 'center',
        border: '2px solid #0055D4',
        boxShadow: '0 0 15px rgba(0, 85, 212, 0.15)',
        background: '#fff',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid rgba(0, 85, 212, 0.2)',
        background: 'rgba(255, 255, 255, 0.9)',
        color: '#003380',
        fontSize: '1rem',
        outline: 'none',
        textAlign: 'center',
        fontFamily: 'inherit',
        fontWeight: '600',
    },
    fileLabel: {
        display: 'block',
        padding: '10px',
        textAlign: 'center',
        background: 'rgba(0, 85, 212, 0.05)',
        borderRadius: '12px',
        color: '#0055D4',
        cursor: 'pointer',
        fontSize: '0.85rem',
        border: '1px dashed rgba(0, 85, 212, 0.3)',
        fontWeight: '600',
    },
    hiddenInput: {
        display: 'none',
    },
    button: {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(90deg, #0055D4, #0077FF)',
        color: '#fff',
        fontWeight: '700',
        fontSize: '1rem',
        cursor: 'pointer',
        letterSpacing: '1px',
        boxShadow: '0 4px 15px rgba(0, 85, 212, 0.3)',
    },
};

export default ProfileControls;
