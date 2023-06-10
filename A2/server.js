const express = require('express');
const grpc = require("@grpc/grpc-js");
const AWS = require('aws-sdk');
const protoLoader = require('@grpc/proto-loader');
const bodyParser = require('body-parser');

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
 * 
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

  s3.upload(uploadParams, (err, uploadData) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      const s3uri = uploadData.Location;
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
 * 
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
 * 
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
  });
}

main();

const serverPort = 3000;
// app.listen(serverPort, () => {
//   console.log(`HTTP server running on port ${serverPort}`);
// });