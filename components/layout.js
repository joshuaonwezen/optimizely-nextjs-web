import Head from 'next/head';
import Script from 'next/script'
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => (
  <>
    <Script src='https://cdn.optimizely.com/js/21807841202.js' strategy='beforeInteractive' />
    <Head>
      <title>Optimizely Next.js Sandbox</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>
    <Container>
      {children}
    </Container>
  </>
);

export default Layout;
