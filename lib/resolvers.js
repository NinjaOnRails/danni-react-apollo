import gql from 'graphql-tag';
import { CONTENT_LANGUAGE_QUERY, LOCAL_STATE_QUERY } from '../graphql/query';

const data = {
  showSide: false,
  reloadingPage: false,
  contentLanguage: [],
  hideSigninToComment: true,
  previousPage: null,
};

const typeDefs = gql`
  extend type Query {
    showSide: Boolean!
    contentLanguage: [String]
    hideSigninToComment: Boolean!
    previousPage: String
  }
`;

const resolvers = {
  Mutation: {
    toggleSideDrawer: (_root, variables, { cache }) => {
      const { showSide } = cache.readQuery({
        query: LOCAL_STATE_QUERY,
      });
      const data = {
        data: {
          showSide: !showSide,
        },
      };
      cache.writeData(data);
      return data;
    },
    closeSideDrawer: (_root, variables, { cache }) => {
      const data = {
        data: {
          showSide: false,
        },
      };
      cache.writeData(data);
      return data;
    },
    toggleContentLanguage: (_root, { language }, { cache }) => {
      const { contentLanguage } = cache.readQuery({
        query: CONTENT_LANGUAGE_QUERY,
      });
      const foundIndex = contentLanguage.indexOf(language);
      if (foundIndex === -1) {
        contentLanguage.push(language.toUpperCase());
      } else {
        contentLanguage.splice(foundIndex, 1);
      }
      if (contentLanguage.length) {
        localStorage.setItem('contentLanguage', contentLanguage.join());
        const data = {
          data: {
            contentLanguage,
          },
        };
        cache.writeData(data);
        return data;
      }
      return null;
    },
    addContentLanguage: (_root, { language }, { cache }) => {
      const { contentLanguage } = cache.readQuery({
        query: CONTENT_LANGUAGE_QUERY,
      });
      const foundInLocalState = contentLanguage.indexOf(language);
      if (foundInLocalState === -1) {
        contentLanguage.push(language.toUpperCase());
        localStorage.setItem('contentLanguage', contentLanguage.join());
        const data = {
          data: {
            contentLanguage,
          },
        };
        cache.writeData(data);
        return data;
      }
      return null;
    },
  },
};

export { typeDefs, resolvers, data };
