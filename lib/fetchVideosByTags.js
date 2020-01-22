import { VIDEOS_BY_TAGS_QUERY, ALL_VIDEOS_QUERY } from '../graphql/query';

export default async ({ client, contentLanguage, tags }) => {
  const videos = await client.query({
    query: VIDEOS_BY_TAGS_QUERY,
    variables: { contentLanguage, tags },
  });
  console.log(videos.data.videosConnection.edges);
  console.log(tags);
  // const videos = await client.query({
  //   query: ALL_VIDEOS_QUERY,
  //   variables: { contentLanguage },
  // });
  return { videos };
};
