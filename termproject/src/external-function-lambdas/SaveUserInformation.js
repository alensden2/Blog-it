const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1'})

var documentClient = new AWS.DynamoDB.DocumentClient();
var dynamoDBTable = 'Authentication_Database';

exports.handler = async (event) => {
  console.log('Entered save user Lambda')
  const {email, name, password} = event;
  console.log('hi this is imp your event is ${event}')
  try {
    const params = {
      TableName: dynamoDBTable,
      Item: {
        email : email,
        name : name,
        password: password,
      },
    };
    
    await documentClient.put(params).promise();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User information stored successfully' }),
      headers:{ 'Access-Control-Allow-Origin' : '*' }

    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ e: 'Failed to store user information' }),
      headers:{ 'Access-Control-Allow-Origin' : '*' }

    };
  }
}