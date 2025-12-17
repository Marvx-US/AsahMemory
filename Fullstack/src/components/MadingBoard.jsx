import React, { useEffect, useState } from 'react';
import MadingPost from './MadingPost';
import MadingForm from './MadingForm';
import { motion, AnimatePresence } from 'framer-motion';

const MadingBoard = () => {
    const [posts, setPosts] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [selectedPost, setSelectedPost] = useState(null);
    const [visiblePosts, setVisiblePosts] = useState(6); // Initial load: 6 posts
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect mobile
        setIsMobile(window.innerWidth <= 768);

        fetchPosts();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
        <div style={{
            padding: '0px 20px 100px 20px',
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
        }}>

            {/* ACTION BAR - STATIC (not sticky) */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '30px',
                paddingBottom: '20px',
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        zIndex: 50,
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

            {/* POSTS GRID (Messy Layout) */}
            <div className="mading-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', // Fixed 3 columns
                gap: '40px 30px', // Larger gap for messy feel
                width: '100%',
                maxWidth: '1200px',
                margin: '40px auto 0 auto',
                padding: '20px',
            }}>
                <style jsx>{`
                    @media (max-width: 1024px) {
                        .mading-grid { 
                            grid-template-columns: repeat(2, 1fr) !important; 
                            gap: 30px 20px !important;
                        }
                    }
                    @media (max-width: 640px) {
                        .mading-grid { 
                            grid-template-columns: 1fr !important; 
                            gap: 30px !important;
                            padding: 10px !important;
                        }
                    }
                `}</style>

                {posts.slice(0, visiblePosts).map((post, index) => (
                    <motion.div
                        key={post.id}
                        layoutId={`post-${post.id}`}
                        onClick={() => setSelectedPost(post)}
                        initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={isMobile ? {} : { delay: index * 0.05 }}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 'fit-content',
                            position: 'relative',
                        }}
                    >
                        <MadingPost {...post} />
                    </motion.div>
                ))}

                {posts.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: '100px', color: '#8b7355', gridColumn: '1/-1' }}>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Mading masih kosong... Jadilah yang pertama menempel!</p>
                    </div>
                )}

                {/* Load More Button */}
                {visiblePosts < posts.length && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', marginTop: '20px' }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setVisiblePosts(prev => prev + 6)}
                            style={{
                                background: '#0055D4',
                                color: 'white',
                                border: 'none',
                                padding: '12px 30px',
                                borderRadius: '25px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(0, 85, 212, 0.3)',
                            }}
                        >
                            Muat Lebih Banyak ({posts.length - visiblePosts} tersisa)
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MadingBoard;
