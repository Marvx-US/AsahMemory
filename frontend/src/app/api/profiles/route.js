import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

// --- Local File Fallback Logic (For Dev without Internet/Keys) ---
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'profiles.json');

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
        console.error("error reading local data:", error);
        return [];
    }
};

const writeLocalData = (data) => {
    ensureDataFile();
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("error writing local data:", error);
    }
};

// --- Main API Handlers ---

export async function GET() {
    if (isSupabaseConfigured()) {
        try {
            // Fetch from Supabase
            const { data, error } = await supabase
                .from('profiles')
                .select('content')
                .order('id', { ascending: true }); // Ordering by ID assumes auto-increment

            if (error) throw error;

            // Extract the 'content' field which holds the actual profile object
            const profiles = data.map(row => row.content);
            return NextResponse.json(profiles);
        } catch (error) {
            console.error("Supabase Fetch Error:", error.message);
            // Fallback to local if Supabase fails? Or just return error?
            // For now, let's fallback to empty array or error to avoid confusion
            return NextResponse.json({ error: 'Failed to fetch from Database' }, { status: 500 });
        }
    } else {
        // Local File Fallback
        console.log("Supabase not configured. Using local file.");
        const profiles = readLocalData();
        return NextResponse.json(profiles);
    }
}

export async function POST(request) {
    try {
        const newProfile = await request.json();

        if (isSupabaseConfigured()) {
            // Insert into Supabase
            // storing the whole object in the 'content' JSONB column
            const { error } = await supabase
                .from('profiles')
                .insert([{ content: newProfile }]);

            if (error) throw error;

            return NextResponse.json(newProfile, { status: 201 });
        } else {
            // Local File Fallback
            console.log("Supabase not configured. Saving to local file.");
            const profiles = readLocalData();
            profiles.push(newProfile);
            writeLocalData(profiles);
            return NextResponse.json(newProfile, { status: 201 });
        }
    } catch (error) {
        console.error("Save Error:", error.message);
        return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
    }
}
