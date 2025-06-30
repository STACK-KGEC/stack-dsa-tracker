import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: 'DSA Tracker | STACK | KGEC',
  description: 'Track your DSA progress with your community! Developed by STACK, KGEC.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon for SVG */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* (Optional) Fallback for older browsers */}
        <link rel="alternate icon" href="/favicon.ico" />
        {/* Meta description */}
        <meta name="description" content="Track your DSA progress with your community! Developed by STACK, KGEC." />
        <title>DSA Tracker | STACK | KGEC</title>
      </head>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
