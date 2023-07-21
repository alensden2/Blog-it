const crypto = require('crypto');
const axios = require('axios');

exports.handler = async (event) => {
  try {
    const { action, value, course_uri } = event;
    const hashedValue = crypto.createHash('sha256').update(value).digest('hex');
    const response = {
      banner: "B00930528",
      result: hashedValue,
      arn: "arn:aws:lambda:us-east-1:524240663239:function:sha256",
      action: "sha256",
      value: value
    };

    await axios.post(course_uri, response);

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error occurred during hashing.', error: error.message })
    };
  }
};
