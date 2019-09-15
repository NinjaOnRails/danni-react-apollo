import { Query } from 'react-apollo';
import { Loader, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';
import { StyledMessage, StyledHeader } from '../styles/AuthenticationStyles';

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <Loader active inline="centered" />;
      if (!data.currentUser) {
        return (
          <>
            <StyledMessage>
              <Message warning>
                <StyledHeader>Please Sign In to Continue</StyledHeader>
              </Message>
            </StyledMessage>
            <Signin noRedirectHome />
          </>
        );
      }
      return props.children;
    }}
  </Query>
);

PleaseSignIn.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

PleaseSignIn.defaultProps = {
  children: null,
};

export default PleaseSignIn;
