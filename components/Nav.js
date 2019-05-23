import Link from 'next/link';
// import { Mutation } from 'react-apollo';
import NavStyles from './styles/NavStyles';
// import User from './User';
// import Signout from './Signout';

const Nav = () => (
  <NavStyles>
    <Link href="/">
      <a>Home</a>
    </Link>
    {/* <Link href="/browse">
      <a>Watch</a>
    </Link> */}
    <Link href="/new">
      <a>Add Video</a>
    </Link>
    {/* <Link href="/signin">
      <a>Sign In</a>
    </Link> */}
    <Link href="/about">
      <a>About</a>
    </Link>
  </NavStyles>
  // <User>
  //   {({ data }) => {
  //     const me = data ? data.me : null;
  //     return (
  //       <NavStyles data-test="nav">
  //         {me && (
  //           <>
  //             <Link href="/me">
  //               <a>Account</a>
  //             </Link>
  //             <Signout />
  //           </>
  //         )}
  //         {!me && (
  //           <Link href="/signup">
  //             <a>Sign In</a>
  //           </Link>
  //         )}
  //       </NavStyles>
  //     );
  //   }}
  // </User>
);

export default Nav;
