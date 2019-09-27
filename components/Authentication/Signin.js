import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Link from 'next/link';
import Router from 'next/router';
import { Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import { signinFields } from './fieldTypes';
import AuthForm from './AuthenticationForm';
import { trackSignIn } from '../../lib/mixpanel';
import {
  CURRENT_USER_QUERY,
  CONTENT_LANGUAGE_QUERY,
} from '../../graphql/query';
import {
  SIGNIN_MUTATION,
  CLOSE_AUTH_MODAL_MUTATION,
} from '../../graphql/mutation';
import { client } from '../UI/ContentLanguage';

/* eslint-disable */
const signinMutation = ({ variables, render }) => (
  <Mutation
    mutation={SIGNIN_MUTATION}
    variables={variables}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signin, signinResult) => {
      return render({ signin, signinResult });
    }}
  </Mutation>
);

const closeAuthModal = ({ render }) => (
  <Mutation mutation={CLOSE_AUTH_MODAL_MUTATION}>{render}</Mutation>
);

const Composed = adopt({
  client,
  localState: ({ render }) => (
    <Query query={CONTENT_LANGUAGE_QUERY}>{render}</Query>
  ),
  signinMutation,
  closeAuthModal,
});
/* eslint-enable */

class Signin extends Component {
  state = {
    email: '',
    password: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async ({
    e,
    signin,
    data: { previousPage },
    client,
    noRedirect,
    closeAuthModal,
  }) => {
    e.preventDefault();
    const { data } = await signin();
    this.setState({
      email: '',
      password: '',
    });
    if (data) {
      trackSignIn(data.signin.displayName);
      closeAuthModal()
      if (!noRedirect) {
        Router.push(
          localStorage.getItem('previousPage') || previousPage || '/'
        );
        localStorage.removeItem('previousPage');
        client.writeData({ data: { previousPage: null } });
      }
    }
  };

  render() {
    const { noRedirect, isModal } = this.props;
    return (
      <Composed variables={this.state}>
        {({
          client,
          localState: { data },
          signinMutation: {
            signin,
            signinResult: { error, loading },
          },
          closeAuthModal,
        }) => (
          <Container>
            <Form
              method="post"
              onSubmit={e =>
                this.onSubmit({
                  e,
                  signin,
                  data,
                  client,
                  noRedirect,
                  closeAuthModal,
                })
              }
              isModal
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <Error error={error} />
                {signinFields.map(form => (
                  <AuthForm
                    key={form.name}
                    form={form}
                    saveToState={this.saveToState}
                    value={this.state}
                  />
                ))}
                <button type="submit">Sign{loading && 'ing'} In</button>
              </fieldset>
              {!isModal && (
                <Link href="/signup">
                  <a>Create a new account</a>
                </Link>
              )}
              <Link href="/requestReset">
                <a>Forgot password?</a>
              </Link>
            </Form>
          </Container>
        )}
      </Composed>
    );
  }
}

Signin.propTypes = {
  noRedirect: PropTypes.bool,
  isModal: PropTypes.bool,
};

Signin.defaultProps = {
  noRedirect: false,
  isModal: false,
};

export default Signin;
