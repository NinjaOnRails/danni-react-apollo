import { Placeholder } from 'semantic-ui-react';

const VideosLoading = () => (
  <>
    {[...Array(30)].map((x, i) => (
      <span key={i}>
        <Placeholder fluid>
          <Placeholder.Image rectangular />
          <Placeholder.Paragraph>
            <Placeholder.Line length="very long" />
            <Placeholder.Line length="short" />
            <Placeholder.Line length="medium" />
          </Placeholder.Paragraph>
        </Placeholder>
      </span>
    ))}
  </>
);

export default VideosLoading;
