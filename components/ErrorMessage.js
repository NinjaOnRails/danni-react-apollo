import { Message } from 'semantic-ui-react';
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledMessage = styled(Message.Header)`
  &&& {
    font-family: ${props => props.theme.font};
  }
`;

const DisplayError = ({ error }) => {
  if (!error || !error.message) return null;
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map((error, i) => (
      <Message negative key={i}>
        <p data-test="graphql-error">
          <StyledMessage>Ôi Trời!</StyledMessage>
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </Message>
    ));
  }
  return (
    <Message negative>
      <p data-test="graphql-error">
        <StyledMessage>Ôi Trời!</StyledMessage>
        {error.message.replace('GraphQL error: ', '')}
      </p>
    </Message>
  );
};

DisplayError.defaultProps = {
  error: {},
};

DisplayError.propTypes = {
  error: PropTypes.object,
};

export default DisplayError;
