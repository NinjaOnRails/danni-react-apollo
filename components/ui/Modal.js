import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Backdrop from './Mobile/Backdrop';

const ModalStyles = styled.div`
  .Modal {
    position: fixed;
    z-index: 500;
    background-color: #ffffff;
    width: 70%;
    /* border: 1px solid #ccc; */
    box-shadow: 1px 1px 1px black;
    /* padding: 16px; */
    padding: 0 0 16px 0;
    left: 15%;
    top: 30%;
    box-sizing: border-box;
    transition: all 0.3s ease-out;
    transform: ${props =>
      props.show ? 'translateY(0)' : 'translateY(-100vh)'};
    opacity: ${props => (props.show ? 1 : 0)};
    border-radius: 0.28571429rem;
  }

  @media (min-width: 640px) {
    .Modal {
      transition: all 0.3s ease-out;
      width: 400px;
      left: calc(50% - 200px);
      opacity: ${props => (props.show ? 1 : 0)};
    }
  }
  @media (max-width: 639px) {
    .Modal {
      transition: all 0.3s ease-out;
      transform: ${props =>
        props.show ? 'translateY(-100px)' : 'translateY(-100vh)'};
      opacity: ${props => (props.show ? 1 : 0)};
    }
  }
`;
const Modal = ({ show, closed, children }) => {
  return (
    <ModalStyles show={show}>
      <Backdrop show={show} clicked={closed} />
      <div
        className="Modal"
        // style={{
        //   transform: show ? 'translateY(0)' : 'translateY(-100vh)',
        //   opacity: show ? 1 : 0,
        // }}
      >
        {children}
      </div>
    </ModalStyles>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  closed: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Modal.defaultProps = {
  children: null,
};

export default React.memo(
  Modal,
  (prevProps, nextProps) =>
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children
);
