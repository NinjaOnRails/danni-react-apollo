import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import http from 'http';
import Page from '../components/Page';
import withApolloClient from '../lib/withApolloClient';
import { prodEndpoint } from '../config';

setInterval(() => {
  http.get(prodEndpoint);
}, 1800000); // every 30 minutes

class MyApp extends App {
  render() {
    const { Component, apolloClient, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
