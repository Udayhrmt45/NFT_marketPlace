import '../styles/globals.css';
import { NFTProvider } from '../context/NFTContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <NFTProvider>
      <Head>
        <title>NFT Marketplace</title>
        <link rel="icon" href="/icon1.png" />
      </Head>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <Component {...pageProps} />
    </NFTProvider>
  );
}

export default MyApp;