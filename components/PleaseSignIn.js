import { Query } from 'react-apollo';
import { Loader, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';

const StyledMessage = styled(Message.Header)`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  &&& {
    font-family: ${props => props.theme.font};
  }
`;

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <Loader active inline="centered" />;
      if (!data.currentUser) {
        return (
          <>
            <Message warning>
              <StyledMessage>Đăng Nhập Để Tiếp Tục</StyledMessage>
            </Message>
            <Signin />
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
