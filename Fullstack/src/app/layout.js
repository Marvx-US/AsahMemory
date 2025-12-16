import { Permanent_Marker } from 'next/font/google';
import './globals.css';

const permanentMarker = Permanent_Marker({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-permanent-marker',
    display: 'swap',
});

export const metadata = {
    title: 'Asah Memory 2025',
    description: 'Connecting Digital Souls',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={permanentMarker.variable}>
            <body>{children}</body>
        </html>
    );
}
