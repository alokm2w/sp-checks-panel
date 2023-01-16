const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
var app = express();
helpers = require('../../helpers/CommonHelpers')

module.exports = async (req, res) => {

    try {
        filename = './ordersTodaycsv/ordersList_today.csv'
        console.log('start execution', helpers.currentDateTime());
        var arr = fs.readFileSync(filename)
        .toString() // convert Buffer to string
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(';').map(e => e.trim())); // split each line to array

        var orderStatus = 4
        var IntransitDate = 48

        let result = arr.filter(item => item[orderStatus] != undefined && item[orderStatus].toLowerCase() == "waiting for tracking update" && item[IntransitDate] != "");
        console.log('Done', helpers.currentDateTime())

        if (result.length > 0) {
            req.flash('success', 'Result Found!')
        } else {
            req.flash('error', 'Result Not Found!')
        }
        
        res.render('check-orders', {
            reports: result,
            name: "In-Transit Date while status on waiting for tracking update",
        });

    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}
