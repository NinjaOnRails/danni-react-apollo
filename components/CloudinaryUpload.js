import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Loader } from 'semantic-ui-react';
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
              source: this.props.source,
              language: this.props.language,
            }}
          >
            {({ loading, error, data }) => {
              if (loading) return <Loader active />;
              if (error) return <Error>Error: {error.message}</Error>;
              return (
                <label htmlFor="file">
                  Tải lên
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept=".mp3,.aac,.aiff,.amr,.flac,.m4a,.ogg,.wav"
                    onChange={e =>
                      this.props.uploadFile(data.cloudinaryAuth, id, e)
                    }
                  />
                </label>
              );
            }}
          </Query>
        )}
      </Query>
    );
  }
}

export default CloudinaryUpload;
