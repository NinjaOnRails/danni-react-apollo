import { Placeholder } from 'semantic-ui-react';

const VideosLoading = () => (
  <>
    {[...Array(12)].map((x, i) => (
      <span key={i}>
        <Placeholder>
          <Placeholder.Image />
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
