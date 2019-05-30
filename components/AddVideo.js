import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { ALL_VIDEOS_QUERY } from './Videos';

const CREATE_VIDEO_MUTATION = gql`
  mutation CREATE_VIDEO_MUTATION(
    $source: String!
    $titleVi: String!
    $addedBy: String!
    $startAt: Int!
  ) {
    createVideo(
      data: {
        source: $source
        titleVi: $titleVi
        addedBy: $addedBy
        startAt: $startAt
      }
    ) {
      id
      originId
      titleVi
      addedBy
      startAt
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
      }
    }
  }
`;

class AddVideo extends Component {
  state = {
    source: '',
    titleVi: '',
    addedBy: '',
    startAt: 0,
    audioSource: '',
    tags: '',
    tagsArray: [],
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseInt(value, 10) : value;
    this.setState({ [name]: val });
    if (name === 'tags') {
      this.setState({ tagsArray: val.split(' ') });
    }
  };

  render() {
    const {
      source,
      audioSource,
      tags,
      titleVi,
      addedBy,
      startAt,
      tagsArray,
    } = this.state;
    return (
      <Mutation
        mutation={CREATE_AUDIO_MUTATION}
        refetchQueries={[{ query: ALL_VIDEOS_QUERY }]}
      >
        {(createAudio, { loading, errorCreateAudio }) => (
          <Mutation
            mutation={CREATE_VIDEO_MUTATION}
            variables={{ source, titleVi, addedBy, startAt }}
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
                  <label htmlFor="source">
                    Nguồn (YouTube):
                    <input
                      type="text"
                      id="source"
                      name="source"
                      required
                      placeholder="ví dụ 0Y59Yf9lEP0 hoặc https://www.youtube.com/watch?v=h4Uu5eyN6VU"
                      value={source}
                      onChange={this.handleChange}
                    />
                  </label>
                  <label htmlFor="startAt">
                    Bắt đầu tại:
                    <input
                      type="number"
                      id="startAt"
                      name="startAt"
                      placeholder="ví dụ 04:25"
                      value={startAt}
                      onChange={this.handleChange}
                    />
                  </label>
                  <label htmlFor="titleVi">
                    Tiêu đề:
                    <input
                      type="text"
                      id="titleVi"
                      name="titleVi"
                      required
                      placeholder="ví dụ "
                      value={titleVi}
                      onChange={this.handleChange}
                    />
                  </label>
                  {/* <label htmlFor="addedBy">
                    Thêm bởi:
                    <input
                      type="text"
                      id="addedBy"
                      name="addedBy"
                      placeholder="ví dụ Ánh Nhật"
                      value={addedBy}
                      onChange={this.handleChange}
                    />
                  </label> */}
                  {/* <label htmlFor="tags">
                    Tags:
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      placeholder="e.g. technology inspiring informative science politics"
                      value={tags}
                      onChange={this.handleChange}
                    />
                  </label> */}
                  <label htmlFor="audioSource">
                    Nguồn Audio:
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
