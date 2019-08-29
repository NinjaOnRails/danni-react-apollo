import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';

const ALL_AUDIOS_QUERY = gql`
  query ALL_AUDIOS_QUERY {
    audios {
      id
      source
      duration
    }
  }
`;

const UPDATE_AUDIO_DURATION_MUTATION = gql`
  mutation UPDATE_AUDIO_DURATION_MUTATION($source: String!, $duration: Int!) {
    updateAudioDuration(source: $source, duration: $duration) {
      id
      source
      duration
    }
  }
`;

class UpdateAudioDuration extends Component {
  onAudioLoadedMetadata = async (e, source, updateAudioDuration) => {
    await updateAudioDuration({
      variables: {
        source,
        duration: Math.round(e.target.duration),
      },
    });
  };

  render() {
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
                  {data.audios.map(audio => (
                    <div key={audio.source}>
                      <audio
                        controls
                        src={audio.source}
                        onLoadedMetadata={e => {
                          if (!audio.duration)
                            this.onAudioLoadedMetadata(
                              e,
                              audio.source,
                              updateAudioDuration
                            );
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
  }
}

export default UpdateAudioDuration;
