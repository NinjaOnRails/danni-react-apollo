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
        label="Tiêu đề"
        defaultValue={title}
        onChange={handleChange}
        name="title"
        placeholder="bắt buộc"
        maxLength="100"
      />
      {editVideo && oldCusThumbnail && !cusThumbnailSecUrl && (
        <>
          <Header as="h3" content="Ảnh thu nhỏ hiện tại:" />
          <Image src={oldCusThumbnail} size="tiny" />
        </>
      )}
      <Header as="h3" content={editVideo ? 'Tải ảnh mới:' : 'Ảnh thu nhỏ:'} />
      {(editVideo && showUploadThumbnail) || !editVideo ? (
        <>
          <CloudinaryUploadCusThumbnail
            setCusThumbnailUrl={setCusThumbnailUrl}
            youtubeId={youtubeId}
            language={language}
          />
        </>
      ) : (
        <Message warning visible>
          <p>
            Tải tệp file mới lên sẽ lập tức xoá vĩnh viễn tệp cũ.
            <Button
              content="Tiếp tục"
              negative
              onClick={() => setAddVideoState({ showUploadThumbnail: true })}
            />
          </p>
        </Message>
      )}
      <Form.TextArea
        label="Giới thiệu"
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
          <Header as="h4">Tags của Video gốc:</Header>
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
            Quay lại
            <Icon name="left arrow" />
          </Button>
          <Button type="submit" size="big" icon labelPosition="right" primary>
            Xác nhận
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
