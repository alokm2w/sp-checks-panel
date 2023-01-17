const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
const { parse } = require("csv-parse");
var app = express();

module.exports = async (req, res) => {
  try {
    filename = './ordersTodaycsv/ordersList_today1.csv'
    // var a = fs.readFileSync(filename)
    //   .toString() // convert Buffer to string
    //   .split('\n') // split string to lines
    //   .map(e => e.trim()) // remove white spaces for each line
    //   .map(e => e.split(';').map(e => e.trim())); // split each line to array

    console.log('Execution Start', helpers.currentDateTime());
    var dataArray = [];
    fs.createReadStream(filename)
      .pipe(parse({ delimiter: ";" }))
      .on("data", function (row) {
        var arrayToString = JSON.stringify(Object.assign({}, row));  // convert array to string
        var stringToJsonObject = JSON.parse(arrayToString);
        dataArray.push(stringToJsonObject);
      })
      .on("end", function () {

        var storeName = 6
        var orderNumber = 3

        const groupBy = (arr, keys) => {
          return arr.reduce((acc, obj) => {
            const key = keys.map(k => obj[k]).join('|');
            acc[key] = acc[key] || [];
            acc[key].push(obj);
            return acc;
          }, {});
        }

        const duplicateArr = Object.values(groupBy(dataArray, [orderNumber, storeName])).filter(arr => arr.length > 1);

        console.log('done', helpers.currentDateTime());

        res.render('duplicate-orders', {
          reports: duplicateArr,
          name: "Duplicate Orders",
        });
      })
      .on("error", function (error) {
        console.log(error.message);
      });
  } catch (error) {
    res.status(500).send(`Something went wrong! ${error}`)
  }
}
