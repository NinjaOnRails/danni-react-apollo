import PropTypes from 'prop-types';
import { BackdropStyles } from '../../styles/MobileUiStyles';

const Backdrop = ({ show, clicked }) =>
  show ? <BackdropStyles onClick={clicked} show /> : null;

Backdrop.defaultProps = {
  show: false,
};

Backdrop.propTypes = {
  show: PropTypes.bool,
  clicked: PropTypes.func.isRequired,
};

export default Backdrop;