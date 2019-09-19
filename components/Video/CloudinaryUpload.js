import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { Loader, Progress, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import Error from '../UI/ErrorMessage';
import { CLOUDINARY_AUTH } from '../../graphql/query';
import { user } from '../UI/ContentLanguage';

const cloudinaryAuth = ({ source, language, render }) => (
  <Query
    query={CLOUDINARY_AUTH}
    variables={{
      source,
      language,
    }}
  >
    {render}
  </Query>
);

const Composed = adopt({
  cloudinaryAuth,
  user,
});

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
      <Composed source={source} language={language}>
        {({
          cloudinaryAuth: { loading, error, data },
          user: { currentUser, loading: loadingUser },
        }) => {
          if (loading || loadingUser)
            return <Loader inline="centered" active />;
          if (error) return <Error>Error: {error.message}</Error>;
          const { id } = currentUser;

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
                          await onUploadFileSubmit(data.cloudinaryAuth, id, e);
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
            </>
          );
        }}
      </Composed>
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
