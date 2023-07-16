const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'})

var documentClient = new AWS.DynamoDB.DocumentClient();
var dynamoDBTable = 'Blog_database'

exports.handler = async (event) => {
  
  const {
    email,
    blog_id,
    content
  } = event
  
  try {
    const params = {
      TableName: dynamoDBTable,
      Item: {
        email: email,
        blog_id: blog_id,
        content: content
      },
    };
    
    await documentClient.put(params).promise();
    const response = {
      statusCode: 200,
      body: JSON.stringify({message: 'User blog stored'}),
    };
    return response;
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({e: 'failed to store'})
    }
  }
};
