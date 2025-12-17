import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { compressImage } from '../lib/utils';

const MadingForm = ({ onPostSuccess, onCancel }) => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result;
                setPreview(base64);
                // Compress for storage (800x800 is good balance for Detail View)
                const compressed = await compressImage(base64, 800, 800);
                setImage(compressed);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !message || !image) return;

        setLoading(true);
        try {
            const res = await fetch('/api/mading', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, message, image }),
            });

            if (res.ok) {
                const newPost = await res.json();
                onPostSuccess(newPost);
                // Reset form
                setName('');
                setMessage('');
                setImage(null);
                setPreview(null);
            }
        } catch (error) {
            console.error("Failed to post:", error);
            alert("Gagal menempel mading :(");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
                border: '1px solid #eee'
            }}
        >
            <h3 style={{ fontFamily: 'var(--font-permanent-marker)', color: '#0055D4', textAlign: 'center', marginBottom: '15px' }}>
                Tempel Sesuatu
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Image Upload */}
                <div style={{
                    width: '100%',
                    height: '150px',
                    border: '2px dashed #ccc',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    background: '#fafafa'
                }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                    />
                    {preview ? (
                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>+ Upload Foto (Wajib)</span>
                    )}
                </div>

                {/* Inputs */}
                <input
                    type="text"
                    placeholder="Nama Kamu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={30}
                    style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontFamily: "'Outfit', sans-serif"
                    }}
                />

                <textarea
                    placeholder="Tulis pesan..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    maxLength={200}
                    rows={3}
                    style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontFamily: "'Outfit', sans-serif",
                        resize: 'none'
                    }}
                />

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            flex: 1,
                            background: '#f0f0f0',
                            color: '#555',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            flex: 2,
                            background: '#0055D4',
                            color: 'white',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? 'Menempel...' : 'TEMPEL!'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default MadingForm;
