const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'})

var documentClient = new AWS.DynamoDB.DocumentClient();
var dynamoDBTable = 'Blog_database'

exports.handler = async (event) => {
try {
  const scanParams = {
    TableName: dynamoDBTable,
  };
  
  const scanResult = await documentClient.scan(scanParams).promise();
  
      const posts = scanResult.Items;
const simplifiedPosts = posts.map((post) => {
      return {
        email: post.email,
        content: post.content,
      };
    });

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(simplifiedPosts),
    };
    return response;
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ e: 'failed to retrieve posts' }),
    };
  }
};