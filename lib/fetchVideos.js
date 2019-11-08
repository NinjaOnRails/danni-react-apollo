import { ALL_VIDEOS_QUERY } from '../graphql/query';

export default async ({ client, contentLanguage }) => {
  const videos = await client.query({
    query: ALL_VIDEOS_QUERY,
    variables: { contentLanguage },
  });
  return { videos };
};
