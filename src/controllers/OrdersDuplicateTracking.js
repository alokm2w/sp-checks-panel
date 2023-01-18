const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
var app = express();
const { convertCSVToArray } = require('convert-csv-to-array');
const dbconn = require('../../dbconnection');
const sqlQueries = require('../models/sql_queries');
const columnArr = require('../../helpers/columnArr');


async function genOrdersList(req, res, next) {
  console.log('start execution', helpers.currentDateTime());
  dbconn.query(sqlQueries.query.getOrdersIds, function (err, orderIds) {
    console.log('start reading file', helpers.currentDateTime());
    filename = './ordersTodaycsv/ordersList_today.csv'
    var a = fs.readFileSync(filename)
      .toString() // convert Buffer to string
      .split('\n') // split string to lines
      .map(e => e.trim()) // remove white spaces for each line
      .map(e => e.split(';').map(e => e.trim())); // split each line to array

    /** Method1 */
    // console.log('create tracking ids array', helpers.currentDateTime());
    // arrTracking = a.map(item => item[columnArr.ColumnIndex.OrderTrackingNumber]);

    // const findDuplicates = (arr) => {
    //   let sorted_arr = arr.slice().sort(); // You can define the comparing function here.
    //   // console.log(sorted_arr + '==');
    //   let results = [];
    //   for (let i = 0; i < sorted_arr.length - 1; i++) {
    //     if (sorted_arr[i + 1] == sorted_arr[i]) {
    //       if (sorted_arr[i] != "") {
    //         results.push(sorted_arr[i]);
    //       }
    //     }
    //   }
    //   return results;
    // }

    // console.log('find duplicate trackiing Ids', helpers.currentDateTime());
    // dupTracNums = findDuplicates(arrTracking)

    // console.log('get duplicate records', helpers.currentDateTime());
    // ordertocheck = [];
    // a.map(function (item, index, arr) {
    //   if (dupTracNums.includes(item[53])) {
    //     ordertocheck[index] = item;
    //   }
    // })

    // var result = helpers.removeEmptyValueFromArr(ordertocheck);
    /** Method1 Close */

    /** Method2 */

    TrackingIndex = 53
    AddressIndex = 37
    CityIndex = 39
    ClientIndex = 56
    OrderIdIndex = 1

    let found = []
    let dup = {}

    var arrayOfOrderIds = orderIds.map(val => val.orders_id);

    console.log('start checks processing', helpers.currentDateTime());
    for (let i = 0; i < a.length; i++) {
      if (a[i][TrackingIndex] != "") {

        for (let j = i + 1; j < a.length; j++) {
          if (a[i][TrackingIndex] === a[j][TrackingIndex] && !found.includes(j) && a[i][CityIndex] !== a[j][CityIndex] && a[i][AddressIndex] !== a[j][AddressIndex] && a[i][ClientIndex] !== a[j][ClientIndex]) {
            if (i in dup) {
              found.push(j)
              dup[i].push(a[j])
            } else {
              dup[i] = []
              found.push(i)
              found.push(j)
              dup[i].push(a[i])
              dup[i].push(a[j])
            }
          }
        }
      }
    }

    result = [];
    i = 0;
    for (const item of Object.keys(dup)) {
      const capital = dup[item];
      for (const duptackorders of capital) {
        if (!arrayOfOrderIds.includes(duptackorders[OrderIdIndex])) {
          result[i] = duptackorders;
          i++
        }
      }
    }

    /** Method2 Close */

    console.log('Done', helpers.currentDateTime());

    if (result.length > 0) {
        req.flash('success', 'Result Found!')
    } else {
        req.flash('error', 'Result Not Found!')
    }

    res.render('duplicate-tracking', {
      reports: result,
      name: "Duplicate Tracking Numbers",
      orderIds: orderIds
    });
  });
  // })
}

module.exports = { genOrdersList }