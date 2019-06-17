import Head from 'next/head';
import { Container, Grid } from 'semantic-ui-react';
import Watch from '../components/Watch';
import VideoList from '../components/VideoList';

const WatchPage = () => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
      </Head>
      <Grid columns={2} stackable>
        <Grid.Column width={11}>
          <Watch />
        </Grid.Column>
        <Grid.Column width={5}>
          <VideoList />
        </Grid.Column>
      </Grid>
    </>
  );
};

export default WatchPage;
