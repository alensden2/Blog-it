const bcrypt = require('bcryptjs');
const axios = require('axios');
exports.handler = async (event) => {
  try {
    console.log("the first log : ", event)
    console.log("the second log : Parsed successfully");
    const { action, value, course_uri } = event;
    console.log(action, event, value, "the second")
    const saltRounds = 10;
    const hashedValue = await bcrypt.hash(value, saltRounds);

    const response = {
      banner: "B00930528",
      result: hashedValue,
      arn: "arn:aws:lambda:us-east-1:524240663239:function:bcrypt",
      action: "bcrypt",
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
