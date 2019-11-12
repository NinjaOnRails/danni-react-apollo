import ApolloConsumer from 'react-apollo';
import ContentLanguageMenu from './ContentLanguageMenu';
import {
  useCurrentUserQuery,
  useLocalStateQuery,
} from '../Authentication/authHooks';
import {
  useToggleContentLanguageMutation,
  useAddContentLanguageMutation,
  useUpdateContentLanguageMutation,
} from './uiHooks';

const ContentLanguage = props => {
  const { currentUser, loading } = useCurrentUserQuery();
  const { contentLanguage } = useLocalStateQuery();
  const [toggleContentLanguage] = useToggleContentLanguageMutation();
  const [addContentLanguage] = useAddContentLanguageMutation();
  const [
    updateContentLanguage,
    { loading: loadingUpdate, error },
  ] = useUpdateContentLanguageMutation();
  return (
    <ApolloConsumer>
      {client => {
        return (
          <ContentLanguageMenu
            toggleContentLanguage={toggleContentLanguage}
            addContentLanguage={addContentLanguage}
            contentLanguage={contentLanguage}
            client={client}
            currentUser={currentUser}
            updateContentLanguage={updateContentLanguage}
            loadingUpdate={loadingUpdate}
            loadingUser={loading}
            {...props}
          />
        );
      }}
    </ApolloConsumer>
  );
};

export default ContentLanguage;
