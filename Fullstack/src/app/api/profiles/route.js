import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
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
    // Logic: Reset every day at 01:00 WIB (18:00 UTC)
    // We want to keep profiles created AFTER the most recent 01:00 WIB.

    const now = new Date();
    const currentUtcHour = now.getUTCHours();

    let cutoffDate = new Date(now);
    cutoffDate.setUTCMinutes(0, 0, 0);

    if (currentUtcHour >= 18) {
        // If it's past 18:00 UTC (01:00 WIB next day), the cutoff is today 18:00 UTC
        cutoffDate.setUTCHours(18);
    } else {
        // If it's before 18:00 UTC, the cutoff was yesterday 18:00 UTC
        cutoffDate.setUTCDate(cutoffDate.getUTCDate() - 1);
        cutoffDate.setUTCHours(18);
    }

    const cutoffTime = cutoffDate.getTime();

    if (isSupabaseConfigured()) {
        try {
            // Fetch from Supabase including the row ID for deletion
            const { data, error } = await supabase
                .from('profiles')
                .select('id, content')
                .order('id', { ascending: true });

            if (error) throw error;

            const validProfiles = [];
            const idsToDelete = [];

            data.forEach(row => {
                const profile = row.content;
                // Check if profile is older than the cutoff
                if (profile.id < cutoffTime) {
                    idsToDelete.push(row.id);
                } else {
                    validProfiles.push(profile);
                }
            });

            // Perform cleanup if needed
            if (idsToDelete.length > 0) {
                // We don't need to await this to block the response, but for data consistency it's better to verify logic
                // Fire and forget usually fine, but let's await to be sure
                await supabase.from('profiles').delete().in('id', idsToDelete);
                console.log(`Cleaned up ${idsToDelete.length} expired profiles from Supabase.`);
            }

            return NextResponse.json(validProfiles);
        } catch (error) {
            console.error("Supabase Fetch Error:", error.message);
            return NextResponse.json({ error: 'Failed to fetch from Database' }, { status: 500 });
        }
    } else {
        // Local File Fallback
        console.log("Supabase not configured. Using local file.");
        const profiles = readLocalData();

        const validProfiles = profiles.filter(profile => profile.id >= cutoffTime);

        // If cleanup happened, save the file
        if (validProfiles.length < profiles.length) {
            console.log(`Cleaned up ${profiles.length - validProfiles.length} expired profiles from local file.`);
            writeLocalData(validProfiles);
        }

        return NextResponse.json(validProfiles);
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
