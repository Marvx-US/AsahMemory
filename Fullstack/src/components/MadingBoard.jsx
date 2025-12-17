import React, { useEffect, useState } from 'react';
import MadingPost from './MadingPost';
import MadingForm from './MadingForm';
import { motion, AnimatePresence } from 'framer-motion';

const MadingBoard = () => {
    const [posts, setPosts] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/mading');
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Failed to fetch mading:", error);
        }
    };

    const handleNewPost = (post) => {
        setPosts(prev => [post, ...prev]);
        setShowForm(false);
    };

    return (
        <div style={{ padding: '0px 20px 100px 20px', minHeight: '100vh', width: '100%', position: 'relative' }}>

            {/* ACTION BAR */}
            <div style={{
                position: 'sticky',
                top: '20px',
                zIndex: 100,
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none' // Allow clicking through empty space
            }}>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        background: '#0055D4',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '30px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 15px rgba(0, 85, 212, 0.4)',
                        cursor: 'pointer',
                        pointerEvents: 'auto', // Re-enable pointer events
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    {showForm ? '❌ Batal' : '📌 Tempel Tulisan'}
                </motion.button>
            </div>

            {/* FORM OVERLAY */}
            <AnimatePresence>
                {showForm && (
                    <div
                        onClick={() => setShowForm(false)} // Click background to close
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(0,0,0,0.5)',
                            zIndex: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(5px)',
                            cursor: 'pointer' // Indicate clickable
                        }}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()} // Prevent close when clicking form
                            style={{ position: 'relative', width: '90%', maxWidth: '400px', cursor: 'default' }}
                        >
                            <MadingForm onPostSuccess={handleNewPost} onCancel={() => setShowForm(false)} />
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* DETAIL MODAL (New) */}
            <AnimatePresence>
                {selectedPost && (
                    <div
                        onClick={() => setSelectedPost(null)} // Close on background click
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(0,0,0,0.8)', // Darker background for focus
                            zIndex: 300,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(8px)',
                            cursor: 'zoom-out'
                        }}
                    >
                        <div onClick={(e) => e.stopPropagation()} style={{ cursor: 'default', maxWidth: '90%' }}>
                            <MadingPost {...selectedPost} isExpanded={true} />
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* POSTS GRID (Standard Grid Layout) */}
            <div className="mading-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', // Fixed 3 columns
                gap: '20px',
                width: '100%',
                maxWidth: '1200px',
                margin: '80px auto 0 auto',
            }}>
                <style jsx>{`
                    @media (max-width: 900px) {
                        .mading-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    }
                    @media (max-width: 600px) {
                        .mading-grid { grid-template-columns: 1fr !important; }
                    }
                `}</style>

                {posts.map((post) => (
                    <motion.div
                        key={post.id}
                        layoutId={`post-${post.id}`}
                        onClick={() => setSelectedPost(post)}
                        style={{ display: 'flex', justifyContent: 'center', height: 'fit-content' }}
                    >
                        <MadingPost {...post} />
                    </motion.div>
                ))}

                {posts.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: '100px', color: '#999', gridColumn: '1/-1' }}>
                        <p>Mading masih kosong... Jadilah yang pertama menempel!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MadingBoard;
