import PropTypes from 'prop-types';
import { Dropdown, Loader, Segment, Message, Button } from 'semantic-ui-react';
import { flagOptions } from '../../lib/supportedLanguages';
import DropDownForm from '../styles/VideoFormStyles';
import CloudinaryUploadAudio from './CloudinaryUploadAudio';

const EditVideoForm = ({
  audioId,
  // default values
  oldTitleVi,
  oldDescriptionVi,
  oldDefaultVolume,
  oldOriginId,
  oldTags,
  oldAudioSource,
  oldLanguage,
  oldImage,
  oldOriginTitle,
  oldOriginChannel,
  oldOriginTags,
  // input state
  language,
  audioSource,
  secureUrl,
  uploadProgress,
  uploadError,
  deleteToken,
  youtubeId,
  // ui state
  loadingUpdateVideo,
  loadingCreateAudio,
  loadingUpdateAudio,
  isDescription,
  isAudioSource,
  isTags,
  isDefaultVolume,
  showUpload,
  // methods
  handleChange,
  handleDropdown,
  onUploadFileSubmit,
  onDeleteFileSubmit,
  onAudioLoadedMetadata,
  onShowUpload,
  // thumbnail
  image,
  originTitle,
  channelTitle,
  youtubeIdStatus,
  fetchingYoutube,
  originTags,
}) => (
  <fieldset
    disabled={loadingUpdateVideo || loadingCreateAudio || loadingUpdateAudio}
    aria-busy={loadingUpdateVideo}
  >
    Language:
    <DropDownForm>
      <Dropdown
        fluid
        selection
        options={flagOptions}
        onChange={handleDropdown}
        defaultValue={oldLanguage || ''}
        name="language"
        className="semantic-dropdown"
      />
    </DropDownForm>
    <label htmlFor="source">
      Nguồn (Link hoặc YouTube ID):
      <input
        type="text"
        id="source"
        name="source"
        required
        defaultValue={oldOriginId}
        onChange={handleChange}
      />
    </label>
    {fetchingYoutube && <Loader inline="centered" active />}
    {youtubeIdStatus && <div>{youtubeIdStatus}</div>}
    {(originTitle || oldOriginTitle) && (
      <Segment>
        <p>{originTitle || oldOriginTitle}</p>
        <p>{channelTitle || oldOriginChannel}</p>
        {(image || oldImage) && (
          <img width="200" src={image || oldImage} alt="thumbnail" />
        )}
      </Segment>
    )}
    {!audioId && (
      <label htmlFor="isAudioSource">
        <input
          id="isAudioSource"
          name="isAudioSource"
          type="checkbox"
          checked={audioId || isAudioSource}
          onChange={handleChange}
        />
        Upload Separate Audio File
      </label>
    )}
    {(audioId || isAudioSource) && (
      <>
        {!secureUrl && oldAudioSource && (
          <>
            <p>Current Audio:</p>
            <audio
              controls
              src={oldAudioSource}
              onLoadedMetadata={e => onAudioLoadedMetadata(e)}
            >
              <track kind="captions" />
            </audio>
          </>
        )}
        <p>Upload New Audio:</p>

        {(showUpload && (
          <CloudinaryUploadAudio
            onUploadFileSubmit={onUploadFileSubmit}
            source={youtubeId || oldOriginId}
            language={language || oldLanguage}
            uploadProgress={uploadProgress}
            uploadError={uploadError}
            deleteToken={deleteToken}
            onDeleteFileSubmit={onDeleteFileSubmit}
            secureUrl={secureUrl}
            handleChange={handleChange}
            audioSource={audioSource}
            onAudioLoadedMetadata={onAudioLoadedMetadata}
          />
        )) || (
          <Message warning>
            <p>
              Uploading a new audio file will immediately permanently replace
              the old one.{' '}
              <Button onClick={() => onShowUpload()}>Continue</Button>
            </p>
          </Message>
        )}
        {(secureUrl || audioSource || audioId) && (
          <>
            <label htmlFor="title">
              Tiêu đề:
              <input
                type="text"
                id="title"
                name="title"
                required
                maxLength="100"
                defaultValue={oldTitleVi}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="description">
              <input
                id="description"
                name="isDescription"
                type="checkbox"
                checked={isDescription}
                onChange={handleChange}
              />
              Nội dung:
            </label>
            {isDescription && (
              <label htmlFor="description">
                <textarea
                  name="description"
                  maxLength="5000"
                  rows="10"
                  defaultValue={oldDescriptionVi}
                  onChange={handleChange}
                />
              </label>
            )}
            <label htmlFor="tags">
              <input
                id="tags"
                name="isTags"
                type="checkbox"
                checked={isTags}
                onChange={handleChange}
              />
              Tags:
            </label>
            {isTags && (
              <>
                <input
                  type="text"
                  name="tags"
                  maxLength="500"
                  defaultValue={oldTags.trim()}
                  onChange={handleChange}
                />
                {originTags && (
                  <Segment>
                    <p>Current YouTube tags:</p>
                    {originTags.join(' ') ||
                      oldOriginTags.reduce(
                        (tagString, tag) => tagString + ' ' + tag.text,
                        ' '
                      )}
                  </Segment>
                )}
              </>
            )}
            <label htmlFor="defaultVolume">
              <input
                id="defaultVolume"
                name="isDefaultVolume"
                type="checkbox"
                checked={isDefaultVolume}
                onChange={handleChange}
              />
              Âm lượng (%):
            </label>
            {isDefaultVolume && (
              <input
                type="number"
                name="defaultVolume"
                min="0"
                max="100"
                defaultValue={oldDefaultVolume}
                onChange={handleChange}
              />
            )}
          </>
        )}
      </>
    )}
    <button type="submit">Save Changes</button>
  </fieldset>
);

