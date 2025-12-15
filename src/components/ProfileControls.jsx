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
            initial={{ opacity: 0, x: '-50%', y: 'calc(-50% + 50px)' }}
            animate={{ opacity: 1, x: '-50%', y: '-50%' }}
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
        top: '50%',
        left: '50%',
        zIndex: 100,
        width: '90%',
        maxWidth: '380px',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        padding: '30px',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 85, 212, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    title: {
        color: '#0055D4',
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
        border: '2px solid #0055D4',
        boxShadow: '0 0 20px rgba(0, 85, 212, 0.2)',
        background: '#fff',
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
        border: '1px solid rgba(0, 85, 212, 0.2)',
        background: 'rgba(255, 255, 255, 0.8)',
        color: '#003380',
        fontSize: '1.1rem',
        outline: 'none',
        textAlign: 'center',
        fontFamily: 'inherit',
        transition: 'all 0.3s ease',
        fontWeight: '500',
    },
    fileLabel: {
        display: 'block',
        padding: '12px',
        textAlign: 'center',
        background: 'rgba(0, 85, 212, 0.05)',
        borderRadius: '12px',
        color: '#0055D4',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.3s',
        border: '1px dashed rgba(0, 85, 212, 0.3)',
        fontWeight: '500',
    },
    hiddenInput: {
        display: 'none',
    },
    button: {
        width: '100%',
        padding: '16px',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(90deg, #0055D4, #0077FF)',
        color: '#fff',
        fontWeight: '700',
        fontSize: '1.1rem',
        cursor: 'pointer',
        letterSpacing: '1px',
        marginTop: '10px',
        boxShadow: '0 4px 15px rgba(0, 85, 212, 0.3)',
    },
};

export default ProfileControls;
