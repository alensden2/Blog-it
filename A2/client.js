/** Test method */
// const grpc = require("@grpc/grpc-js");
// const protoLoader = require("@grpc/proto-loader");
// const packageDefinination = protoLoader.loadSync("computeandstorage.proto", {});
// const grpcObject = grpc.loadPackageDefinition(packageDefinination);
// const computeandstorage = grpcObject.computeandstorage;
// const express = require("express");

// const app = express();
// app.use(express.json());

// /** Setting up the client for the created gRPC server */
// const client = new computeandstorage.EC2Operations("localhost:40000",
//     grpc.credentials.createInsecure())
// console.log("Client service")

// /** /storeData - endpoint that stores the string to S3 Bucket */
// app.post('/storedata', (req, res) => {
//     // data in the string comes in req.body.data
//     client.StoreData({ "data": req.body.data }, (error, response) => {
//         console.log(JSON.stringify(response))
//     })
// })

// /** Listening to the exposed express app */
// app.listen(3000, () => {
//     console.log('Express server 3000')
// })
