const express = require('express');
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const AWS = require('aws-sdk');
const path = require('path')

/** used - npx grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./ --grpc_out=./ --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` computeandstorage.proto
 * to generate the grpc files
 */

/** Loading the package to use the proto file */
const packageDefinination = protoLoader.loadSync("computeandstorage.proto", {})
const grpcObject = grpc.loadPackageDefinition(packageDefinination);
const computeandstorage = grpcObject.computeandstorage;

/** creating the new gRPC server */
const server = new grpc.Server();

/** assigning the proto functions to the created functions here */
server.addService(computeandstorage.EC2Operations.service, {
    "StoreData": StoreData,
    "AppendData": AppendData,
    "DeleteFile": DeleteFile
})

/** starting the server in a insecure mode */
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error("Error for server : ", error);
        return;
    }
    server.start();

    console.log("server listening on port 40000")
});


/** Store */
function StoreData(call, callback) {
    console.log(call.request.data);
    callback(null, {"s3uri" : call.request.data});
}

function AppendData(call, callback) {
    callback(null, null)
}

function DeleteFile(call, callback) {
    callback(null, null)
}

