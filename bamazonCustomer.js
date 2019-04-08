var mysql = require("mysql");
var inquirer = require("inquirer")
var clc = require("cli-color");
var pressAnyKey = require('press-any-key');

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
    selectAllProducts();

});
// ----------------------------------------------- //

var separator = "\n///-----------------------------------------------------------///\n"


/**
 *Show all product to sale
 *
 */
function selectAllProducts() {
    connection.query(
        `SELECT item_id ID, 
            product_name Name,
            price Price    
        FROM products`,
        function (error, res) {
            if (error) console.error(error);

            res.forEach(element => {
                console.log("ID: " + element.ID);
                console.log("Product: " + element.Name);
                console.log("Price: $" + element.Price);
                console.log(separator)
            });
            startPromp();
        });
}


/**
 *Start prompt to define action
 *
 */
function startPromp() {
    inquirer.prompt([
        {
            name: "product_id",
            type: "input",
            message: "Please insert the ID of the product would you like to buy: "
        },
        {
            name: "product_quantity",
            type: "input",
            message: "How many units of the product would you like to buy: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answer) {
            var requested_product_id = answer.product_id;
            var quantity_requested = answer.product_quantity;
            var quantity_available;

            connection.query(
                "SELECT stock_quantity quantity FROM products WHERE item_id = ?",
                [requested_product_id],
                function (error, result) {
                    if (error) console.error(error);
                    quantity_available = result[0].quantity;

                    if (quantity_available >= quantity_requested) {
                        console.log("In stock!");

                        connection.query(
                            "UPDATE products SET stock_quantity = ?, product_sales = (price * ?) where item_id = ?; SELECT price, product_sales FROM products where item_id = ?",
                            [quantity_available - quantity_requested, quantity_requested, requested_product_id, requested_product_id],
                            function (error2, result2) {
                                if (error2) console.error(error2);
                                console.log("Price for unit: $" + result2[1][0].price)
                                console.log("Total Order: $" + result2[1][0].product_sales);
                                console.log("Your order has been placed successfully!");

                                // Wait for keypress and option for exit or continue
                                pressAnyKey(clc.italic(clc.green("Press any key to continue" + clc.blink("...."))) + clc.red(", or CTRL+C to exit"), {
                                    ctrlC: "reject"
                                })
                                    .then(() => {
                                        selectAllProducts();
                                    })
                                    .catch(() => {
                                        connection.end()
                                    })
                            }
                        )
                    } else {
                        console.log("Insufficient quantity!");

                        // Wait for keypress and option for exit or continue
                        pressAnyKey(clc.italic(clc.green("Press any key to continue" + clc.blink("...."))) + clc.red(", or CTRL+C to exit"), {
                            ctrlC: "reject"
                        })
                            .then(() => {
                                selectAllProducts();
                            })
                            .catch(() => {
                                connection.end()
                            })
                    }
                }
            )
        })
}

