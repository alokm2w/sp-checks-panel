const express = require('express');
const fs = require('fs');
const helpers = require('../../helpers/CommonHelpers')
const columnArr = require('../../helpers/columnArr');
const { parse } = require("csv-parse");


module.exports = async (req, res) => {

  try {
    // filename = './ordersTodaycsv/ordersList_today.csv'
    filename = './public/checksList/ordersDump.csv'
    console.log('start execution', helpers.currentDateTime());

    var dataArr = [];

    fs.createReadStream(filename)
      .pipe(parse({ delimiter: ";" }))
      .on("data", function (row) {
        dataArr.push(row);
      })
      .on("end", function () {
        // console.log('start grouping');

        // const groupedData = dataArr.reduce((acc, curr) => {
        //   const storeName = curr[columnArr.ColumnIndex.StoreName];
        //   if (!acc[storeName]) {
        //     acc[storeName] = [];
        //   }
        //   acc[storeName].push(curr);
        //   return acc;
        // }, {});

        // console.log('grouped', helpers.currentDateTime());

        // i = 0;
        // storeWithAvgOrders = [];
        // for (const store of Object.entries(groupedData)) {
        //   if (store[0] != "") {
        //     sorted = store[1].filter(val => helpers.formatDate(val[columnArr.ColumnIndex.OrderCreatedDate]) >= helpers.getBackDate(6))
        //     avgOrder = sorted.length / 7;
        //     storeWithAvgOrders[i] = { store: store[0], weeklyOrder: sorted.length, avgOrder: avgOrder.toFixed(2), link: `https://${store[0]}.myshopify.com/admin/orders` }
        //     i++
        //   }
        // }

        console.log('done', helpers.currentDateTime());

        if (dataArr.length > 0) {
          req.flash('success', 'Result Found!')
        } else {
          req.flash('error', 'Result Not Found!')
        }

        res.render('average-order', {
          reports: dataArr,
          name: "Orders Dump/Week",
        });
      })
      .on("error", function (error) {
        console.log(error.message);
      });

  } catch (error) {
    res.status(500).send(`Something went wrong! ${error}`)
  }
}
