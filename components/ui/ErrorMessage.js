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
        <audio
          autoPlay
          src="https://res.cloudinary.com/danni/video/upload/v1566550191/iam2kigyc7gwxrjkmi8j.mp3"
        >
          <track kind="captions" />
        </audio>
        <StyledMessage>
          Holy Guacamole!
          <p data-test="graphql-error">
            {error.message.replace('GraphQL error: ', '')}
          </p>
        </StyledMessage>
      </Message>
    ));
  }
  return (
    <Message negative>
      <audio
        autoPlay
        src="https://res.cloudinary.com/danni/video/upload/v1566550191/iam2kigyc7gwxrjkmi8j.mp3"
      >
        <track kind="captions" />
      </audio>
      <StyledMessage>
        Holy Guacamole!
        <p data-test="graphql-error">
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </StyledMessage>
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
