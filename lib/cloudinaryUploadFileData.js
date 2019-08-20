export default (files, youtubeId, language, id, { signature, timestamp }) => {
  // Cloudinary API direct upload endpoint
  const url = `https://api.cloudinary.com/v1_1/${
    process.env.CLOUDINARY_NAME
  }/upload`;

  // Cloudinary signed upload paramaters to send with upload file
  const data = new FormData();
  data.append('api_key', process.env.CLOUDINARY_API_KEY);
  data.append(
    'file',
    'http://k007.kiwi6.com/hotlink/8etjfpje8y/EU_th_c_s_d_n_ch_nh_th_n_o_.mp3'
  );
  // data.append('file', files[0]);
  data.append('public_id', `${youtubeId}_${id}_${language}`);
  data.append('signature', signature);
  data.append('tags', `${id},${youtubeId},${timestamp},${language}`);
  data.append('timestamp', timestamp);
  data.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET_AUDIO);

  return { url, data };
};
