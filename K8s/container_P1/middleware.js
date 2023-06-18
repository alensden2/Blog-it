const fs = require("fs");

const checkIfFileExists = (req, res, next) => {
  const fileName = req.body.file;
  const filePath = "/alen_PV_dir/" + fileName;

  if (fileName == null || fileName == "") {
    res.status(400).json({
      file: null,
      error: "Invalid JSON input.",
    });
    return;
  }

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(200).json({
        file: fileName,
        error: "File not found.",
      });
      return;
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.status(500).json({
          file: fileName,
          error: "Invalid JSON input.",
        });
        return;
      }

      const lines = data.trim().split("\n");

      if (lines.length < 2) {
        res.status(200).json({
          file: fileName,
          error: "Input file not in CSV format.",
        });
        return;
      }

      const headerLine = lines[0];
      const expectedHeader = "product,amount";

      // if (headerLine !== expectedHeader) {
      //   res.status(200).json({
      //     file: fileName,
      //     error: "Input file not in CSV format.",
      //   });
      //   return;
      // }

      const regex = /^([^,\n]+),\s*(\d+)\s*$/;
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!regex.test(line)) {
          res.status(200).json({
            file: fileName,
            error: "Input file not in CSV format.",
          });
          return;
        }
      }

      req.jsonObj = { From: "First" };
      next();
    });
  });
};

module.exports = {
  checkIfFileExists,
};
