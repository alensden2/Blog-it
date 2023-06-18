const express = require("express");
const fs = require("fs");
const csvParse = require("csv-parse/lib/sync");
const app = express();

app.use(express.json());

app.get("/test", (req, res) => {
  res.send("<h1>It works</h1>");
});

app.post("/calculate", (req, res) => {
  const { file, product } = req.body;
  // logic to reference the file from the a1 folder.
  const filePath = '/alen_PV_dir/' + file;

  // Loading the file to mem
  fs.readFile(filePath, "utf-8", (error, fileContents) => {
    if (error) {
      return res.status(500).json({ error: error });
    }

    try {
      // parsing the file
      fileContents = fileContents.trim();
      let fileContentsWithoutWhiteSpaces = "";
      for(let i = 0; i < fileContents.length; i++){
        if (fileContents[i] === " ") {
          fileContentsWithoutWhiteSpaces += "";
        } else {
          fileContentsWithoutWhiteSpaces += fileContents[i];
        }
      }
      fileContents = fileContentsWithoutWhiteSpaces
      const records = csvParse(fileContents, { columns: true });
      //filtering the rows -
      const productRows = records.filter((row) => row.product == product);
      // total for the filtered products
      const sumInt = productRows.reduce(
        (acc, row) => acc + parseInt(row.amount),
        0
      );

      const sum = sumInt.toString();
      res.status(200).json({ file, sum });
    } catch (error) {
      res.status(400).json({ file, error: "Invalid Input" });
    }
  });
});
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
