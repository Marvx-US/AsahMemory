import './globals.css';

export const metadata = {
    title: 'Asah Memory 2025',
    description: 'Connecting Digital Souls',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
