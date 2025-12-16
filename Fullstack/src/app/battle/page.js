'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import confetti from 'canvas-confetti';

export default function BattlePage() {
    const [myChampion, setMyChampion] = useState(null);
    const [roomCode, setRoomCode] = useState('');
    const [gameState, setGameState] = useState('LOBBY'); // LOBBY, PREPARING, BATTLE, VICTORY, DEFEAT
    const [opponent, setOpponent] = useState(null);
    const [hp, setHp] = useState({ me: 100, opp: 100 });
    const [isHost, setIsHost] = useState(false);

    // Animation States
    const [battleAction, setBattleAction] = useState(null);
    const [floatingTexts, setFloatingTexts] = useState([]);

    // Rarity Stats
    const stats = {
        Legendary: { maxHp: 400, dmg: 40, crit: 0.25, dodge: 0.10 }, // Aggressive
        Pink: { maxHp: 300, dmg: 35, crit: 0.15, dodge: 0.25 },      // Evasive
        Epic: { maxHp: 200, dmg: 25, crit: 0.10, dodge: 0.05 },
        Rare: { maxHp: 120, dmg: 15, crit: 0.05, dodge: 0.0 },
        Common: { maxHp: 80, dmg: 10, crit: 0.0, dodge: 0.0 }
    };

    const channelRef = useRef(null);
    const myHpRef = useRef(0);
    const oppHpRef = useRef(0);
    const myMaxHpRef = useRef(100);
    const oppMaxHpRef = useRef(100);

    // 1. Load Champion
    useEffect(() => {
        const stored = localStorage.getItem('my_champion');
        if (stored) {
            const champ = JSON.parse(stored);
            setMyChampion(champ);
            myHpRef.current = stats[champ.rarity]?.maxHp || 100;
            myMaxHpRef.current = myHpRef.current;
        }
    }, []);

    // 2. Join Room Logic
    const joinRoom = () => {
        if (!roomCode.trim() || !myChampion) return;

        if (!supabase) {
            alert("Supabase keys are missing! Check .env file.");
            return;
        }

        const channelId = `battle_${roomCode}`;
        const channel = supabase.channel(channelId);

        channel
            .on('broadcast', { event: 'player_join' }, ({ payload }) => {
                if (payload.id !== myChampion.name) {
                    setOpponent(payload);
                    oppHpRef.current = stats[payload.rarity]?.maxHp || 100;
                    oppMaxHpRef.current = oppHpRef.current;

                    if (!opponent) { // I am host
                        setIsHost(true);
                        channel.send({
                            type: 'broadcast',
                            event: 'player_join',
                            payload: { ...myChampion, id: myChampion.name }
                        });
                    }
                }
            })
            .on('broadcast', { event: 'start_battle' }, () => {
                setGameState('BATTLE');
                // Only Host manages the loop, so Guests just wait for events
            })
            .on('broadcast', { event: 'attack_event' }, ({ payload }) => {
                handleAttackEvent(payload);
            })
            .subscribe(status => {
                if (status === 'SUBSCRIBED') {
                    channel.send({
                        type: 'broadcast',
                        event: 'player_join',
                        payload: { ...myChampion, id: myChampion.name }
                    });
                }
            });

        channelRef.current = channel;
        setGameState('PREPARING');
    };

    // 3. Handle Incoming Attack Event (Syncs state on Guest & Host UI)
    const handleAttackEvent = (data) => {
        const { attackerId, dmg, targetId, isGameOver, winnerId } = data;

        // Visuals
        const isMeAttacking = attackerId === myChampion.name;

        // 1. Lunge Animation
        setBattleAction({ type: 'ATTACK', who: isMeAttacking ? 'ME' : 'OPP' });

        // 2. Impact & Shake (Delayed to match lunge)
        setTimeout(() => {
            setBattleAction({ type: 'HIT', who: isMeAttacking ? 'OPP' : 'ME' }); // Target shakes
            addFloatingText(`-${dmg}`, isMeAttacking ? 'OPP' : 'ME', 'red');

            // Update Local State for UI
            if (isMeAttacking) {
                // Opponent took damage
                setHp(prev => ({ ...prev, opp: Math.max(0, prev.opp - (dmg / oppMaxHpRef.current * 100)) }));
            } else {
                // I took damage
                setHp(prev => ({ ...prev, me: Math.max(0, prev.me - (dmg / myMaxHpRef.current * 100)) }));
            }

            // Game Over Check
            if (isGameOver) {
                setTimeout(() => {
                    const amIWinner = winnerId === myChampion.name;
                    setGameState(amIWinner ? 'VICTORY' : 'DEFEAT');

                    if (amIWinner) {
                        try { confetti(); } catch (e) { }
                    } else {
                        localStorage.removeItem('my_champion'); // Permadeath
                    }
                }, 500);
            }

        }, 300);

        // Reset Animation
        setTimeout(() => setBattleAction(null), 800);
    };


    // 4. Host Logic (Calculates RNG and Tells Everyone What Happened)
    const startHostLoop = () => {
        if (!isHost || !opponent || !channelRef.current) return;

        // Send Start Signal
        channelRef.current.send({ type: 'broadcast', event: 'start_battle' });
        setGameState('BATTLE');

        let hostMyHp = stats[myChampion.rarity]?.maxHp || 100;
        let hostOppHp = stats[opponent.rarity]?.maxHp || 100;

        const loop = setInterval(() => {
            // 1. Host Attack
            setTimeout(() => {
                if (hostMyHp <= 0 || hostOppHp <= 0) return;

                const dmg = Math.floor((stats[myChampion.rarity]?.dmg || 10) * (0.8 + Math.random() * 0.4));
                hostOppHp -= dmg;

                // Broadcast
                channelRef.current.send({
                    type: 'broadcast',
                    event: 'attack_event',
                    payload: {
                        attackerId: myChampion.name,
                        targetId: opponent.name,
                        dmg: dmg,
                        isGameOver: hostOppHp <= 0,
                        winnerId: hostOppHp <= 0 ? myChampion.name : null
                    }
                });

                // Also update host UI locally via same handler (optional, or just listen to own broadcast?)
                // Supabase broadcast usually echoes back to sender if configured, but default 'broadcast' checks often exclude self.
                // We will manually call it for Host to ensure snappy response? 
                // Actually, creating a 'handleAttackEvent' call here is safer.
                handleAttackEvent({
                    attackerId: myChampion.name,
                    targetId: opponent.name,
                    dmg: dmg,
                    isGameOver: hostOppHp <= 0,
                    winnerId: hostOppHp <= 0 ? myChampion.name : null
                });

                if (hostOppHp <= 0) { clearInterval(loop); return; }

            }, 0);

            // 2. Opponent Attack
            setTimeout(() => {
                if (hostMyHp <= 0 || hostOppHp <= 0) return;

                const dmg = Math.floor((stats[opponent.rarity]?.dmg || 10) * (0.8 + Math.random() * 0.4));
                hostMyHp -= dmg;

                channelRef.current.send({
                    type: 'broadcast',
                    event: 'attack_event',
                    payload: {
                        attackerId: opponent.name,
                        targetId: myChampion.name,
                        dmg: dmg,
                        isGameOver: hostMyHp <= 0,
                        winnerId: hostMyHp <= 0 ? opponent.name : null
                    }
                });

                handleAttackEvent({
                    attackerId: opponent.name,
                    targetId: myChampion.name,
                    dmg: dmg,
                    isGameOver: hostMyHp <= 0,
                    winnerId: hostMyHp <= 0 ? opponent.name : null
                });

                if (hostMyHp <= 0) { clearInterval(loop); return; }

            }, 1500);

        }, 3000);
    };

    // Helper: Add Floating Numbers
    const addFloatingText = (text, target, color) => {
        const id = Date.now() + Math.random();
        setFloatingTexts(prev => [...prev, { id, text, target, color }]);
        setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== id)), 1000);
    };

    const handleStartClick = () => {
        startHostLoop();
    };

    // helper random code
    const generateCode = () => {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setRoomCode(code);
    };

    // --- ANIMATION VARIANTS ---
    const variants = {
        idle: { x: 0, scale: 1, filter: 'brightness(1)' },
        attackRight: { x: 150, scale: 1.2, transition: { type: 'spring', stiffness: 300, damping: 20 } },
        attackLeft: { x: -150, scale: 1.2, transition: { type: 'spring', stiffness: 300, damping: 20 } },
        hit: { x: [0, -10, 10, -10, 10, 0], filter: 'brightness(2) sepia(1) hue-rotate(-50deg)', transition: { duration: 0.4 } }
    };

    return (
        <div style={{
            width: '100vw', height: '100vh', background: '#111',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontFamily: 'var(--font-permanent-marker)', overflow: 'hidden', position: 'relative'
        }}>
            {/* SHAKE SCREEN ON HIT */}
            <motion.div
                animate={battleAction?.type === 'HIT' ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none', border: battleAction?.type === 'HIT' ? '5px solid red' : 'none', zIndex: 50, opacity: 0.5 }}
            />

            {/* BACK BUTTON */}
            <a href="/" style={{ position: 'absolute', top: 20, left: 20, zIndex: 100, color: '#888', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                ⬅ BACK TO VOID
            </a>

            {/* HEADER */}
            <h1 style={{ zIndex: 10, fontSize: '3rem', color: '#FFD700', textShadow: '0 0 20px #FF4500', marginBottom: 50 }}>
                {gameState === 'BATTLE' ? "DUEL!" : (gameState === 'VICTORY' ? "VICTORY!" : (gameState === 'DEFEAT' ? "DEFEATED" : "BATTLE ARENA"))}
            </h1>

            {/* LOBBY */}
            {gameState === 'LOBBY' && myChampion && (
                <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="Code" value={roomCode} onChange={e => setRoomCode(e.target.value)}
                            style={{ padding: '15px', fontSize: '1.5rem', borderRadius: '15px', border: '2px solid #444', textAlign: 'center', background: '#222', color: '#fff', width: '200px' }} />
                        <button onClick={joinRoom} style={{ padding: '15px 30px', background: 'linear-gradient(45deg, #0055D4, #0099ff)', color: 'white', border: 'none', borderRadius: '15px', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 'bold' }}>JOIN</button>
                    </div>
                    <button onClick={generateCode} style={{ background: 'transparent', border: '1px solid #555', color: '#888', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer' }}>🎲 Random Code</button>
                    <div style={{ marginTop: 20, textAlign: 'center' }}>
                        <img src={myChampion.image} style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid gold' }} />
                        <p>{myChampion.name}</p>
                    </div>
                </div>
            )}

            {/* ARENA */}
            {gameState !== 'LOBBY' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', maxWidth: '1000px', alignItems: 'center', position: 'relative' }}>

                    {/* --- PLAYER (LEFT) --- */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                        {/* HP BAR */}
                        <div style={{ width: '100%', height: 15, background: '#333', borderRadius: 10, overflow: 'hidden', marginBottom: 20, border: '2px solid #555' }}>
                            <motion.div animate={{ width: `${hp.me}%` }} style={{ height: '100%', background: hp.me < 30 ? '#ff3333' : '#44ff44' }} />
                        </div>

                        {/* AVATAR + ANIMATION */}
                        <div style={{ position: 'relative' }}>
                            <motion.img
                                src={myChampion.image}
                                variants={variants}
                                animate={
                                    gameState === 'DEFEAT' ? { opacity: 0, scale: 0, rotate: 180 } :
                                        (battleAction?.type === 'ATTACK' && battleAction?.who === 'ME' ? 'attackRight' :
                                            (battleAction?.type === 'HIT' && battleAction?.who === 'ME' ? 'hit' : 'idle'))
                                }
                                style={{
                                    width: 150, height: 150, borderRadius: '50%', objectFit: 'cover',
                                    border: `5px solid ${myChampion.rarity === 'Legendary' ? 'gold' : 'white'}`,
                                    boxShadow: `0 0 30px ${myChampion.rarity === 'Legendary' ? 'rgba(255, 215, 0, 0.5)' : 'rgba(0, 85, 212, 0.5)'}`
                                }}
                            />
                            {/* FLOATING TEXT */}
                            <AnimatePresence>
                                {floatingTexts.filter(t => t.target === 'ME').map(t => (
                                    <motion.div key={t.id} initial={{ y: 0, opacity: 1, scale: 0.5 }} animate={{ y: -100, opacity: 0, scale: 1.5 }} exit={{ opacity: 0 }}
                                        style={{ position: 'absolute', top: '50%', left: '50%', color: t.color, fontSize: '3rem', fontWeight: 'bold', textShadow: '0 0 10px black', zIndex: 100 }}>
                                        {t.text}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        <h2>{myChampion.name}</h2>
                    </div>

                    {/* --- CENTER (VS / START) --- */}
                    <div style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {gameState === 'PREPARING' && (
                            opponent ?
                                (isHost && <button onClick={handleStartClick} style={{ padding: '20px 50px', fontSize: '2rem', background: 'gold', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', animation: 'pulse 1s infinite' }}>FIGHT!</button>) :
                                <span className="animate-pulse">Waiting...</span>
                        )}
                        {gameState === 'BATTLE' && <h1 style={{ fontSize: '5rem', fontStyle: 'italic', opacity: 0.2 }}>VS</h1>}
                        {/* Removed MAIN MENU Button as requested */}
                    </div>

                    {/* --- OPPONENT (RIGHT) --- */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                        {opponent ? (
                            <>
                                <div style={{ width: '100%', height: 15, background: '#333', borderRadius: 10, overflow: 'hidden', marginBottom: 20, border: '2px solid #555' }}>
                                    <motion.div animate={{ width: `${hp.opp}%` }} style={{ height: '100%', background: hp.opp < 30 ? '#ff3333' : '#44ff44' }} />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <motion.img
                                        src={opponent.image}
                                        variants={variants}
                                        animate={
                                            gameState === 'VICTORY' ? { opacity: 0, scale: 0, rotate: -180 } :
                                                (battleAction?.type === 'ATTACK' && battleAction?.who === 'OPP' ? 'attackLeft' :
                                                    (battleAction?.type === 'HIT' && battleAction?.who === 'OPP' ? 'hit' : 'idle'))
                                        }
                                        style={{
                                            width: 150, height: 150, borderRadius: '50%', objectFit: 'cover',
                                            border: `5px solid ${opponent.rarity === 'Legendary' ? 'gold' : 'white'}`,
                                            boxShadow: `0 0 30px ${opponent.rarity === 'Legendary' ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)'}`
                                        }}
                                    />
                                    {/* FLOATING TEXT */}
                                    <AnimatePresence>
                                        {floatingTexts.filter(t => t.target === 'OPP').map(t => (
                                            <motion.div key={t.id} initial={{ y: 0, opacity: 1, scale: 0.5 }} animate={{ y: -100, opacity: 0, scale: 1.5 }} exit={{ opacity: 0 }}
                                                style={{ position: 'absolute', top: '50%', left: '50%', color: t.color, fontSize: '3rem', fontWeight: 'bold', textShadow: '0 0 10px black', zIndex: 100 }}>
                                                {t.text}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                <h2>{opponent.name}</h2>
                            </>
                        ) : <div style={{ width: 150, height: 150, background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</div>}
                    </div>

                </div>
            )}
        </div>
    );
}
