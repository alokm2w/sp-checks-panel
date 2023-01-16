const express = require('express');
let csvToJson = require('convert-csv-to-json');
const fs = require('fs');
const { Console } = require('console');
const helpers = require('../../helpers/CommonHelpers')
const columnArr = require('../../helpers/columnArr');

module.exports = async (req, res) => {


  try {
    filename = './ordersTodaycsv/ordersList_today.csv'
    console.log('start execution', helpers.currentDateTime());
    let jsonData = csvToJson.getJsonFromCsv(filename);

    console.log('start grouping');
    const grouped = helpers.groupBy(jsonData, item => item.StoreName);

    console.log('grouped', helpers.currentDateTime());

    i = 0;
    storeWithAvgOrders = [];
    for (const store of grouped) {
      if (store[0] != "") {
        sorted = store[1].filter(val => helpers.formatDate(val['OrderCreatedDate']) >= helpers.getBackDate(6))
        avgOrder = sorted.length / 7;
        storeWithAvgOrders[i] = { store: store[0], weeklyOrder: sorted.length, avgOrder: avgOrder.toFixed(2), link: `https://${store[0]}.myshopify.com/admin/orders` }
        i++
      }
    }

    console.log('done', helpers.currentDateTime());

    if (storeWithAvgOrders.length > 0) {
        req.flash('success', 'Result Found!')
    } else {
        req.flash('error', 'Result Not Found!')
    }

    res.render('average-order', {
      reports: storeWithAvgOrders,
      name: "Orders Dump/Week",
    });

  } catch (error) {
    res.status(500).send(`Something went wrong! ${error}`)
  }
}
