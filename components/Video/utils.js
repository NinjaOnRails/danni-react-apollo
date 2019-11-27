const formatDuration = duration => {
  // Convert and format duration
  const seconds = duration % 60;
  return `${Math.round(duration / 60)}:${
    seconds > 9 ? seconds : `0${seconds}`
  }`;
};

const getDefaultValues = (data, audioId) => {
  const {
    video: { originId: oldOriginId, originTags: oldOriginTagsObj },
  } = data;
  let oldTitleVi = data.video.originTitle;
  let oldDescriptionVi = '';
  let oldTagsObj = {};
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
        language: oldLanguage,
      },
    ] = audio.filter(audioFile => audioFile.id === audioId);
  }
  let oldTags = '';

  Object.values(oldTagsObj).forEach(val => {
    oldTags = oldTags + val.text + ' ';
  });
  const oldOriginTags = oldOriginTagsObj.map(tagObj => {
    return tagObj.text;
  });

  return {
    oldOriginId,
    oldTitleVi,
    oldDescriptionVi,
    oldTags,
    oldAudioSource,
    oldLanguage,
    oldOriginTags,
  };
};

export { formatDuration, getDefaultValues };
