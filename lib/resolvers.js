import gql from 'graphql-tag';
import { LOCAL_STATE_QUERY } from '../components/UI/Mobile/SideDrawer';
import { CONTENT_LANGUAGE_QUERY } from '../components/UI/ContentLanguage';

const data = {
  showSide: false,
  contentLanguage: [],
};

const typeDefs = gql`
  extend type Query {
    showSide: Boolean!
    contentLanguage: [String!]!
  }
`;

const resolvers = {
  Mutation: {
    toggleSideDrawer: (_, variables, { cache }) => {
      const { showSide } = cache.readQuery({
        query: LOCAL_STATE_QUERY,
      });
      cache.writeData({
        data: {
          showSide: !showSide,
        },
      });
      return null;
    },
    closeSideDrawer: (_, variables, { cache }) => {
      cache.writeData({
        data: {
          showSide: false,
        },
      });
      return null;
    },
    toggleContentLanguage: (_, { language }, { cache }) => {
      const { contentLanguage } = cache.readQuery({
        query: CONTENT_LANGUAGE_QUERY,
      });
      const foundIndex = contentLanguage.indexOf(language);
      if (foundIndex === -1) {
        contentLanguage.push(language.toUpperCase());
      } else {
        contentLanguage.splice(foundIndex, 1);
      }
      localStorage.setItem('contentLanguage', contentLanguage.join());
      cache.writeData({
        data: {
          contentLanguage,
        },
      });
      return { contentLanguage };
    },
  },
};

export { typeDefs, resolvers, data };
