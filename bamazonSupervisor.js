var mysql = require("mysql");
var inquirer = require("inquirer")
require('ansicolor').nice
var clc = require("cli-color");
var pressAnyKey = require('press-any-key');

// NPM package to render information in a stylish table 
var asTable = require('as-table').configure({ title: x => x.green, delimiter: ' | '.bright.darkGray, dash: '-'.bright.darkGray })

// Mysql connection
var connection = mysql.createConnection({
    multipleStatements: true,
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (error) {
    if (error) console.error(error);
});
// ----------------------------------------------- //

start();

/**
 *Start function  ask for accion to start
 *
 */
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Product Sales by Department",
                "Create New Department"
            ]
        })
        .then(answer => {
            switch (answer.action) {
                case "View Product Sales by Department":
                    productsSalesByDepartment();
                    break;

                case "Create New Department":
                    NewDepartment();
                    break;
            }
        });
}


/**
 *Create a new department in departments table
 *
 */
function NewDepartment() {
    inquirer.prompt([
        {
            name: "department_name",
            type: "input",
            message: "Please insert the Name of the department would you like to add: "
        },
        {
            name: "over_head_costs",
            type: "input",
            message: "insert the Overhead cost for this deparment: ",
        },
    ])
        .then(function (answer) {

            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_id: 0,
                    department_name: answer.department_name,
                    over_head_costs: answer.over_head_costs,
                },
                function (error) {
                    if (error) console.error(error);
                    console.log("The department was created successfully!");

                    // Wait for keypress and option for exit or continue
                    pressAnyKey(clc.italic(clc.green("Press any key to continue" + clc.blink("...."))) + clc.red(", or CTRL+C to exit"), {
                        ctrlC: "reject"
                    })
                        .then(() => {
                            start();
                        })
                        .catch(() => {
                            connection.end()
                        })
                    
                }
            )
        })
}


/**
 *Select departments from database
 *
 */
function productsSalesByDepartment() {
    connection.query(
        `SELECT LPAD(DP.department_id, 2, "0") department_id, 
            DP.department_name,
            DP.over_head_costs,
            SUM(IFNULL(PR.product_sales,0)) product_sales,
            (SUM(IFNULL(PR.product_sales,0)) - DP.over_head_costs) total_profit
        FROM DEPARTMENTS DP
        LEFT JOIN PRODUCTS PR ON PR.department_id = DP.department_id
        GROUP BY dp.department_id, pr.department_id`,
        function (error, res) {
            if (error) console.error(error);

            var table = asTable(res);
            console.log("\n")
            console.log(table)
            console.log("\n")
            start();
        });
}