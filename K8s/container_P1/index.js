const express = require("express");
const { checkIfFileExists } = require("./middleware.js");
const { communicate } = require("./communicate.js");
const fs = require('fs');
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/calculate", checkIfFileExists, communicate);
app.get("/test", (req, res) => {
  res.send("<h1>It works</h1>");
});
app.get("/test-service", async (req,res) => {
  try {
    const response = await axios.get("http://container-2-service:5000/test");
    res.send(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error occurred while calling Service 2");
  }
})
app.post("/store-file", (req,res) => {
const { file, data } = req.body;
if(file == null) {
  resp = {"file": null, "error": "Invalid JSON input." }
  return res.send(resp)
}
const dir = '/alen_PV_dir/';
fs.writeFile(dir+file, data, (err) => {
  if(err){
    const response = { 'file' : file, 'error' : 'Error while storing the file to the storage.' }
    return res.send(response)
  }
  const response = {
    'file':file,
    'message': 'Success.'
  }
  return res.send(response)
})
})

app.listen(6000, () => {
  console.log("container_P1 running @ 6000");
});
