const express = require("express");
const fs = require("fs");
const csvParse = require("csv-parse/lib/sync");
const app = express();

app.use(express.json());

app.post("/calculate", (req, res) => {
  const { file, product } = req.body;
  // logic to reference the file from the a1 folder.
  const filePath = "../files/" + file;

  // Loading the file to mem
  fs.readFile(filePath, "utf-8", (error, fileContents) => {
    if (error) {
      return res.status(500).json({ error: error });
    }

    try {
      // parsing the file
      fileContents = fileContents.trim();

      const records = csvParse(fileContents, { columns: true });
      //filtering the rows -
      const productRows = records.filter((row) => row.product == product);
      // total for the filtered products
      const sum = productRows.reduce(
        (acc, row) => acc + parseInt(row.amount),
        0
      );
      res.status(200).json({ file, sum });
    } catch (error) {
      res.status(400).json({ file, error: "Invalid Input" });
    }
  });
});
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
