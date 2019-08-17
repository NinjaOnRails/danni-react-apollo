export default source => {
  // Valid source forms
  const sourceYouTube = [
    { domain: 'https://youtube.com/watch?v=', length: 28 },
    { domain: 'http://youtube.com/watch?v=', length: 27 },
    { domain: 'https://www.youtube.com/watch?v=', length: 32 },
    { domain: 'http://www.youtube.com/watch?v=', length: 31 },
    { domain: 'youtube.com/watch?v=', length: 20 },
    { domain: 'www.youtube.com/watch?v=', length: 24 },
    { domain: 'https://youtu.be/', length: 17 },
    { domain: 'https://www.youtu.be/', length: 21 },
    { domain: 'http://youtu.be/', length: 16 },
    { domain: 'http://www.youtu.be/', length: 20 },
    { domain: 'youtu.be/', length: 9 },
    { domain: 'www.youtu.be/', length: 13 },
  ];
  return sourceYouTube.find(value => source.startsWith(value.domain));
};

const youtubeIdLength = 11;

export { youtubeIdLength };
