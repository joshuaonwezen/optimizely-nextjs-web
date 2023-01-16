import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../components/layout'

const App = ({ Component, pageProps }) => (
  <Layout>
    <Component {...pageProps} />
  </Layout>
);

export default App;
