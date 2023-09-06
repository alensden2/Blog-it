const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
const documentClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTable = 'Authentication_Database';

exports.handler = async (event) => {
  try {
    // Parse the request body as JSON
    const requestBody = JSON.parse(event.body);
    const { email, password } = requestBody;
    console.log("Lambda event", requestBody);

    // Check if the user exists in the database based on the email
    const user = await getUserByEmail(email);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // Verify the provided password against the stored password
    if (user.password !== password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    console.log("Lambda works!");
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Login successful' }),
    };
  } catch (error) {
    console.error('Error logging in:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error from lambda' }),
    };
  }
};

async function getUserByEmail(email) {
  console.log("email ", email);
  const params = {
    TableName: dynamoDBTable,
    Key: { email },
  };

  const data = await documentClient.get(params).promise();
  return data.Item;
}
