const axios = require("axios");
const communicate = (req, res) => {
  axios
    .post("http://container-2-service:5000/calculate", req.body)
    .then((response) => {
      res.status(200).json(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
  communicate,
};
