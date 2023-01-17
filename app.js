const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const Routes = require('./routes/index');
const async = require('async');
var app = express();
const cron = require("node-cron");


const helpers = require('./helpers/csv_helpers');
const sql_queries = require('./src/models/sql_queries')
const dbconn1 = require('./dbconnection'); // node
const dbconn2 = require('./dbconnection2'); // sp
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var rimraf = require("rimraf");
require('dotenv').config();
process.env.TZ = 'Europe/Amsterdam'; //set timezone


app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

app.use(bodyparser.json());

app.use(Routes);

var server = app.listen(5000, () => {
    server.timeout = 2000000;
    console.log(`Server is running on url 5000`);
});

function exportcsv() {

    var sqlQuery = sql_queries.query.orders.get_orders_detail;

    dbconn2.query(sqlQuery, function (error, data, fields) {

        if (error) {
            throw error;
        } else {
            var filename = 'OrdersList_' + helpers.currentDateTime();
            const zipFileDir = './ordersList'
            console.log('start generating csv');

            // delete ordersList dir
            rimraf(zipFileDir, function () {
                // create temp directory
                const dir = './temp'
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                // execute generate csv
                genrateCSV()
            });

            const csvWriter = createCsvWriter({
                path: `temp/${filename}.csv`,
                header: helpers.csvHeaderArr,
                fieldDelimiter: ';'
            });

            async function genrateCSV() {
                console.log('start generating csv', helpers.currentDateTime());
                const csvArr = helpers.genOrdersArr(data)
                const chunkSize = 500000;
                for (let i = 0; i < csvArr.length; i += chunkSize) {
                    const chunk = csvArr.slice(i, i + chunkSize);
                    await csvWriter.writeRecords(chunk)
                }

                // convert to zip
                helpers.genCsvToZip(zipFileDir, filename)
            }
        }
    });
}

function method1(callback) {
    console.log('1')
    callback(null, 'result1');
}

function method2(callback) {
    // method code here

    console.log('2')
    callback(null, 'result2');
}

function method10(callback) {
    // method code here

    console.log('10')
    callback(null, 'result10');
}

const methods = [exportcsv, method1, method2, method10];

cron.schedule("00 56 20 * * *", () => {
    console.log("Cron Scheduler Start");
    async.series(methods, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log(results);
        }
    });
    console.log("Running a task at " + helpers.currentDateTime());
});