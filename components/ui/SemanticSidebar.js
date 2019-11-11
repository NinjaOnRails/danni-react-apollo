import React from 'react';
import { Sidebar, Segment, Menu, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { adopt } from 'react-adopt';
import { onSignout } from '../Authentication/utils';
import ContentLanguage, { client, user } from './ContentLanguage';
import {
  SIGN_OUT_MUTATION,
  CLOSE_SIDEDRAWER_MUTATION,
} from '../../graphql/mutation';
import { localData } from '../Authentication/AuthModal';
import { openAuthModal } from '../Authentication/PleaseSignIn';
import LanguageMenuStyles from '../styles/LanguageMenuStyles';

/* eslint-disable */
const signout = ({ render }) => (
  <Mutation mutation={SIGN_OUT_MUTATION}>{render}</Mutation>
);

const closeSideDrawer = ({ render }) => (
  <Mutation mutation={CLOSE_SIDEDRAWER_MUTATION}>{render}</Mutation>
);
/* eslint-enable */

const Composed = adopt({
  closeSideDrawer,
  localData,
  user,
  client,
  signout,
  openAuthModal,
});

const SemanticSidebar = ({ children }) => (
  <Composed>
    {({
      closeSideDrawer,
      localData: { data },
      user: { currentUser },
      client,
      signout,
      openAuthModal,
    }) => (
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          onHide={closeSideDrawer}
          vertical
          visible={data.showSide}
          width="thin"
          direction="right"
        >
          <Menu.Item as="a">
            <Icon name="home" />
            Home
          </Menu.Item>
          <Menu.Item as="a">
            <Icon name="gamepad" />
            Games
          </Menu.Item>
          <Menu.Item as="a">
            <Icon name="camera" />
            Channels
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher dimmed={data.showSide}>{children}</Sidebar.Pusher>
      </Sidebar.Pushable>
    )}
  </Composed>
);

SemanticSidebar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

SemanticSidebar.defaultProps = {
  children: null,
};

export default SemanticSidebar;
