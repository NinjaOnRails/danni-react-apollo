import PropTypes from 'prop-types';
import Head from 'next/head';

const VideoHeader = ({
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
}) => {
  return (
    <Head>
      <title key="title">
        {audio[0] ? audio[0].title : originTitle} | Danni TV
      </title>
      <meta name="author" content={originAuthor} />
      <meta
        key="metaTitle"
        name="title"
        content={audio[0] ? audio[0].title : originTitle}
      />
      <meta
        key="description"
        name="description"
        content={
          audio[0] && audio[0].description
            ? audio[0].description
            : originDescription
        }
      />
      <meta
        key="og:image"
        property="og:image"
        content={originThumbnailUrlSd || originThumbnailUrl}
      />
      <meta property="og:type" content="article" key="og:type" />
      <meta property="og:url" content={url} key="og:url" />
      <meta
        property="og:title"
        content={audio[0] ? audio[0].title : originTitle}
        key="og:title"
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
    </Head>
  );
};

VideoHeader.propTypes = {
  video: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
};

export default VideoHeader;
