import Link from 'next/link';
import { Icon } from 'semantic-ui-react';
// import { Mutation } from 'react-apollo';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

const Nav = () => (
  <User>
    {({ data }) => {
      const currentUser = data ? data.currentUser : null;
      return (
        <NavStyles data-test="nav">
          <Link href="/">
            <a>
              <Icon name="home" size="large" />
            </a>
          </Link>
          <Link href="/new">
            <a>THÊM VIDEO</a>
          </Link>
          {/* <Link href="/about">
      <a>Info</a>
    </Link> */}
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
          {!currentUser && (
            <>
              <Link href="/signup">
                <a>Đăng Ký</a>
              </Link>
              <Link href="/signin">
                <a>Đăng Nhập</a>
              </Link>
            </>
          )}
        </NavStyles>
      );
    }}
  </User>
);

export default Nav;
