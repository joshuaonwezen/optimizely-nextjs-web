import { Alert } from 'react-bootstrap';

const Error = ({ message }) => (
  <Alert variant='danger'>
    An error has occurred: {message}
  </Alert>
);

export default Error;
