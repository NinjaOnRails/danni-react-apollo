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
                <a>Trang chủ</a>
              </Link>
            </li>

            <li>
              <Link href="/about">
                <a>Giới thiệu</a>
              </Link>
            </li>

            {currentUser ? (
              <>
                <li>
                  <Link href="/me">
                    <a>Tài khoản</a>
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
                    <a>Đăng Nhập</a>
                  </Link>
                </li>
                <li className="signup">
                  <Link href="/signup">
                    <a>Đăng Ký</a>
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
              <Icon name="plus" /> Thêm Video
            </Button>
          </Link>
        </div>
      </div>
    </StyledHeader>
  );
};

export default Header;
