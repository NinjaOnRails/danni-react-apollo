import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { ALL_VIDEOS_QUERY } from './Videos';

const NEW_VIDEO_MUTATION = gql`
  mutation NEW_VIDEO_MUTATION($youtubeId: String!) {
    createVideo(youtubeId: $youtubeId) {
      id
      title
      thumbnailUrl
    }
  }
`;

class NewVideo extends Component {
  state = {
    youtubeId: '',
  };

  handleChange = e => {
    this.setState({ youtubeId: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={NEW_VIDEO_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: ALL_VIDEOS_QUERY }]}
      >
        {(createVideo, { loading, error }) => (
          <Form
            data-test="form"
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // call the mutation
              const res = await createVideo();
              console.log(res);
              // const res = await createVideo();
              // change them to the single item page
              Router.push({
                pathname: '/watch',
              });
              // Router.push({
              //   pathname: '/watch',
              //   query: { id: res.data.createVideo.id },
              // });
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
                  value={this.state.youtubeId}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default NewVideo;
