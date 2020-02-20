import NProgress from 'nprogress';
import Router from 'next/router';
import Link from 'next/link';
import { Icon, Button } from 'semantic-ui-react';
import Logo from './Logo';
import Signout from '../Authentication/Signout';
import { useCurrentUserQuery } from '../Authentication/authHooks';
import StyledHeader from '../styles/HeaderStyles';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const Header = () => {
  const { currentUser } = useCurrentUserQuery();

  return (
    <StyledHeader>
      <Logo />
      <div className="bar" data-test="nav">
        <div className="nav">
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>

            <li>
              <Link href="/about">
                <a>About</a>
              </Link>
            </li>

            {currentUser ? (
              <>
                <li>
                  <Link href="/me">
                    <a>Account</a>
                  </Link>
                </li>
                <li>
                  <Signout />
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/signin">
                    <a>Log in</a>
                  </Link>
                </li>
                <li className="signup">
                  <Link href="/signup">
                    <a>Register</a>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="tools">
          {/* <Search /> */}
          <Link href="/new">
            <Button primary size="huge">
              <Icon name="plus" /> Add Video
            </Button>
          </Link>
        </div>
      </div>
    </StyledHeader>
  );
};

export default Header;
