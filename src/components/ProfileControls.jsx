import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProfileControls = ({ onJoin }) => {
    const [name, setName] = useState('');
    const [preview, setPreview] = useState(null);

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
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.wrapper}
        >
            <div style={styles.card}>
                <h3 style={styles.title}>Initialize Profile</h3>

                {preview && (
                    <div style={styles.previewContainer}>
                        <img src={preview} alt="Preview" style={styles.previewImage} />
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Enter Callsign"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
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
            </div>
        </motion.div>
    );
};

const styles = {
    wrapper: {
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: '90%',
        maxWidth: '380px',
    },
    card: {
        background: 'rgba(5, 20, 40, 0.7)',
        backdropFilter: 'blur(16px)',
        padding: '30px',
        borderRadius: '24px',
        boxShadow: '0 10px 40px rgba(0, 102, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1px solid rgba(100, 200, 255, 0.2)',
    },
    title: {
        color: '#00f2ff',
        fontSize: '1.2rem',
        marginBottom: '5px',
        textAlign: 'center',
        fontWeight: '700',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    previewContainer: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        overflow: 'hidden',
        alignSelf: 'center',
        border: '2px solid #00f2ff',
        boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    input: {
        width: '100%',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid rgba(100, 200, 255, 0.2)',
        background: 'rgba(0, 0, 0, 0.3)',
        color: '#00f2ff',
        fontSize: '1.1rem',
        outline: 'none',
        textAlign: 'center',
        fontFamily: 'inherit',
        transition: 'all 0.3s ease',
    },
    fileLabel: {
        display: 'block',
        padding: '12px',
        textAlign: 'center',
        background: 'rgba(100, 200, 255, 0.05)',
        borderRadius: '12px',
        color: '#a0d9ff',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.3s',
        border: '1px dashed rgba(100, 200, 255, 0.3)',
    },
    hiddenInput: {
        display: 'none',
    },
    button: {
        width: '100%',
        padding: '16px',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(90deg, #0066ff, #00c3ff)',
        color: '#fff',
        fontWeight: '700',
        fontSize: '1.1rem',
        cursor: 'pointer',
        letterSpacing: '1px',
        marginTop: '10px',
        textShadow: '0 2px 5px rgba(0,0,0,0.2)',
    },
};

export default ProfileControls;
