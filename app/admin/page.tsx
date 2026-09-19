import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Console & Client Inquiries | Roche Kollie',
  description: 'Manage incoming client messages, review user registrations, and monitor developer portfolio activity.',
};

export default function AdminPage() {
  return (
    <div
      id="main-content"
      className="content-screen admin-page-screen"
      role="region"
      aria-label="Administrator Console and Inquiries Manager"
    >
      <Navbar />
      <main>
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  );
}
