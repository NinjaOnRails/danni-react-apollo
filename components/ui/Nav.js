import Link from 'next/link';
import { Icon } from 'semantic-ui-react';
import NavStyles from '../styles/NavStyles';
import Signout from '../Authentication/Signout';
import { useCurrentUserQuery } from '../Authentication/authHooks';

const Nav = () => {
  const { currentUser } = useCurrentUserQuery();
  return (
    <NavStyles data-test="nav">
      <Link href="/">
        <a>Trang chủ</a>
      </Link>
      <Link href="/new">
        <a>Thêm video</a>
      </Link>
      <Link href="/me">
        <a>Tài khoản</a>
      </Link>
      {currentUser && (
        <>
          <Signout />
          {/* <Link href="/currentUser">
                <a>
                <span role="img" aria-label="account">
                🤷
                </span>
                </a>
              </Link> */}
        </>
      )}
      {/* {!currentUser && (
            <>
              <Link href="/signup">
                <a>Đăng Ký</a>
              </Link>
              <Link href="/signin">
                <a>Đăng Nhập</a>
              </Link>
            </>
          )} */}
    </NavStyles>
  );
};
export default Nav;
