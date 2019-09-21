import PropTypes from 'prop-types';
import Head from 'next/head';

const VideoHeader = props => {
  const {
    video: {
      audio,
      originAuthor,
      originTitle,
      originThumbnailUrl,
      originThumbnailUrlSd,
      originLanguage,
      originDescription,
    },
    url,
  } = props;
  return (
    <Head>
      <title>{audio[0] ? audio[0].title : originTitle} | Danni TV</title>
      <meta name="author" content={originAuthor} />
      <meta name="title" content={audio[0] ? audio[0].title : originTitle} />
      <meta
        name="description"
        content={
          audio[0] && audio[0].description
            ? audio[0].description
            : originDescription
        }
      />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta
        property="og:title"
        content={audio[0] ? audio[0].title : originTitle}
      />
      <meta
        property="og:image"
        content={originThumbnailUrlSd || originThumbnailUrl}
      />
      <meta property="og:locale" content={originLanguage || ''} />
      <meta
        key="og:description"
        property="og:description"
        content={
          audio[0] && audio[0].description
            ? audio[0].description
            : originDescription
        }
      />
      <meta property="fb:app_id" content="444940199652956" />
    </Head>
  );
};

VideoHeader.propTypes = {
  video: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
};

export default VideoHeader;
