import App from 'next/app';
import { ApolloProvider } from 'react-apollo';
import withApollo from '../lib/withApolloClient';
import Page from '../components/UI/Page';
import Meta from '../components/UI/Meta';

class MyApp extends App {
  render() {
    const { Component, pageProps, apollo, router } = this.props;
    return (
      <ApolloProvider client={apollo}>
        <Meta />
        <Page route={router.route}>
          <Component {...pageProps} />
        </Page>
      </ApolloProvider>
    );
  }
}

export default withApollo(MyApp);
