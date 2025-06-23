import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: 'DSA Tracker',
  description: 'Track your DSA progress with friends!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
