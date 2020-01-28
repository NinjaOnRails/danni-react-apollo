import { Form, Button, Icon, Segment, Header } from 'semantic-ui-react';
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
  setCusThumbnailUrl,
}) => {
  const handleChange = ({ target: { name, value } }) =>
    setAddVideoState({ [name]: value });
  return (
    <>
      <Form.Input
        required
        label="Tiêu đề"
        value={title}
        onChange={handleChange}
        name="title"
        placeholder="bắt buộc"
        maxLength="100"
      />
      <CloudinaryUploadCusThumbnail
        setCusThumbnailUrl={setCusThumbnailUrl}
        youtubeId={youtubeId}
        language={language}
      />
      <Form.TextArea
        label="Giới thiệu"
        value={description}
        onChange={handleChange}
        name="description"
        maxLength="5000"
      />
      <Form.Input
        label="Tags"
        value={tags}
        onChange={handleChange}
        name="tags"
        maxLength="500"
      />
      {originTags.length > 0 && (
        <Segment>
          <Header as="h4">Tags của Video gốc:</Header>
          {originTags.join(' ')}
        </Segment>
      )}
      <div className="buttons">
        <Button
          size="big"
          icon
          labelPosition="left"
          onClick={() => setAddVideoState({ activeStep: 'audio' })}
        >
          Quay lại
          <Icon name="left arrow" />
        </Button>
        <Button type="submit" size="big" icon labelPosition="right" primary>
          Xác nhận
          <Icon name="check" />
        </Button>
      </div>
    </>
  );
};

DetailsForm.propTypes = {
  setAddVideoState: PropTypes.func.isRequired,
  setCusThumbnailUrl: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  youtubeId: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  originTags: PropTypes.arrayOf(string),
};

DetailsForm.defaultProps = {
  originTags: [],
};

export default DetailsForm;
