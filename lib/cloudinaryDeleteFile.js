import axios from 'axios';

export default token =>
  axios.post(
    `https://api.cloudinary.com/v1_1/${
      process.env.CLOUDINARY_NAME
    }/delete_by_token`,
    {
      token,
    }
  );
