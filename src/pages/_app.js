import '../styles/globals.css';
import { NFTProvider } from '../context/NFTContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <NFTProvider>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <Component {...pageProps} />
    </NFTProvider>
  );
}

export default MyApp;