const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/upload`;

const uploadAudio = (
  file,
  youtubeId,
  language,
  id,
  { signature, timestamp }
) => {
  // Cloudinary API direct upload endpoint

  // Prepare params to send
  const publicId = `${youtubeId}_${id}_${language}`;
  const tags = `${id},${youtubeId},${timestamp},${language}`;

  const data = new FormData();

  // Append Cloudinary signed upload paramaters to send with upload file
  data.append('api_key', process.env.CLOUDINARY_API_KEY);
  data.append('file', file);
  data.append('public_id', publicId);
  data.append('signature', signature);
  data.append('tags', tags);
  data.append('timestamp', timestamp);
  data.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET_AUDIO);

  return { url, data };
};

const uploadAvatar = (file, id, { signature, timestamp }) => {
  // Cloudinary API direct upload endpoint

  // Prepare params to send
  const publicId = `avatar-${id}`;
  const tags = `${id},${timestamp},user-avatar,user,avatar,profile-picture,picture,image,profile`;

  const data = new FormData();

  // Append Cloudinary signed upload paramaters to send with upload file
  data.append('api_key', process.env.CLOUDINARY_API_KEY);
  data.append('file', file);
  data.append('public_id', publicId);
  data.append('signature', signature);
  data.append('tags', tags);
  data.append('timestamp', timestamp);
  data.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET_AVATAR);

  return { url, data };
};

export { uploadAudio, uploadAvatar };
