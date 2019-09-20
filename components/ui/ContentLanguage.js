import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import { adopt } from 'react-adopt';
import ContentLanguageMenu from './ContentLanguageMenu';
import User from '../Authentication/User';
import {
  ALL_AUDIOS_QUERY,
  ALL_VIDEOS_QUERY,
  CONTENT_LANGUAGE_QUERY,
} from '../../graphql/query';
import {
  TOGGLE_CONTENT_LANGUAGE_MUTATION,
  ADD_CONTENT_LANGUAGE_MUTATION,
  UPDATE_CONTENT_LANGUAGE_MUTATION,
} from '../../graphql/mutation';

/* eslint-disable */
const client = ({ render }) => <ApolloConsumer>{render}</ApolloConsumer>;

const user = ({ render }) => (
  <User>
    {({ data, loading }) => {
      const currentUser = data ? data.currentUser : null;
      return render({ currentUser, loading });
    }}
  </User>
);

const contentLanguageQuery = ({ render }) => (
  <Query query={CONTENT_LANGUAGE_QUERY}>
    {({ data }) => {
      const contentLanguage = data ? data.contentLanguage : [];
      const reloadingPage = data ? data.reloadingPage : false;
      return render({ contentLanguage, reloadingPage });
    }}
  </Query>
);

const updateContentLanguageMutation = ({ render }) => (
  <Mutation mutation={UPDATE_CONTENT_LANGUAGE_MUTATION}>
    {(updateContentLanguage, { loading: loadingUpdate, error }) => {
      return render({ updateContentLanguage, loadingUpdate, error });
    }}
  </Mutation>
);

const toggleContentLanguage = ({
  contentLanguageQuery: { contentLanguage },
  render,
}) => {
  return (
    <Mutation
      mutation={TOGGLE_CONTENT_LANGUAGE_MUTATION}
      // refetchQueries={[
      //   {
      //     query: ALL_AUDIOS_QUERY,
      //     variables: { contentLanguage },
      //   },
      //   {
      //     query: ALL_VIDEOS_QUERY,
      //     variables: { contentLanguage },
      //   },
      // ]}
    >
      {render}
    </Mutation>
  );
};

const addContentLanguage = ({
  contentLanguageQuery: { contentLanguage },
  render,
}) => {
  return (
    <Mutation
      mutation={ADD_CONTENT_LANGUAGE_MUTATION}
      // refetchQueries={[
      //   {
      //     query: ALL_AUDIOS_QUERY,
      //     variables: { contentLanguage },
      //   },
      //   {
      //     query: ALL_VIDEOS_QUERY,
      //     variables: { contentLanguage },
      //   },
      // ]}
    >
      {render}
    </Mutation>
  );
};

const Composed = adopt({
  user,
  client,
  contentLanguageQuery,
  updateContentLanguageMutation,
  toggleContentLanguage,
  addContentLanguage,
});
/* eslint-enable */

const ContentLanguage = props => {
  return (
    <Composed>
      {({
        user: { currentUser, loading },
        client: apolloClient,
        contentLanguageQuery: { contentLanguage, reloadingPage },
        updateContentLanguageMutation: {
          updateContentLanguage,
          loading: loadingUpdate,
          error,
        },
        toggleContentLanguage,
        addContentLanguage,
      }) => {
        return (
          <ContentLanguageMenu
            toggleContentLanguage={toggleContentLanguage}
            addContentLanguage={addContentLanguage}
            contentLanguage={contentLanguage}
            client={apolloClient}
            currentUser={currentUser}
            updateContentLanguage={updateContentLanguage}
            loadingUpdate={loadingUpdate}
            loadingUser={loading}
            reloadingPage={reloadingPage}
            {...props}
          />
        );
      }}
    </Composed>
  );
};

export default ContentLanguage;
export { client, contentLanguageQuery, user };
