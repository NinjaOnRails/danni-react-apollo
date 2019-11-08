import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { ALL_AUDIOS_QUERY } from '../../graphql/query';
import { UPDATE_AUDIO_DURATION_MUTATION } from '../../graphql/mutation';

const UpdateAudioDuration = () => {
  const onAudioLoadedMetadata = async (e, source, updateAudioDuration) => {
    await updateAudioDuration({
      variables: {
        source,
        duration: Math.round(e.target.duration),
      },
    });
  };
  return (
    <Query query={ALL_AUDIOS_QUERY}>
      {({ loading, error, data }) => (
        <Mutation mutation={UPDATE_AUDIO_DURATION_MUTATION}>
          {(updateAudioDuration, { updateError, updateLoading }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>error!</div>;
            if (updateLoading) return <div>Loading...</div>;
            if (updateError) return <div>error!</div>;

            return (
              <div>
                {data.audios.map(({ source, duration }) => (
                  <div key={source}>
                    <audio
                      controls
                      src={source}
                      onLoadedMetadata={e => {
                        if (!duration)
                          onAudioLoadedMetadata(e, source, updateAudioDuration);
                      }}
                    >
                      <track kind="captions" />
                    </audio>
                  </div>
                ))}
              </div>
            );
          }}
        </Mutation>
      )}
    </Query>
  );
};

export default UpdateAudioDuration;
