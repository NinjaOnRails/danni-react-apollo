import isYouTubeSource, { youtubeIdLength } from '../../lib/isYouTubeSource';

const formatDuration = duration => {
  // Convert and format duration
  const seconds = duration % 60;
  return `${Math.round(duration / 60)}:${
    seconds > 9 ? seconds : `0${seconds}`
  }`;
};

const getDefaultValues = (data, audioId) => {
  const {
    video: {
      originId: oldOriginId,
      originThumbnailUrl: oldImage,
      originTitle: oldOriginTitle,
      originAuthor: oldOriginChannel,
      originTags: oldOriginTags,
    },
  } = data;
  let oldTitleVi = '';
  let oldDescriptionVi = '';
  let oldDefaultVolume = 30;
  let oldTagsObj = '';
  let oldAudioSource = '';
  let oldLanguage;
  if (!audioId) {
    ({
      video: { language: oldLanguage },
    } = data);
  } else {
    const {
      video: { audio },
    } = data;
    // Destructor audio array
    [
      {
        source: oldAudioSource,
        title: oldTitleVi,
        description: oldDescriptionVi,
        tags: oldTagsObj,
        defaultVolume: oldDefaultVolume,
        language: oldLanguage,
      },
    ] = audio.filter(audioFile => audioFile.id === audioId);
  }
  let oldTags = '';
  Object.values(oldTagsObj).forEach(val => {
    oldTags = oldTags + val.text + ' ';
  });
  return {
    oldOriginId,
    oldTitleVi,
    oldDescriptionVi,
    oldDefaultVolume,
    oldTags,
    oldAudioSource,
    oldLanguage,
    oldImage,
    oldOriginTitle,
    oldOriginChannel,
    oldOriginTags,
  };
};

export { formatDuration, getDefaultValues };
