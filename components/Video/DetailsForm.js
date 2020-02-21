import {
  Form,
  Button,
  Icon,
  Segment,
  Header,
  Image,
  Message,
} from 'semantic-ui-react';
import PropTypes, { string } from 'prop-types';
import CloudinaryUploadCusThumbnail from './CloudinaryUploadCusThumbnail';

const DetailsForm = ({
  setAddVideoState,
  title,
  description,
  tags,
  originTags,
  youtubeId,
  language,
  cusThumbnailSecUrl,
  oldCusThumbnail,
  showUploadThumbnail,
  editVideo,
}) => {
  const handleChange = ({ target: { name, value } }) =>
    setAddVideoState({ [name]: value });

  const setCusThumbnailUrl = (url, token) =>
    setAddVideoState({ cusThumbnailSecUrl: url, cusThumbnailDelToken: token });
  return (
    <>
      <Form.Input
        required
        label="Title"
        defaultValue={title}
        onChange={handleChange}
        name="title"
        placeholder="required"
        maxLength="100"
      />
      {editVideo && oldCusThumbnail && !cusThumbnailSecUrl && (
        <>
          <Header as="h3" content="Thumbnail:" />
          <Image src={oldCusThumbnail} size="tiny" />
        </>
      )}
      <Header as="h3" content="Thumbnail:" />
      {(editVideo && showUploadThumbnail) || !editVideo ? (
        <>
          <CloudinaryUploadCusThumbnail
            setCusThumbnailUrl={setCusThumbnailUrl}
            oldCusThumbnail={oldCusThumbnail}
            youtubeId={youtubeId}
            language={language}
          />
        </>
      ) : (
        <Message warning visible>
          <p>
            Uploading a new file will immediately permanently delete the current
            file.
            <Button
              content="Continue"
              negative
              onClick={() => setAddVideoState({ showUploadThumbnail: true })}
            />
          </p>
        </Message>
      )}
      <Form.TextArea
        label="Description"
        defaultValue={description}
        onChange={handleChange}
        name="description"
        maxLength="5000"
      />
      <Form.Input
        label="Tags"
        defaultValue={tags}
        onChange={handleChange}
        name="tags"
        maxLength="500"
      />
      {(originTags.length > 0 || editVideo) && (
        <Segment>
          <Header as="h4">Source tags:</Header>
          {originTags.join(' ')}
        </Segment>
      )}
      {!editVideo && (
        <div className="buttons">
          <Button
            size="big"
            icon
            labelPosition="left"
            onClick={() => setAddVideoState({ activeStep: 'audio' })}
          >
            Back
            <Icon name="left arrow" />
          </Button>
          <Button type="submit" size="big" icon labelPosition="right" primary>
            Submit
            <Icon name="check" />
          </Button>
        </div>
      )}
    </>
  );
};

DetailsForm.propTypes = {
  setAddVideoState: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  youtubeId: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  originTags: PropTypes.arrayOf(string),
  cusThumbnailSecUrl: PropTypes.string,
  oldCusThumbnail: PropTypes.string,
  showUploadThumbnail: PropTypes.bool,
  editVideo: PropTypes.bool,
};

DetailsForm.defaultProps = {
  originTags: [],
  editVideo: false,
  showUploadThumbnail: false,
  cusThumbnailSecUrl: '',
  oldCusThumbnail: '',
};

export default DetailsForm;
