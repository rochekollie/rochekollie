import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ProfileView from '@/components/ProfileView';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'User Profile & Settings | Roche Kollie',
  description: 'Manage your personal user profile, avatar, preferences, and developer hub settings.',
};

export default function ProfilePage() {
  return (
    <div
      id="main-content"
      className="content-screen profile-page-screen"
      role="region"
      aria-label="User Profile and Account Settings"
    >
      <Navbar />
      <main>
        <ProfileView />
      </main>
      <Footer />
    </div>
  );
}
