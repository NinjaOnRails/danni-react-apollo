import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Loader, Progress, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const CLOUDINARY_AUTH = gql`
  query CLOUDINARY_AUTH($source: String!, $language: Language) {
    cloudinaryAuth(source: $source, language: $language) {
      signature
      timestamp
    }
  }
`;

class CloudinaryUpload extends Component {
  render() {
    const {
      source,
      language,
      uploadFile,
      uploadProgress,
      uploadError,
      deleteToken,
      deleteFile,
      secureUrl,
    } = this.props;
    return (
      <Query query={CURRENT_USER_QUERY}>
        {({
          data: {
            currentUser: { id },
          },
        }) => (
          <Query
            query={CLOUDINARY_AUTH}
            variables={{
              source,
              language,
            }}
          >
            {({ loading, error, data }) => {
              if (loading) return <Loader active />;
              if (error) return <Error>Error: {error.message}</Error>;
              return (
                <>
                  <label htmlFor="file">
                    Tải lên
                    <input
                      type="file"
                      id="file"
                      name="file"
                      accept=".mp3,.aac,.aiff,.amr,.flac,.m4a,.ogg,.wav"
                      onChange={e => uploadFile(data.cloudinaryAuth, id, e)}
                    />
                  </label>
                  {(uploadError && (
                    <Progress percent={100} error>
                      Network Error. Try again later.
                    </Progress>
                  )) ||
                    (uploadProgress > 0 && (
                      <Progress percent={uploadProgress} progress success />
                    ))}
                  {secureUrl && <audio controls src={secureUrl} />}
                  {deleteToken && (
                    <Button negative onClick={deleteFile} type="button">
                      Xoá file
                    </Button>
                  )}
                </>
              );
            }}
          </Query>
        )}
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
  uploadFile: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  uploadProgress: PropTypes.number.isRequired,
};

export default CloudinaryUpload;
