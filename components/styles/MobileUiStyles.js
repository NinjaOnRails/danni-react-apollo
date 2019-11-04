import styled from 'styled-components';

export const BackdropStyles = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  background-color: ${props => props.theme.pureBlack};
  opacity: 0.7;
`;

export const SideDrawerStyles = styled.div`
  .SideDrawer {
    position: fixed;
    width: 40%;
    max-width: 70%;
    height: 100%;
    right: 0;
    top: 0;
    z-index: 200;
    background-color: ${props => props.theme.darkGrey};
    box-sizing: border-box;
    transition: transform 0.3s ease-out;
  }
  .links {
    .ui.vertical.icon.menu {
      width: 100%;
    }
    .link-container {
      display: flex;
      margin-left: 1.5rem;
      align-items: center;
    }
    .link-name {
      margin-left: 2rem;
      text-align: left;
      width: 60%;
      text-transform: uppercase;
      height: 100%;
      font-size: 1rem;
    }

    .ui.menu .item {
      padding: 2rem 0;
      width: 100%;
    }
    i.large.icon,
    i.large.icons {
      width: 20px;
    }
  }

  .Open {
    transform: translateX(0);
  }
  .Close {
    transform: translateX(100%);
  }
  @media (min-width: 640px) {
    .SideDrawer {
      display: none;
    }
  }
`;

export const StyledMobileSearch = styled.div`
  && {
    margin: auto 5px;
    box-sizing: border-box;
    height: 30px;
    @media (min-width: 673px) {
      display: none;
    }
  }
  .ui.input > input {
    padding: 0;
    padding-left: 0.5em;
    width: 100%;
  }
`;

export const DrawerToggleStyles = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: auto 0;
  i.icon {
    margin: 0;
  }
  i.large.icon,
  i.large.icons {
    font-size: 2.5em;
  }
  @media (min-width: 640px) {
    display: none;
  }
`;
