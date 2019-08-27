import React from 'react';
import Link from 'next/link';
import MobileNavStyles from './styles/MobileNavStyles';
import User from './User';
import Signout from './Signout';

const links = [
  { name: 'HOME', href: '/', alwaysVisible: 0 },
  { name: 'VIDEO+', href: '/new', alwaysVisible: 0 },
  { name: 'ABOUT', href: '/about', alwaysVisible: 0 },
  { name: 'Đăng Ký', href: '/signup', alwaysVisible: 1 },
  { name: 'Đăng Nhập', href: '/signin', alwaysVisible: 1 },
  { name: 'Thoat', href: '/signout', alwaysVisible: 2 },
];

class MobileNav extends React.Component {
  state = {
    menuOpen: false,
  };

  shouldComponentUpdate() {
    return false;
  }

  handleClick() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  handleLinkClick() {
    this.setState({ menuOpen: false });
  }

  renderLinks(currentUser) {
    console.log('render links');
    return links.map(({ name, href, alwaysVisible }) => {
      if (alwaysVisible === 0 || currentUser === alwaysVisible) {
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
            <MobileNavStyles
              data-test='nav'
              menuOpen={this.state.menuOpen}
              onClick={() => this.handleClick()}
            >
              <li>
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
