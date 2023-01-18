const express = require('express');
const bodyparser = require('body-parser');
var app = express();
let csvToJson = require('convert-csv-to-json');
const helpers = require('../../helpers/CommonHelpers')
const dbconn = require('../../dbconnection');
const sqlQueries = require('../models/sql_queries');

module.exports = async (req, res) => {

    try {
        filename = './ordersTodaycsv/ordersList_today.csv'
        console.log('start execution', helpers.currentDateTime());
        let json = csvToJson.getJsonFromCsv(filename);

        const groupByStore = json.reduce((group, product) => {
            const { StoreName } = product;
            group[StoreName] = group[StoreName] ? group[StoreName] : [];
            group[StoreName].push(Number(product.OrderNumber.match(/\d+/)[0]));
            return group;
        }, {});

        dbconn.query(sqlQueries.query.getAllowedMissingOrders, function (err, data) {
            if (err) throw err

            MissingOrders = []
            i = 0
            for (const store of Object.keys(groupByStore)) {
                uniqueorderNum = helpers.removeDuplicateVal(groupByStore[store])

                min = Math.min(...uniqueorderNum);
                max = Math.max(...uniqueorderNum);

                missingOrderNums = []
                j = 0
                for (let index = min; index < max; index++) {
                    if (!uniqueorderNum.includes(index)) {
                        missingOrderNums[j] = index;
                        j++
                    }
                }

                if (uniqueorderNum.length > 1 && missingOrderNums.length > 0 && missingOrderNums.length > data[0]['allowed_number']) {
                    MissingOrders[i] = {
                        store: store,
                        Min: min,
                        Max: max,
                        NoOfOrders: uniqueorderNum.length,
                        noOfMissing: missingOrderNums.length,
                        missingOrderNum: missingOrderNums
                    }
                    i++
                }

            }
            console.log('Done',helpers.currentDateTime());

            if (MissingOrders.length > 0) {
                req.flash('success', 'Result Found!')
            } else {
                req.flash('error', 'Result Not Found!')
            }

            res.render('missing-orders', {
                reports: MissingOrders,
                name: "Missing Orders",
                data: data[0]
            });
        })
    } catch (error) {
        res.status(500).send(`Something went wrong! ${error}`)
    }
}
