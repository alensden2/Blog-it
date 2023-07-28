const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event) => {
  try {
    // Extract the SQS message body from the event
    const { Records } = event;
    if (!Records || Records.length === 0) {
      console.log("No SQS messages received.");
      return;
    }

    // Process each message
    for (const record of Records) {
      const { body } = record;
      if (!body) {
        console.log("Empty message body.");
        continue;
      }

      // Parse the message body as JSON
      const messageObject = JSON.parse(body);

      // Publish the received blog object to the specified SNS topic
      const snsParams = {
        Message: JSON.stringify(messageObject), // Convert the object to a JSON string
        TopicArn: 'arn:aws:sns:us-east-1:524240663239:BlogitAdminEmail', // Replace with your SNS topic ARN
      };

      await sns.publish(snsParams).promise();

      // Print the received object
      console.log("Received object:", messageObject);
    }
  } catch (error) {
    console.error("Error processing SQS messages:", error);
  }
};
