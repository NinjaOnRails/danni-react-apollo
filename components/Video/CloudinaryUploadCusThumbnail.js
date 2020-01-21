import React, { Component } from 'react';
import { Query } from 'react-apollo';
import {
  Loader,
  Progress,
  Button,
  Icon,
  Image,
  Input,
  Header,
  Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import axios from 'axios';
import Error from '../UI/ErrorMessage';
import { CLOUDINARY_CUSTOM_THUMBNAIL } from '../../graphql/query';
import { user } from '../UI/ContentLanguage';
import { uploadCusThumbnail } from '../../lib/cloudinaryUpload';
import deleteFile from '../../lib/cloudinaryDeleteFile';

const cloudinaryAuthCusThumbnail = ({ youtubeId, render }) => (
  <Query query={CLOUDINARY_CUSTOM_THUMBNAIL} variables={{ youtubeId }}>
    {render}
  </Query>
);

const Composed = adopt({
  cloudinaryAuthCusThumbnail,
  user,
});

class CloudinaryUploadCusThumbnail extends Component {
  state = {
    startingUpload: false,
    uploadError: false,
    uploadProgress: 0,
    secureUrl: '',
    deleteToken: '',
    uploadImageUrl: '',
  };

  fileInputRef = React.createRef();

  componentDidMount = () => {
    const { oldCusThumbnail } = this.props;
    if (oldCusThumbnail) this.setState({ secureUrl: oldCusThumbnail });
  };

  handleChange = ({ target: { name, value } }) => {
    // Controlled set state
    this.setState({ [name]: value });
  };

  onUploadFileSubmit = async (cloudinaryAuthCusThumbnail, id, e) => {
    const { setCusThumbnailUrl, youtubeId } = this.props;
    // Reset uploadError display and assign appropriate value to file
    this.setState({ uploadError: false });
    const { deleteToken, uploadImageUrl } = this.state;
    const file = e ? e.target.files[0] : uploadImageUrl;

    if (!file) return; // Do nothing if no file selected

    if (deleteToken) await this.onDeleteFileSubmit();

    // More initial state reset
    this.setState({
      uploadProgress: 0,
      deleteToken: '',
      secureUrl: '',
    });

    // Prepare cloudinary upload params
    const { url, data } = uploadCusThumbnail(
      file,
      id,
      cloudinaryAuthCusThumbnail,
      youtubeId
    );

    // Upload file with post request
    try {
      const {
        data: { secure_url: secureUrl, delete_token: newDeleteToken },
      } = await axios({
        method: 'post',
        url,
        data,
        onUploadProgress: p => {
          // Show upload progress
          this.setState({
            uploadProgress: Math.floor((p.loaded / p.total) * 100),
          });
        },
      });
      setCusThumbnailUrl(secureUrl, newDeleteToken);
      this.setState({
        secureUrl,
        deleteToken: newDeleteToken,
      });
    } catch {
      this.setState({
        uploadError: true,
      });
    }
  };

  onDeleteFileSubmit = async () => {
    const { deleteToken } = this.state;
    this.setState({
      uploadProgress: 0,
      secureUrl: '',
    });

    const res = await deleteFile(deleteToken);
    if (res.status === 200) {
      this.setState({
        deleteToken: '',
      });
    }
  };

  render() {
    const {
      uploadProgress,
      uploadError,
      secureUrl,
      startingUpload,
    } = this.state;
    const { youtubeId } = this.props;
    return (
      <Composed youtubeId={youtubeId}>
        {({
          cloudinaryAuthCusThumbnail: { loading, error, data },
          user: { currentUser, loading: loadingUser },
        }) => {
          if (loading || loadingUser)
            return <Loader inline="centered" active />;
          if (error) return <Error error={error} />;
          const { id } = currentUser;

          return (
            <Segment
              attached
              loading={
                startingUpload &&
                !uploadError &&
                !(uploadProgress > 0 && uploadProgress < 100)
              }
            >
              {(!uploadError && uploadProgress > 0 && uploadProgress < 100 && (
                <Progress percent={uploadProgress} progress success />
              )) ||
                (secureUrl && (
                  <>
                    <Header as="h3">Ảnh được tải lên:</Header>
                    <Button
                      negative
                      onClick={this.onDeleteFileSubmit}
                      type="button"
                    >
                      Xoá
                    </Button>
                    <Image src={secureUrl} />
                  </>
                )) || (
                  <>
                    {uploadError && (
                      <Progress percent={100} error>
                        Lỗi mạng hoặc ảnh có vấn đề. Vui lòng thử sau.
                      </Progress>
                    )}
                    <Button
                      type="button"
                      positive
                      size="huge"
                      className="choose-file-button"
                      content="Chọn ảnh trong máy"
                      labelPosition="left"
                      icon="file image"
                      onClick={() => {
                        this.fileInputRef.current.click();
                      }}
                    />
                    <input
                      hidden
                      ref={this.fileInputRef}
                      type="file"
                      id="file"
                      name="file"
                      accept=".jpg,.png"
                      onChange={async e => {
                        this.setState({ startingUpload: true });
                        await this.onUploadFileSubmit(
                          data.cloudinaryAuthCusThumbnail,
                          id,
                          e
                        );
                        this.setState({ startingUpload: false });
                      }}
                    />
                    <Header>hoặc</Header>
                    <Header as="h3">Tải từ đường link:</Header>
                    <div className="uploadImageUrl">
                      <Input
                        label="URL"
                        placeholder="file.jpg"
                        type="text"
                        id="uploadImageUrl"
                        name="uploadImageUrl"
                        onChange={this.handleChange}
                      />
                      <Button
                        positive
                        onClick={async () => {
                          this.setState({ startingUpload: true });
                          await this.onUploadFileSubmit(
                            data.cloudinaryAuthCusThumbnail,
                            id
                          );
                          this.setState({ startingUpload: false });
                        }}
                      >
                        <Icon name="upload" />
                        Tải lên
                      </Button>
                    </div>
                  </>
                )}
            </Segment>
          );
        }}
      </Composed>
    );
  }
}

CloudinaryUploadCusThumbnail.propTypes = {
  setCusThumbnailUrl: PropTypes.func.isRequired,
  youtubeId: PropTypes.string.isRequired,
  oldCusThumbnail: PropTypes.string,
};

CloudinaryUploadCusThumbnail.defaultProps = {
  oldCusThumbnail: undefined,
};

export default CloudinaryUploadCusThumbnail;
