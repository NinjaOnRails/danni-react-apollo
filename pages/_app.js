import App from 'next/app';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import withApollo from '../lib/withApolloClient';
import Page from '../components/UI/Page';
import Meta from '../components/UI/Meta';

class MyApp extends App {
  render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <ApolloProvider client={apollo}>
        <Meta watchPage={pageProps.watchPage} />
        <Page>
          <Component {...pageProps} />
        </Page>
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);
