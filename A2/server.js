const express = require('express');
const grpc = require("@grpc/grpc-js");
const AWS = require('aws-sdk');
const protoLoader = require('@grpc/proto-loader');
const bodyParser = require('body-parser');
const axios = require('axios');

/**
 * Setting up AWS Sdk,
 * mapping credentials
 */
const s3 = new AWS.S3();
const credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.credentials = credentials;

const app = express();
app.use(bodyParser.json());

const packageDefinition = protoLoader.loadSync('computeandstorage.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const computeAndStorageProto = grpc.loadPackageDefinition(packageDefinition).computeandstorage;

/**
 * This is used to store the data sent by the test app * 
 * @param {this contains the data to be written to the S3 bucket file} call 
 * @param {returns the public readable URI} callback 
 */
function storeData(call, callback) {
  const data = call.request.data;
  const fileName = "a2.txt";

  const uploadParams = {
    Body: data,
    Bucket: 'alen-a2-bucket',
    Key: fileName,
  };

  s3.upload(uploadParams, (err) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      const getObjectParams = {
        Bucket: 'alen-a2-bucket',
        Key: fileName,
      };
      s3.getSignedUrl('getObject', getObjectParams, (err, signedUrl) => {
        if (err) {
          console.error(err);
          callback(err);
        } else {
          const putAclParams = {
            Bucket: 'alen-a2-bucket',
            Key: fileName,
            ACL: 'public-read',
          };

          s3.putObjectAcl(putAclParams, (err) => {
            if (err) {
              console.error(err);
              callback(err);
            } else {
              callback(null, { s3uri: signedUrl });
            }
          });
        }
      });
    }
  });
}

/**
 * This appends the data to the existing file. This does not send and response
 * @param {contains the data to be appended to the existing file} call 
 * @param {contains the return object} callback 
 */
function appendData(call, callback) {
  const data = call.request.data;
  const fileName = "a2.txt";

  const params = {
    Bucket: 'alen-a2-bucket',
    Key: fileName,
  };

  s3.getObject(params, (err, result) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      const existingData = result.Body.toString();
      const updatedData = existingData + data;

      const updateParams = {
        Body: updatedData,
        Bucket: 'alen-a2-bucket',
        Key: fileName,
      };

      s3.upload(updateParams, (err, data) => {
        if (err) {
          console.error(err);
          callback(err);
        } else {
          callback(null, {});
        }
      });
    }
  });
}

/**
 * Deletes the created object
 * Extracts the object key from the uri
 * @param {Gets the public URI of the file} call 
 * @param {The response} callback 
 */
function deleteFile(call, callback) {
  const s3uri = call.request.s3uri;
  const objectKey = s3uri.substring(s3uri.lastIndexOf('/') + 1).split('?')[0];

  const params = {
    Bucket: 'alen-a2-bucket',
    Key: objectKey,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      callback(null, {});
    }
  });
}

/**
 * This function makes a axios call to the test app
 */
async function sendPostRequest() {
  try {
    const response = await axios.post('http://54.173.209.76:9000/start', {
      banner: 'B00930528',
      ip: '44.211.205.78:50051',
    });

    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

/**
 * Running the gRPC config
 */
function main() {
  const server = new grpc.Server();
  server.addService(computeAndStorageProto.EC2Operations.service, {
    StoreData: storeData,
    AppendData: appendData,
    DeleteFile: deleteFile,
  });

  const port = 50051;
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    server.start();
    console.log(`gRPC server running on port ${port}`);

    /** call test app */
    sendPostRequest();

  });
}

main();