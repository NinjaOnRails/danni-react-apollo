import React from 'react';
import { Dropdown, Loader, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { flagOptions } from '../../lib/supportedLanguages';
import DropDownForm from '../styles/VideoFormStyles';

const EditVideoForm = ({
  oldTitleVi,
  oldDescriptionVi,
  oldDefaultVolume,
  oldOriginId,
  oldTags,
  loadingUpdateVideo,
  loadingCreateAudio,
  loadingUpdateAudio,
  data,
  handleChange,
  handleDropdown,
  // passed state
  isDescriptionVi,
  isAudioSource,
  isTags,
  isDefaultVolume,
  image,
  originTitle,
  channelTitle,
  youtubeIdStatus,
  fetchingYoutube,
}) => (
  <fieldset
    disabled={loadingUpdateVideo || loadingCreateAudio || loadingUpdateAudio}
    aria-busy={loadingUpdateVideo}
  >
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
    {originTitle && (
      <Segment>
        <p>{originTitle}</p>
        <p>{channelTitle}</p>
        {image && <img width="200" src={image} alt="thumbnail" />}
      </Segment>
    )}
    <label htmlFor="titleVi">
      Tiêu đề:
      <input
        type="text"
        id="titleVi"
        name="titleVi"
        required
        placeholder="ví dụ 'Sự sống trên mặt trăng xanh'"
        defaultValue={oldTitleVi}
        onChange={handleChange}
      />
    </label>
    <label htmlFor="descriptionVi">
      <input
        id="descriptionVi"
        name="isDescriptionVi"
        type="checkbox"
        checked={isDescriptionVi}
        onChange={handleChange}
      />
      Nội dung:
    </label>
    {isDescriptionVi && (
      <label htmlFor="descriptionVi">
        <input
          type="text"
          name="descriptionVi"
          defaultValue={oldDescriptionVi}
          onChange={handleChange}
        />
      </label>
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
      <input
        type="text"
        name="tags"
        placeholder="ví dụ 'thúvị khoahọc vũtrụ thuyếtphục yhọc lịchsử'"
        defaultValue={oldTags.trim()}
        onChange={handleChange}
      />
    )}
    <label htmlFor="audioSource">
      <input
        id="audioSource"
        name="isAudioSource"
        type="checkbox"
        checked={isAudioSource}
        onChange={handleChange}
      />
      Nguồn Audio:
    </label>
    {isAudioSource && (
      <>
        <input
          type="text"
          name="audioSource"
          placeholder="ví dụ 'http://k007.kiwi6.com/hotlink/ceru6wup3q/ung_thu_tu_cung_18s.mp3'"
          defaultValue={
            data.video.audio.length
              ? data.video.audio[data.video.audio.length - 1].source
              : ''
          }
          onChange={handleChange}
        />
        Người đọc:
        <input
          type="text"
          name="audioAuthor"
          placeholder="ví dụ 'Paní'"
          defaultValue={
            data.video.audio.length &&
            data.video.audio[data.video.audio.length - 1].author
              ? data.video.audio[data.video.audio.length - 1].author.displayName
              : ''
          }
          onChange={handleChange}
        />
        Language:
        <DropDownForm>
          <Dropdown
            fluid
            selection
            options={flagOptions}
            onChange={handleDropdown}
            defaultValue={
              data.video.audio.length &&
              data.video.audio[data.video.audio.length - 1].language
            }
            name="audioLanguage"
            className="semantic-dropdown"
          />
        </DropDownForm>
      </>
    )}
    <button type="submit">Save Changes</button>
  </fieldset>
);

EditVideoForm.propTypes = {
  // props from state
  isDescriptionVi: PropTypes.bool.isRequired,
  isTags: PropTypes.bool.isRequired,
  isDefaultVolume: PropTypes.bool.isRequired,
  isAudioSource: PropTypes.bool.isRequired,
  fetchingYoutube: PropTypes.bool.isRequired,
  youtubeIdStatus: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  channelTitle: PropTypes.string.isRequired,
  originTitle: PropTypes.string.isRequired,
  // default values
  oldTitleVi: PropTypes.string.isRequired,
  oldDescriptionVi: PropTypes.string.isRequired,
  oldDefaultVolume: PropTypes.number.isRequired,
  oldOriginId: PropTypes.string.isRequired,
  oldTags: PropTypes.string.isRequired,
  // loading status
  loadingUpdateAudio: PropTypes.bool.isRequired,
  loadingCreateAudio: PropTypes.bool.isRequired,
  loadingUpdateVideo: PropTypes.bool.isRequired,
  // passsed down methods
  handleChange: PropTypes.func.isRequired,
  handleDropdown: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default EditVideoForm;
