import type { NextPage } from 'next';
import Head from 'next/head';
import { MainEditor } from '../components/Main'; // Import the editor component
import styles from '../styles/Home.module.css'; // Default Next.js styles (optional)

const Home: NextPage = () => {
  return (
    <div className={styles.container}> {/* You can keep or remove default styling */}
      <Head>
        <title>Creatomate Video Editor</title>
        <meta name="description" content="Video editor built with Creatomate SDK and Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}> {/* You can keep or remove default styling */}
        <MainEditor /> {/* Render the editor component */}
      </main>

      {/* You can keep or remove the default footer */}
      {/* <footer className={styles.footer}> ... </footer> */}
    </div>
  );
};

export default Home; 