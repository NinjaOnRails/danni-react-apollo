export default async (
  files,
  youtubeId,
  id,
  language,
  { signature, timestamp }
) => {
  const data = new FormData();
  data.append('api_key', process.env.CLOUDINARY_API_KEY);
  data.append('file', files[0]);
  data.append('public_id', `${youtubeId}_${id}_${language}`);
  data.append('signature', signature);
  data.append('tags', `${id},${youtubeId},${timestamp},${language}`);
  data.append('timestamp', timestamp);
  data.append('upload_preset', 'danni-audio');

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/danni/video/upload',
    {
      method: 'POST',
      body: data,
    }
  );

  return res.json();
};
