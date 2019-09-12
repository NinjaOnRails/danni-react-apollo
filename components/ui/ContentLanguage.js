import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import { Loader } from 'semantic-ui-react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import ContentLanguageMenu from './ContentLanguageMenu';
import User from '../Authentication/User';

const TOGGLE_CONTENT_LANGUAGE_MUTATION = gql`
  mutation toggleContentLanguage($language: String!) {
    toggleContentLanguage(language: $language) @client
  }
`;

const UPDATE_CONTENT_LANGUAGE_MUTATION = gql`
  mutation updateContentLanguage($contentLanguage: [Language]) {
    updateContentLanguage(contentLanguage: $contentLanguage) {
      id
      contentLanguage
    }
  }
`;

const ALL_VIDEOS_QUERY = gql`
  query ALL_VIDEOS_QUERY($contentLanguage: [Language!]) {
    videos(where: { language_in: $contentLanguage }, orderBy: createdAt_DESC) {
      id
      originThumbnailUrl
      originThumbnailUrlSd
      originTitle
      duration
      originAuthor
      originViewCount
      addedBy {
        displayName
      }
      audio {
        id
        title
        author {
          displayName
        }
      }
    }
  }
`;

const ALL_AUDIOS_QUERY = gql`
  query ALL_AUDIOS_QUERY($contentLanguage: [Language!]) {
    audios(where: { language_in: $contentLanguage }, orderBy: createdAt_DESC) {
      id
      title
      author {
        displayName
      }
      video {
        id
        originAuthor
        originThumbnailUrl
        originThumbnailUrlSd
        duration
      }
    }
  }
`;

const CONTENT_LANGUAGE_QUERY = gql`
  query {
    contentLanguage @client
  }
`;

const LanguageMenuStyles = styled.div`
  padding-top: 2rem;
  text-align: center;
  @media (max-width: 639px) {
    display: none;
  }
`;

const update = (cache, payload) => {
  const data = cache.readQuery({
    query: ALL_AUDIOS_QUERY,
  });
  // console.log(data);
};

const ContentLanguage = () => {
  return (
    <User>
      {({ data, loading }) => {
        if (loading) return <Loader active inline="centered" />;
        const currentUser = data ? data.currentUser : null;
        return (
          <ApolloConsumer>
            {client => (
              <LanguageMenuStyles>
                <Query query={CONTENT_LANGUAGE_QUERY}>
                  {({
                    data: dataContentLanguage,
                    loading: loadingLocalState,
                  }) => {
                    if (loadingLocalState)
                      return <Loader active inline="centered" />;
                    const { contentLanguage = [] } = dataContentLanguage;
                    return (
                      <Mutation
                        mutation={TOGGLE_CONTENT_LANGUAGE_MUTATION}
                        refetchQueries={[
                          { query: CONTENT_LANGUAGE_QUERY },
                          {
                            query: ALL_VIDEOS_QUERY,
                            variables: { contentLanguage },
                          },
                          {
                            query: ALL_AUDIOS_QUERY,
                            variables: { contentLanguage },
                          },
                        ]}
                        // update={update}
                      >
                        {toggleContentLanguage => (
                          <Mutation mutation={UPDATE_CONTENT_LANGUAGE_MUTATION}>
                            {(
                              updateContentLanguage,
                              { loading: loadingUpdate, error }
                            ) => (
                              <ContentLanguageMenu
                                toggleContentLanguage={toggleContentLanguage}
                                contentLanguage={contentLanguage}
                                client={client}
                                currentUser={currentUser}
                                updateContentLanguage={updateContentLanguage}
                                loadingUpdate={loadingUpdate}
                              />
                            )}
                          </Mutation>
                        )}
                      </Mutation>
                    );
                  }}
                </Query>
              </LanguageMenuStyles>
            )}
          </ApolloConsumer>
        );
      }}
    </User>
  );
};

export default ContentLanguage;
export { CONTENT_LANGUAGE_QUERY, ALL_AUDIOS_QUERY, ALL_VIDEOS_QUERY };
