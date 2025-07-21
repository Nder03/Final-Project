import Link from 'next/link';
import { useAuth } from '@/AuthContext';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
  const { currentUser } = useAuth();
  const ADMIN_UID = 'DIWd0JUi10hjngGiUYhaDHCSKvu1';

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link href="/">
          Movie App
        </Link>
      </div>
      <div className={styles.navRight}>
        <Link href="/collections">
          My Collections
        </Link>
        
        {/* --- THIS IS THE MISSING PART --- */}
        {currentUser && currentUser.uid === ADMIN_UID && (
          <Link href="/admin">
            Admin
          </Link>
        )}
        {/* ----------------------------- */}

        {currentUser ? (
          <button onClick={handleLogout} className={styles.authButton}>
            Logout
          </button>
        ) : (
          <>
            <Link href="/login">
              Login
            </Link>
            <Link href="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}