EditVideoForm.defaultProps = {
  oldLanguage: null,
  image: '',
  channelTitle: '',
  originTitle: '',
  // tags: '',
  originTags: [],
  language: '',
  audioSource: '',
  audioId: '',
  // isAudioSource: false,
};

EditVideoForm.propTypes = {
  audioId: PropTypes.string,
  // props from state
  isDescription: PropTypes.bool.isRequired,
  isTags: PropTypes.bool.isRequired,
  isDefaultVolume: PropTypes.bool.isRequired,
  isAudioSource: PropTypes.bool.isRequired,
  fetchingYoutube: PropTypes.bool.isRequired,
  youtubeIdStatus: PropTypes.string.isRequired,
  image: PropTypes.string,
  channelTitle: PropTypes.string,
  originTitle: PropTypes.string,
  showUpload: PropTypes.bool.isRequired,
  // tags: PropTypes.string,
  originTags: PropTypes.array,
  language: PropTypes.string,
  audioSource: PropTypes.string,
  secureUrl: PropTypes.string.isRequired,
  uploadProgress: PropTypes.number.isRequired,
  uploadError: PropTypes.bool.isRequired,
  deleteToken: PropTypes.string.isRequired,
  youtubeId: PropTypes.string.isRequired,
  // default values
  oldTitleVi: PropTypes.string.isRequired,
  oldDescriptionVi: PropTypes.string.isRequired,
  oldDefaultVolume: PropTypes.number.isRequired,
  oldOriginId: PropTypes.string.isRequired,
  oldTags: PropTypes.string.isRequired,
  oldAudioSource: PropTypes.string.isRequired,
  oldLanguage: PropTypes.string,
  oldImage: PropTypes.string.isRequired,
  oldOriginTitle: PropTypes.string.isRequired,
  oldOriginChannel: PropTypes.string.isRequired,
  oldOriginTags: PropTypes.array.isRequired,
  // loading status
  loadingUpdateAudio: PropTypes.bool.isRequired,
  loadingCreateAudio: PropTypes.bool.isRequired,
  loadingUpdateVideo: PropTypes.bool.isRequired,
  // passsed down methods
  handleChange: PropTypes.func.isRequired,
  handleDropdown: PropTypes.func.isRequired,
  onUploadFileSubmit: PropTypes.func.isRequired,
  onDeleteFileSubmit: PropTypes.func.isRequired,
  onAudioLoadedMetadata: PropTypes.func.isRequired,
  onShowUpload: PropTypes.func.isRequired,
};

export default EditVideoForm;
