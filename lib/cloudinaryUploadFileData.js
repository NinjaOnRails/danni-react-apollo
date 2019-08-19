export default (files, youtubeId, language, id, { signature, timestamp }) => {
  // Cloudinary API direct upload endpoint
  const url = `https://api.cloudinary.com/v1_1/${
    process.env.CLOUDINARY_NAME
  }/upload`;

  // Cloudinary signed upload paramaters to send with upload file
  const data = new FormData();
  data.append('api_key', process.env.CLOUDINARY_API_KEY);
  data.append('file', files[0]);
  data.append('public_id', `${youtubeId}_${id}_${language}`);
  data.append('signature', signature);
  data.append('tags', `${id},${youtubeId},${timestamp},${language}`);
  data.append('timestamp', timestamp);
  data.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET_AUDIO);

  return { url, data };
};
