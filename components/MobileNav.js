import React from 'react';
import Link from 'next/link';
import MobileNavStyles from './styles/MobileNavStyles';
import User from './User';
import Signout from './Signout';

const links = [
  { name: 'HOME', href: '/', alwaysVisible: true },
  { name: 'VIDEO+', href: '/new', alwaysVisible: true },
  { name: 'ABOUT', href: '/about', alwaysVisible: true },
  { name: 'Đăng Ký', href: '/signup', isAuth: false },
  { name: 'Đăng Nhập', href: '/signin', isAuth: false },
  { name: 'Thoát', href: '/signout', isAuth: true },
];

class MobileNav extends React.Component {
  state = {
    menuOpen: false,
  };

  handleClick() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  handleLinkClick() {
    this.setState({ menuOpen: false });
  }

  renderLinks(currentUser) {
    return links.map(({ name, href, alwaysVisible, isAuth }) => {
      if (
        alwaysVisible ||
        ((currentUser && isAuth) || (!currentUser && !isAuth))
      ) {
        return (
          <li key={name} onClick={() => this.handleLinkClick()}>
            <Link href={href}>
              <a>{name}</a>
            </Link>
          </li>
        );
      }
    });
  }

  render() {
    return (
      <User>
        {({ data }) => {
          const currentUser = data ? data.currentUser : null;
          return (
            <MobileNavStyles data-test='nav' menuOpen={this.state.menuOpen}>
              <li onClick={() => this.handleClick()}>
                <button type='button' className='menu'>
                  MENU
                </button>
                {/* <Icon name="caret down" size="small"/> */}
                <ul>{this.renderLinks(currentUser)}</ul>
              </li>
            </MobileNavStyles>
          );
        }}
      </User>
    );
  }
}

export default MobileNav;

//  <li>
//                     <Link href='/'>
//                       <a>HOME</a>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link href='/new'>
//                       <a>VIDEO+</a>
//                     </Link>
//                   </li>
//                   <li>
//                     <Link href='/about'>
//                       <a>About</a>
//                     </Link>
//                   </li>

//                   {currentUser && (
//                     <li>
//                       <Signout />
//                       {/* <Link href="/currentUser">
//                   <a>
//                   <span role="img" aria-label="account">
//                   🤷
//                   </span>
//                   </a>
//                 </Link> */}
//                     </li>
//                   )}
//                   {!currentUser && (
//                     <>
//                       <li>
//                         <Link href='/signup'>
//                           <a>Đăng Ký</a>
//                         </Link>
//                       </li>
//                       <li>
//                         <Link href='/signin'>
//                           <a>Đăng Nhập</a>
//                         </Link>
//                       </li>
//                     </>
//                   )}
