const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
var app = express();

module.exports = async (req, res) => {
  try {
    filename = './ordersTodaycsv/ordersList_today.csv'
    var a = fs.readFileSync(filename)
      .toString() // convert Buffer to string
      .split('\n') // split string to lines
      .map(e => e.trim()) // remove white spaces for each line
      .map(e => e.split(';').map(e => e.trim())); // split each line to array


    let found = []
    let dup = {}
    var storeName = 6
    var orderNumber = 3

    for (let i = 0; i < a.length; i++) {

      for (let j = i + 1; j < a.length; j++) {
        if (a[i][storeName] === a[j][storeName] && !found.includes(j) && a[i][orderNumber] === a[j][orderNumber] && !found.includes(j)) {
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

    result = [];
    i = 0;
    for (const item of Object.keys(dup)) {
      const capital = dup[item];
      for (const duptackorders of capital) {
        result[i] = duptackorders;
        i++
        // console.log(duptackorders[orderNumber], duptackorders[storeName]);
      }
    }
    console.log('done', helpers.currentDateTime());

    if (result.length > 0) {
        req.flash('success', 'Result Found!')
    } else {
        req.flash('error', 'Result Not Found!')
    }
    
    res.render('check-orders', {
      reports: result,
      name: "Duplicate Orders",
    });

  } catch (error) {
    res.status(500).send(`Something went wrong! ${error}`)
  }
}
