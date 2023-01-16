import axios from 'axios';
import currencyFormatter from 'currency-formatter';
import { useState, useEffect } from 'react';
import { FormControl, Row, Col, Card, Toast  } from 'react-bootstrap';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Error from '../components/error';
import Loader from '../components/loader';

const queryClient = new QueryClient();
const locale = { locale: 'nl-NL' };

const searchProducts = async (query) => {
  const { data } = await axios.get(`https://dummyjson.com/products/search?q=${query}`);
  return data.products;
};

const ProductCard = ({ product }) => {
  const { id, title, price, description, thumbnail } = product;

  // Simple product overview using react-bootstrap
  return (
    <Card>
      <Card.Img
        variant='top'
        src={thumbnail}
        style={{ maxHeight: 200 }}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle>{currencyFormatter.format(price, locale)}</Card.Subtitle>
        <Card.Text>{description}</Card.Text>
        <Card.Link href={`/product/${id}`}>More info</Card.Link>
      </Card.Body>
    </Card>
  );
};

const ProductToast = ({ product }) => {
  const { id, title, price, description } = product;

  // Simple product overview using react-bootstrap
  return (
    <Toast animation={false}>
      <Toast.Header closeButton={false}>
        <strong className='me-auto'>
          <a href={`/product/${id}`} className='text-reset text-decoration-none'>{title}</a>
        </strong>
        <small>{currencyFormatter.format(price, locale)}</small>
      </Toast.Header>
      <Toast.Body>{description}</Toast.Body>
    </Toast>
  );
};

const getProductComponentForVariation = (variation) => {
  if (variation == 'ProductCard') {
    return ProductCard;
  } else if (variation == 'ProductToast') {
    return ProductToast;
  } else {
    throw 'Invalid variation';
  }
}

const ProductLoader = ({ query, variation }) => {
  // Retrieve products from using react-query
  const { isLoading, error, data } = useQuery(['products', query], () => searchProducts(query));

  // If the API request is still loading, show a loading screen
  if (isLoading) {
    return (
      <Loader />
    );
  }

  // If the API request gave an error, show error message
  if (error) {
    return (
      <Error message={error.message} />
    );
  }

  // If the variation state variable is still empty, show a splash screen
  if (!variation) {
    return (
      <Loader />
    );
  }

  // Select the product component depending on the experiment variation
  const ProductComponent = getProductComponentForVariation(variation);

  // Render all products
  if (data) {
    return (
      <Row>
        {data.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3} className='mb-3'>
            <ProductComponent product={product} />
          </Col>
        ))}
      </Row>
    );
  } else {
    return (
      <p>No products found</p>
    );
  }
};

const Page = () => {
  // Create a state variable for query string.
  // Use the setQuery function anytime the user updates the query string.
  const [query, setQuery] = useState('');

  // Create a state variable for the Optimizely variation.
  // Default is set to null, so no elements are rendered at first.
  // Note: create a unique state variable per experiment.
  const [variation, setVariation] = useState(null);
  // Only run the Optimizely code on the client side (in the browser)
  useEffect(() => {
    // Expose the setVariation function to window, so Optimizely can call it.
    window.setOptimizelyVariation = setVariation;

    // Manually activate the page to avoid any timing issues
    const optimizely = window.optimizely || [];
    optimizely.push({
      type: 'page',
      pageName: '21807841202_homepage'
    });

    // At this point Optimizely will calls the setOptimizelyVariation function
    // This updates the state variable, which causes React to rerender the page
    // For example:
    //    window.setOptimizelyVariation('ProductToast');
  }, []);

  // Render page
  return (
    <>
      <h1>Products</h1>
      <Row>
        <Col xs={12} sm={6} className='mb-5'>
          <h4>Description</h4>
          <p>
            This page is client-side rendered using Next.js and React.
            A React State hook and Effect hook are used to interact between Optimizely and React.
          </p>
        </Col>
        <Col xs={12} sm={6} className='mb-5'>
          <h4>Search</h4>
          <FormControl
            placeholder='Enter your search query...'
            aria-label='Search'
            value={query}
            onChange={(evt) => setQuery(evt.target.value)}
          />
        </Col>
      </Row>
      <QueryClientProvider client={queryClient}>
        <ProductLoader query={query} variation={variation} />
      </QueryClientProvider>
    </>
  );
};

export default Page;
