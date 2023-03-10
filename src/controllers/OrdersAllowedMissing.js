const express = require('express');
const bodyparser = require('body-parser');
var app = express();
let csvToJson = require('convert-csv-to-json');
const helpers = require('../../helpers/CommonHelpers')
const dbconn = require('../../dbconnection');
const sqlQueries = require('../models/sql_queries');

module.exports = async (req, res) => {

    try {
        console.log('start execution', helpers.currentDateTime());

        dbconn.query(sqlQueries.query.getStoresWithAllowedMissing, function (err, data) {
            if (err) throw err
// res.send(data[0]);
//
            // console.log('Done',helpers.currentDateTime());

            // if (MissingOrders.length > 0) {
            //     req.flash('success', 'Result Found!')
            // } else {
            //     req.flash('error', 'Result Not Found!')
            // }


            res.render('stores-list', {
                reports: data,
                name: "Missing Orders",
                data: data[0]
            });
        })
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}
