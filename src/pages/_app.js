import { AuthProvider } from '../AuthContext';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}

export default MyApp;