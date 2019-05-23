import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { ALL_VIDEOS_QUERY } from './Videos';

const CREATE_VIDEO_MUTATION = gql`
  mutation CREATE_VIDEO_MUTATION($youtubeId: String!) {
    createVideo(youtubeId: $youtubeId) {
      id
    }
  }
`;

const CREATE_AUDIO_MUTATION = gql`
  mutation CREATE_AUDIO_MUTATION($source: String!, $video: ID) {
    createAudio(data: { source: $source, video: $video }) {
      id
      source
      video {
        id
        title
      }
    }
  }
`;

class AddVideo extends Component {
  state = {
    youtubeId: '',
    audioSource: '',
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { youtubeId, audioSource } = this.state;
    return (
      <Mutation
        mutation={CREATE_AUDIO_MUTATION}
        refetchQueries={[{ query: ALL_VIDEOS_QUERY }]}
      >
        {(createAudio, { loading, errorCreateAudio }) => (
          <Mutation
            mutation={CREATE_VIDEO_MUTATION}
            variables={{ youtubeId }}
            refetchQueries={[{ query: ALL_VIDEOS_QUERY }]}
          >
            {(createVideo, { loading, error }) => (
              <Form
                data-test="form"
                onSubmit={async e => {
                  // Stop the form from submitting
                  e.preventDefault();
                  // Call the createVideo mutation
                  const {
                    data: {
                      createVideo: { id },
                    },
                  } = await createVideo();
                  // Call the createAudio mutation
                  if (audioSource) {
                    await createAudio({
                      variables: {
                        source: audioSource,
                        video: id,
                      },
                    });
                  }
                  // Redirect to the newly created Video watch page
                  Router.push({
                    pathname: '/watch',
                    query: { id },
                  });
                }}
              >
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <label htmlFor="title">
                    YouTube ID:
                    <input
                      type="text"
                      id="youtubeId"
                      name="youtubeId"
                      required
                      placeholder="e.g. 0Y59Yf9lEP0"
                      value={youtubeId}
                      onChange={this.handleChange}
                    />
                  </label>
                  <label htmlFor="title">
                    Audio source:
                    <input
                      type="text"
                      id="audioSource"
                      name="audioSource"
                      placeholder="e.g. https://soundcloud.com/user-566264679/addiction-cz"
                      value={audioSource}
                      onChange={this.handleChange}
                    />
                  </label>
                  <button type="submit">Submit</button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default AddVideo;
