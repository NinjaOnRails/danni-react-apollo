import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import { adopt } from 'react-adopt';
import ContentLanguageMenu from './ContentLanguageMenu';
// import ContentLanguageMenu from './ContentLanguageMenuRefactored';
import User from '../Authentication/User';
import { CONTENT_LANGUAGE_QUERY } from '../../graphql/query';
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
      return render({ contentLanguage });
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

const toggleContentLanguage = ({ render }) => {
  return (
    <Mutation mutation={TOGGLE_CONTENT_LANGUAGE_MUTATION}>{render}</Mutation>
  );
};

const addContentLanguage = ({ render }) => {
  return <Mutation mutation={ADD_CONTENT_LANGUAGE_MUTATION}>{render}</Mutation>;
};
/* eslint-enable */

const Composed = adopt({
  user,
  client,
  contentLanguageQuery,
  updateContentLanguageMutation,
  toggleContentLanguage,
  addContentLanguage,
});

const ContentLanguage = props => {
  return (
    <Composed>
      {({
        user: { currentUser, loading },
        client: apolloClient,
        contentLanguageQuery: { contentLanguage },
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
            {...props}
          />
        );
      }}
    </Composed>
  );
};

export default ContentLanguage;
export { client, contentLanguageQuery, user };
