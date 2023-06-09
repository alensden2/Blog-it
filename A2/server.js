const express = require('express');
const grpc = require("@grpc/grpc-js");
const AWS = require('aws-sdk');
const protoLoader = require('@grpc/proto-loader');
const bodyParser = require('body-parser');

const s3 = new AWS.S3();

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

function storeData(call, callback) {
  const data = call.request.data;
  const fileName = "alen-a2.txt";

  const params = {
    Body: data,
    Bucket: 'alen-a2-bucket',
    Key: fileName,
    ACL: 'public-read',
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      const s3uri = data.Location;
      callback(null, { s3uri });
    }
  });
}

function appendData(call, callback) {
  const data = call.request.data;
  const s3uri = call.metadata.get('s3uri');

  const params = {
    Bucket: '<YOUR_BUCKET_NAME>',
    Key: s3uri,
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
        Bucket: '<YOUR_BUCKET_NAME>',
        Key: s3uri,
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

function deleteFile(call, callback) {
  const s3uri = call.request.s3uri;

  const params = {
    Bucket: '<YOUR_BUCKET_NAME>',
    Key: s3uri,
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

app.post('/start', (req, res) => {
  const { banner, ip } = req.body;
  console.log('Received /start request');
  console.log('Banner:', banner);
  console.log('IP:', ip);

  // Make a request to your app's StoreData method here
  // ...
  // Retrieve the file URL and send it back in the response
  const fileUrl = '<PUBLIC_URL_OF_S3_FILE>'; // Replace with the actual URL
  res.json({ fileUrl });
});

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
  app.listen(serverPort, () => {
    console.log(`HTTP server running on port ${serverPort}`);
  });