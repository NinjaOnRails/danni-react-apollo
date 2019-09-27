const trackVideoPlay = (
  {
    audio,
    language,
    id,
    originTitle,
    originPlatform,
    originLanguage,
    originAuthor,
    addedBy: { displayName = 'deleted user' },
    duration,
  },
  state,
  played,
  playedSeconds
) => {
  const ending = played === undefined ? ` ${state}` : `ed ${state}`;
  mixpanel.track(`Video Play${ending}`, {
    'Audio ID': audio[0] ? audio[0].id : 'no-audio',
    'Audio Language': audio[0] ? audio[0].language : language,
    'Audio Author': audio[0] ? audio[0].displayName : 'no-audio',
    'Audio Duration': audio[0] ? audio[0].duration : 'no-audio',
    'Video ID': id,
    'Video Title': originTitle,
    'Video Platform': originPlatform,
    'Video Language': originLanguage,
    'Video Author': originAuthor,
    'Video AddedBy': displayName,
    'Video Duration': duration,
    'Video Played Duration (s)': playedSeconds,
    'Video Played (%)': played,
  });

  if (state === '50%') {
    mixpanel.people.set({ 'Last Video Played 50%': new Date() });
    mixpanel.people.set_once({
      'First Video Played 50%': new Date(),
    });
    mixpanel.people.increment('Total Videos Played 50%');
  }

  return state;
};

const trackPlayStart = video => {
  trackVideoPlay(video, 'Start');
  mixpanel.people.set({ 'Last Video Play Start': new Date() });
  mixpanel.people.set_once({
    'First Video Play Start': new Date(),
  });
  mixpanel.people.increment('Total Videos Play Start');
};

const trackPlayFinish = video => {
  trackVideoPlay(video, 'Finish');
  mixpanel.people.set({ 'Last Video Play Finish': new Date() });
  mixpanel.people.set_once({
    'First Video Play Finish': new Date(),
  });
  mixpanel.people.increment('Total Videos Play Finish');
};

const trackPlayedDuration = ({
  e: { played, playedSeconds },
  video,
  mixpanelEventsSent,
}) => {
  const checkpoints = [
    {
      checkpoint: '3s',
      condition: playedSeconds >= 3,
    },
    {
      checkpoint: '10s',
      condition: playedSeconds >= 10,
    },
    {
      checkpoint: '30s',
      condition: playedSeconds >= 30,
    },
    {
      checkpoint: '25%',
      condition: played >= 0.25,
    },
    {
      checkpoint: '50%',
      condition: played >= 0.5,
    },
    {
      checkpoint: '75%',
      condition: played >= 0.75,
    },
    {
      checkpoint: '90%',
      condition: played >= 0.9,
    },
  ];

  const checkpointReached = checkpoints.find(
    ({ checkpoint, condition }) =>
      condition && !mixpanelEventsSent.find(e => e === checkpoint)
  );
  if (checkpointReached)
    return trackVideoPlay(
      video,
      checkpointReached.checkpoint,
      played,
      playedSeconds
    );
  return null;
};

const trackNewVideo = (language = 'no-audio') => {
  mixpanel.track('New Video', {
    'Audio Language': language,
  });
  mixpanel.people.set({ 'Last Video Added': new Date() });
  mixpanel.people.set_once({
    'First Video Added': new Date(),
  });
  mixpanel.people.increment('Total Videos Added');
};

const trackSignIn = displayName => {
  mixpanel.identify(displayName);
  mixpanel.people.set({ $last_login: new Date() });
};

const trackSignUp = ({ id, email, name, displayName }) => {
  mixpanel.alias(displayName);
  mixpanel.track('Sign Up');
  mixpanel.people.set({
    $id: id,
    $email: email,
    $name: name,
    $displayName: displayName,
    $created: new Date(),
  });
};

export {
  trackPlayStart,
  trackPlayFinish,
  trackPlayedDuration,
  trackNewVideo,
  trackSignIn,
  trackSignUp,
};
