
const CommonHelpers = require('../helpers/CommonHelpers');
const columnArr = require('../helpers/columnArr');
const helpers = require('../helpers/csv_helpers');
const fs = require('fs');
const fastCsv = require('fast-csv');
const dbconn = require('../dbconnection');
const dbconn2 = require('../dbconnection2');
const sqlQueries = require('../src/models/sql_queries');


function orderCostAdded(dataArr) {
    try {
        console.log("start filtering Order Cost Added", helpers.currentDateTime());

        var orderStatus = 4
        var quote_price = 28

        const status_arr = ["Waiting for tracking update", "In transit", "Processing", "Fulfilled"];
        let result = dataArr.filter(item => !status_arr.includes(item[orderStatus]) && item[quote_price] != 0);

        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersCostAdded.csv', csvData);

        console.log('Orders Cost Added Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function orderDump(dataArr) {
    try {
        console.log('start grouping');
        const groupedData = dataArr.reduce((acc, curr) => {
            const storeName = curr[columnArr.ColumnIndex.StoreName];
            if (!acc[storeName]) {
                acc[storeName] = [];
            }
            acc[storeName].push(curr);
            return acc;
        }, {});

        console.log('grouped', helpers.currentDateTime());

        i = 0;
        storeWithAvgOrders = [];
        for (const store of Object.entries(groupedData)) {
            if (store[0] != "") {
                sorted = store[1].filter(val => CommonHelpers.formatDate(val[columnArr.ColumnIndex.OrderCreatedDate]) >= CommonHelpers.getBackDate(6))
                avgOrder = sorted.length / 7;
                storeWithAvgOrders[i] = [store[0], sorted.length, avgOrder.toFixed(2), `https://${store[0]}.myshopify.com/admin/orders`]
                i++
            }
        }

        const csvData = storeWithAvgOrders.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersDump.csv', csvData);

        console.log('Orders Dump Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function orderDuplicate(dataArr) {
    try {
        console.log('start execution');

        const groupBy = (arr, keys) => {
            return arr.reduce((acc, obj) => {
                const key = keys.map(k => obj[k]).join('|');
                acc[key] = acc[key] || [];
                acc[key].push(obj);
                return acc;
            }, {});
        }

        const duplicateArr = Object.values(groupBy(dataArr, [columnArr.ColumnIndex.OrderNumber, columnArr.ColumnIndex.StoreName])).filter(arr => arr.length > 1);

        let newData = []
        for (let i = 0; i < duplicateArr.length; i++) {
            for (let j = 0; j < duplicateArr[i].length; j++) {
                newData.push(duplicateArr[i][j])
            }
        }
        const ws = fs.createWriteStream('./public/checksList/ordersDuplicate.csv');
        fastCsv.write(newData, { headers: true, delimiter: ';' })
            .pipe(ws)
            .on('finish', () => {
                console.log('Orders Duplicate Done!', helpers.currentDateTime());
            });
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function orderInTransitDateIsShipped(dataArr) {
    try {
        console.log('start execution');
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.IntransitDate] != "" && item[columnArr.ColumnIndex.is_shipped] == 0);
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/orderInTransitDateIsShipped.csv', csvData);

        console.log('Orders In-Transit Date Is Shipped Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersInTransitDateWithStatus(dataArr) {
    try {
        console.log('start execution');
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderStatus] != undefined && item[columnArr.ColumnIndex.OrderStatus].toLowerCase() == "waiting for tracking update" && item[columnArr.ColumnIndex.IntransitDate] != "");
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersInTransitDateWithStatus.csv', csvData);

        console.log('Orders In-Transit Date With Status Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersMissingInfo(dataArr) {
    try {
        console.log('start execution');
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.AgentSupportName] == "" || item[columnArr.ColumnIndex.StoreName] == "" || item[columnArr.ColumnIndex.OrderCreatedDate] == "");
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersMissingInfo.csv', csvData);

        console.log('Orders Missing Info Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersNoDateOfPayment(dataArr) {
    try {
        console.log('start execution');
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.DateofPayment] == "" && item[columnArr.ColumnIndex.PaiByShopOwner].toLowerCase() == "paid");
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersNoDateOfPayment.csv', csvData);

        console.log('Orders No Date Of Payment Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersNoMaxTime(dataArr) {
    try {
        console.log('start execution');
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.DateofPayment.MaxProcessingTime] == "" && item[columnArr.ColumnIndex.DateofPayment.AdminSupplierName] != "" ||
            item[columnArr.ColumnIndex.DateofPayment.MaxProcessingTime] == "" && item[columnArr.ColumnIndex.DateofPayment.supplierName] != "" ||
            item[columnArr.ColumnIndex.DateofPayment.MaxDelieveryTime] == "" && item[columnArr.ColumnIndex.DateofPayment.supplierName] != "" ||
            item[columnArr.ColumnIndex.DateofPayment.MaxDelieveryTime] == "" && item[columnArr.ColumnIndex.DateofPayment.AdminSupplierName] != ""
        );
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersNoMaxTime.csv', csvData);

        console.log('Orders No Max Time Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersNoPaidOnPaidByShopOwner(dataArr) {
    try {
        console.log('start execution');
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.PaiByShopOwner] != undefined && item[columnArr.ColumnIndex.DateofPayment] != "" && item[columnArr.ColumnIndex.PaiByShopOwner].toLowerCase() == "pending");
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersNoPaidOnPaidByShopOwner.csv', csvData);

        console.log('OrdersNoPaidOnPaidByShopOwner Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersNoSupplierAdded(dataArr) {
    try {
        console.log('start execution');
        const status_arr = ["Waiting for tracking update", "In transit", "Processing", "Resend"];

        let result = dataArr.filter(item =>
            status_arr.includes(item[columnArr.ColumnIndex.OrderStatus]) && item[columnArr.ColumnIndex.AdminSupplierName] == "" ||
            status_arr.includes(item[columnArr.ColumnIndex.OrderStatus]) && item[columnArr.ColumnIndex.supplierName] == "" ||
            item[columnArr.ColumnIndex.OrderStatus] == "Fulfilled" && item[columnArr.ColumnIndex.OrderTrackingNumber] != "" && item[columnArr.ColumnIndex.AdminSupplierName] == "" ||
            item[columnArr.ColumnIndex.OrderStatus] == "Fulfilled" && item[columnArr.ColumnIndex.OrderTrackingNumber] != "" && item[columnArr.ColumnIndex.supplierName] == ""
        );
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersNoSupplierAdded.csv', csvData);

        console.log('OrdersNoSupplierAdded!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersNotQuoted(dataArr) {
    try {
        console.log('start execution');
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderStatus] == "Not quoted" && item[columnArr.ColumnIndex.AdminSupplierName] != "" ||
            item[columnArr.ColumnIndex.OrderStatus] == "Not quoted" && item[columnArr.ColumnIndex.supplierName] != "" ||
            item[columnArr.ColumnIndex.OrderStatus] == "Not quoted" && item[columnArr.ColumnIndex.OrderProcessingDate] != "" ||
            item[columnArr.ColumnIndex.OrderStatus] == "Not quoted" && item[columnArr.ColumnIndex.PaiByShopOwner] != ""
        );
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersNotQuoted.csv', csvData);

        console.log('OrdersNotQuoted Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersNoTrackingAdded(dataArr) {
    try {
        console.log('start execution');
        const status_arr = ["Waiting for tracking update", "In transit"];
        let result = dataArr.filter(item => status_arr.includes(item[columnArr.ColumnIndex.OrderStatus]) && item[columnArr.ColumnIndex.OrderTrackingNumber] == "");
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersNoTrackingAdded.csv', csvData);

        console.log('OrdersNoTrackingAdded Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersOnHold(dataArr) {
    try {
        console.log('start execution');
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderStatus] == "Hold" && item[columnArr.ColumnIndex.AdminSupplierName] != "" ||
            item[columnArr.ColumnIndex.OrderStatus] == "Hold" && item[columnArr.ColumnIndex.supplierName] != ""
        );
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersOnHold.csv', csvData);

        console.log('OrdersOnHold Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersPaymentPending(dataArr) {
    try {
        console.log('start execution');
        const status_arr = ["Address error", "Cancelled", "Fulfilled", "Hold", "Refund", "Not quoted"];
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderFinancialStatus] != undefined && item[columnArr.ColumnIndex.OrderFinancialStatus] != 'Order Financial Status' && item[columnArr.ColumnIndex.OrderFinancialStatus].toLowerCase() != "paid" && !status_arr.includes(item[columnArr.ColumnIndex.OrderStatus]));

        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersPaymentPending.csv', csvData);

        console.log('ordersPaymentPending Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersShortTrackingNumber(dataArr) {
    try {
        console.log('start execution');
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderTrackingNumber] && item[columnArr.ColumnIndex.OrderTrackingNumber] != "" && item[columnArr.ColumnIndex.OrderTrackingNumber].length < 10);
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersShortTrackingNumber.csv', csvData);

        console.log('ordersShortTrackingNumber Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function ordersTrackingNumberAdded(dataArr) {
    try {
        console.log('start execution');
        let result = dataArr.filter(item => item[columnArr.ColumnIndex.OrderStatus] == "Processing" && item[columnArr.ColumnIndex.OrderTrackingNumber] != "");
        const csvData = result.map(d => d.join(';')).join('\n').replace(/"/g, "'");
        fs.writeFileSync('./public/checksList/ordersTrackingNumberAdded.csv', csvData);

        console.log('ordersTrackingNumberAdded Done!', helpers.currentDateTime());
    } catch (error) {
        console.log(`Something went wrong! ${error}`)
    }
}

function getStores() {

    dbconn2.query(sqlQueries.query.getStores, function (err, data) {
        if (err) throw err

        data.forEach(function (val, i) {
            dbconn.query(`SELECT id FROM stores where store_id = ${val.id}`, function (err, results, fields) {
                if (err) throw err;

                if (results.length > 0) {
                    CreateOrUpdate = `UPDATE stores SET store_name = '${val.name}', is_deleted = '${val.is_deleted}' WHERE store_id = '${val.id}'`;
                } else {
                    CreateOrUpdate = `INSERT INTO stores (store_id, store_name, is_deleted) VALUES ('${val.id}', '${val.name}', '${val.is_deleted}')`;
                }

                dbconn.query(CreateOrUpdate, function (err, data2) {
                    if (err) throw err
                })
            });
        })
        console.log('Get Store Done!');
    })
}

module.exports = { orderCostAdded, orderDump, orderDuplicate, orderInTransitDateIsShipped, ordersInTransitDateWithStatus, ordersMissingInfo, ordersNoDateOfPayment, ordersNoMaxTime, ordersNoPaidOnPaidByShopOwner, ordersNoSupplierAdded, ordersNotQuoted, ordersNoTrackingAdded, ordersOnHold, ordersPaymentPending, ordersShortTrackingNumber, ordersTrackingNumberAdded, getStores }