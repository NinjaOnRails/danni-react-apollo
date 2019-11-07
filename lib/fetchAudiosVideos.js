import { ALL_VIDEOS_QUERY, ALL_AUDIOS_QUERY } from '../graphql/query';

export default async ({ client, contentLanguage }) => {
  const audios = await client.query({
    query: ALL_AUDIOS_QUERY,
    variables: { contentLanguage },
  });
  const videos = await client.query({
    query: ALL_VIDEOS_QUERY,
    variables: { contentLanguage },
  });
  return { audios, videos };
};
