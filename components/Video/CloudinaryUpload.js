import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Loader, Progress, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Error from '../ui/ErrorMessage';
import { CURRENT_USER_QUERY } from '../Authentication/User';

const CLOUDINARY_AUTH = gql`
  query CLOUDINARY_AUTH($source: String!, $language: Language) {
    cloudinaryAuth(source: $source, language: $language) {
      signature
      timestamp
    }
  }
`;

class CloudinaryUpload extends Component {
  state = {
    startingUpload: false,
  };

  render() {
    const {
      source,
      language,
      onUploadFileSubmit,
      uploadProgress,
      uploadError,
      deleteToken,
      onDeleteFileSubmit,
      secureUrl,
      handleChange,
      audioSource,
      onAudioLoadedMetadata,
    } = this.props;
    return (
      <Query
        query={CLOUDINARY_AUTH}
        variables={{
          source,
          language,
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Loader inline="centered" active />;
          if (error) return <Error>Error: {error.message}</Error>;
          return (
            <>
              {(uploadError && (
                <Progress percent={100} error>
                  Network Error. Try again later.
                </Progress>
              )) ||
                (uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress percent={uploadProgress} progress success />
                )) ||
                (secureUrl && (
                  <>
                    <p>Uploaded File:</p>
                    <audio
                      controls
                      src={secureUrl}
                      onLoadedMetadata={e => onAudioLoadedMetadata(e)}
                    >
                      <track kind="captions" />
                    </audio>
                    <Button negative onClick={onDeleteFileSubmit} type="button">
                      Remove
                    </Button>
                  </>
                )) ||
                ((this.state.startingUpload || deleteToken) && (
                  <Loader inline="centered" active />
                )) || (
                  <Query query={CURRENT_USER_QUERY}>
                    {({
                      data: {
                        currentUser: { id },
                      },
                    }) => (
                      <>
                        <label htmlFor="file">
                          Choose a Local File:
                          <input
                            type="file"
                            id="file"
                            name="file"
                            accept=".mp3,.aac,.aiff,.amr,.flac,.m4a,.ogg,.wav"
                            onChange={async e => {
                              this.setState({ startingUpload: true });
                              await onUploadFileSubmit(
                                data.cloudinaryAuth,
                                id,
                                e
                              );
                              this.setState({ startingUpload: false });
                            }}
                          />
                        </label>
                        OR
                        <label htmlFor="audioSource">
                          Provide a Direct Link:
                          <Button
                            type="button"
                            floated="right"
                            primary
                            onClick={async () => {
                              this.setState({ startingUpload: true });
                              await onUploadFileSubmit(data.cloudinaryAuth, id);
                              this.setState({ startingUpload: false });
                            }}
                          >
                            <Icon name="upload" />
                            Upload
                          </Button>
                          <input
                            type="text"
                            name="audioSource"
                            value={audioSource}
                            onChange={handleChange}
                          />
                        </label>
                      </>
                    )}
                  </Query>
                )}
            </>
          );
        }}
      </Query>
    );
  }
}

CloudinaryUpload.propTypes = {
  source: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  deleteToken: PropTypes.string.isRequired,
  secureUrl: PropTypes.string.isRequired,
  uploadError: PropTypes.bool.isRequired,
  onUploadFileSubmit: PropTypes.func.isRequired,
  onDeleteFileSubmit: PropTypes.func.isRequired,
  uploadProgress: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  onAudioLoadedMetadata: PropTypes.func.isRequired,
  audioSource: PropTypes.string.isRequired,
};

export default CloudinaryUpload;