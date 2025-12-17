import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import fs from 'fs';
import path from 'path';

// --- Local File Fallback Logic ---
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'mading.json');

const ensureDataFile = () => {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf-8');
    }
};

const readLocalData = () => {
    ensureDataFile();
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("error reading local mading data:", error);
        return [];
    }
};

const writeLocalData = (data) => {
    ensureDataFile();
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("error writing local mading data:", error);
    }
};

// --- API Handlers ---

export async function GET() {
    // Mading posts are permanent (no expiry logic like profiles)

    if (isSupabaseConfigured()) {
        try {
            // Need a separate table 'mading_posts' or use 'profiles' with type.
            // For now, let's assume we create a NEW table 'mading_posts' in Supabase later.
            // Or easier: Just use the local file JSON structure in a 'content' JSONB column in a new table.

            // To keep it simple for now without forcing User to run SQL migration immediately:
            // We will attempt to use a 'mading_posts' table. If it fails, we might fall back?
            // Actually, let's stick to consistent pattern.
            // If Supabase is ON, we assume table exists.

            const { data, error } = await supabase
                .from('mading_posts')
                .select('*')
                .order('created_at', { ascending: false }); // Newest first

            if (error) {
                // If table doesn't exist, this will error.
                throw error;
            }

            // Unwrap content if we use the same JSONB pattern, or just return data if structured.
            // Let's use the JSONB 'content' pattern for flexibility like profiles.
            const formatted = data.map(row => ({
                ...row.content,
                id: row.id // Keep DB ID
            }));

            return NextResponse.json(formatted);

        } catch (error) {
            console.error("Supabase Mading Error:", error.message);
            // Fallback to local if Supabase fails (e.g. table missing)? 
            // Or just return error. Let's return empty array to not break UI logic.
            // But better: return local file if Supabase fails (Hybrid mode? No, confusing).
            return NextResponse.json({ error: 'Failed to fetch mading' }, { status: 500 });
        }
    } else {
        const posts = readLocalData();
        // Sort by date desc
        posts.sort((a, b) => b.createdAt - a.createdAt);
        return NextResponse.json(posts);
    }
}

export async function POST(request) {
    try {
        const payload = await request.json();

        // Validate existence
        if (!payload.name || !payload.message) {
            return NextResponse.json({ error: 'Name and Message are required' }, { status: 400 });
        }

        // Security: Validate Payload Size (Limit to ~2MB)
        // Frontend compresses images to ~100KB, so 2MB is a safe upper bound against abuse.
        const payloadSize = JSON.stringify(payload).length;
        if (payloadSize > 2 * 1024 * 1024) {
            return NextResponse.json({ error: 'Payload too large (Max 2MB)' }, { status: 413 });
        }

        const newPost = {
            id: Date.now(), // timestamp ID
            createdAt: Date.now(),
            name: payload.name.trim(),
            message: payload.message.trim(),
            image: payload.image, // Base64
            // Visual Randomness (generated on server for consistency)
            rotation: Math.floor(Math.random() * 24) - 12, // -12 to +12 deg (MORE MESSY!)
            tapeVariant: Math.floor(Math.random() * 3) + 1, // 1, 2, or 3
        };

        if (isSupabaseConfigured()) {
            const { error } = await supabase
                .from('mading_posts')
                .insert([{ content: newPost }]);

            if (error) throw error;
        } else {
            const posts = readLocalData();
            posts.push(newPost);
            writeLocalData(posts);
        }

        return NextResponse.json(newPost, { status: 201 });

    } catch (error) {
        console.error("Save Mading Error:", error.message);
        return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
    }
}
