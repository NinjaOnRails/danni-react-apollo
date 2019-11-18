import { useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import StyledContainer from '../styles/GDPRStyles';

const GDPR = () => {
  const [open, setOpen] = useState(true);

  return (
    <StyledContainer open={open}>
      <div className="banner">
        <div className="text">
          To help personalize content, tailor and measure ads, and provide a
          safer experience, we use cookies. By clicking or navigating the site,
          you agree to allow our collection of information on and off Danni.tv
          through cookies. Learn more, including about available controls:{' '}
          <a href="/">Cookies Policy</a>.
        </div>
      </div>
      <Button icon onClick={() => setOpen(false)}>
        <Icon name="close" size="big" Ï />
      </Button>
    </StyledContainer>
  );
};

export default GDPR;
