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
  },
};

export { typeDefs, resolvers, data };
