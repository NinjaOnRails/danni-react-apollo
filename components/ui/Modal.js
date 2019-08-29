import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Backdrop from './Backdrop';

const ModalStyles = styled.div`
  .Modal {
    position: fixed;
    z-index: 500;
    background-color: white;
    width: 70%;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 1px black;
    padding: 16px;
    left: 15%;
    top: 30%;
    box-sizing: border-box;
    transition: all 0.3s ease-out;
  }

  @media (min-width: 640px) {
    .Modal {
      width: 500px;
      left: calc(50% - 250px);
    }
  }
`;
const Modal = ({ show, closed, children }) => {
  return (
    <ModalStyles>
      <Backdrop show={show} clicked={closed} />
      <div
        className='Modal'
        style={{
          transform: show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: show ? '1' : '0',
        }}
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
    nextProps.children === prevProps.children,
);
