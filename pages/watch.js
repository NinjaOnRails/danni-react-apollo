import gql from 'graphql-tag';
import Head from 'next/head';
import { Query } from 'react-apollo';
import Error from '../components/ErrorMessage';
import Watch from '../components/Watch';

const VIDEO_QUERY = gql`
  query VIDEO_QUERY($id: ID!) {
    video(where: { id: $id }) {
      id
      originId
      titleVi
      originAuthor
      originThumbnailUrl
      defaultVolume
      startAt
      audio {
        id
        source
      }
      tags {
        text
      }
    }
  }
`;

const WatchPage = props => {
  const {
    query: { id },
  } = props;
  return (
    <Query
      query={VIDEO_QUERY}
      variables={{
        id,
      }}
    >
      {({ error, loading, data }) => {
        if (error) return <Error error={error} />;
        if (loading) return <p>Loading...</p>;
        if (!data.video) return <p>No Video Found for {id}</p>;
        const {
          video: { titleVi, originAuthor, originThumbnailUrl },
        } = data;

        return (
          <div>
            <Head>
              <title>Danni | {titleVi}</title>
              <meta
                property="og:url"
                content={'http://danni.tv/watch?id=' + id}
              />
              <meta property="og:title" content={titleVi} />
              <meta property="og:image" content={originThumbnailUrl} />
              <meta property="og:locale" content="vi_VN" />
            </Head>
            <Watch id={props.query.id} data={data} />
          </div>
        );
      }}
    </Query>
  );
};

export default WatchPage;
