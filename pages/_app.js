import App, { Container } from 'next/app';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
// import withApollo from '../lib/withApollo';
import withApollo from '../lib/withApolloClient';
import Page from '../components/Page';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    pageProps.query = ctx.query;
    return { pageProps };
  }

  render() {
    const { Component, apollo, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    );
  }
}

// class MyApp extends App {
//   render() {
//     const { Component, pageProps, apolloClient } = this.props;

//     return (
//       <Container>
//         <ApolloProvider client={apolloClient}>
//           <Page>
//             <Component {...pageProps} />
//           </Page>
//         </ApolloProvider>
//       </Container>
//     );
//   }
// }

export default withApollo(MyApp);
