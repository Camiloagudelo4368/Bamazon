var mysql = require("mysql");
var inquirer = require("inquirer")
var clc = require("cli-color");
var pressAnyKey = require('press-any-key');

// Mysql connection
var connection = mysql.createConnection({
    multipleStatements: true,
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
});
// ----------------------------------------------- //

// var separator = "////---------////---------////---------////---------////"
var separator = '--------///////////////////////////////////////////////////////////////////'

start();


/**
 *Initial prompt
 *
 */
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(answer => {
            switch (answer.action) {
                case "View Products for Sale":
                    productsForSale();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;

            }
        });
}


/**
 *Show all prodcuts to sale
 *
 */
function productsForSale() {
    connection.query(
        `SELECT item_id ID, 
            product_name Name,
            price Price,
            stock_quantity Quantity
        FROM products`,
        function (error, res) {
            if (error) console.error(error);

            res.forEach(element => {
                console.log("ID: " + element.ID);
                console.log("Product: " + element.Name);
                console.log("Price: " + element.Price);
                console.log("Quantity: " + element.Quantity);
                console.log(separator)
            });
            start();
        });
}



/**
 *Show the products that have less than 5 in stock
 *
 */
function lowInventory() {
    connection.query(
        `SELECT item_id ID, 
        product_name Name,
        price Price,
        stock_quantity Quantity
    FROM products WHERE stock_quantity < 5`,
        function (error, res) {
            if (error) console.error(error);
            if (res.length > 0) {

                res.forEach(element => {
                    console.log("ID: " + element.ID);
                    console.log("Product: " + element.Name);
                    console.log("Price: " + element.Price);
                    console.log("Quantity: " + element.Quantity);
                    console.log(separator)
                });
            }
            else {
                console.log("No results");
            }
            start();
        });
}


/**
 *Add items to products
 *
 */
function addInventory() {
    inquirer.prompt([
        {
            name: "product_id",
            type: "input",
            message: "Please insert the ID of the product would you like to add: "
        },
        {
            name: "quantity_to_add",
            type: "input",
            message: "How many units of the product would you like to add: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answer) {
            var product_id = answer.product_id;
            var quantity_to_add = answer.quantity_to_add;

            connection.query(
                "UPDATE products pro, (SELECT stock_quantity as quantity FROM products where item_id = ?) pro1 SET pro.stock_quantity = pro1.quantity + ? where pro.item_id = ?",
                [product_id, quantity_to_add, product_id],
                function (error) {
                    if (error) console.error(error);
                    console.log("The inventory was updated successfully!");
                    
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
 *Insert a new product to database
 *
 */
function addProduct() {
    var departments = [];
    // select departments that exist in the database to fill up the prompt choices
    connection.query(
        // In order to propmt identify the object, the result should contain a name (to display in list), and a value (to save in the answers result)
        "SELECT department_id value, department_name name FROM departments",
        function (error, result) {
            if (error) console.error(error)
            result.forEach(item => {
                departments.push(item)
            })
        }
    )

    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "Please insert the Name of the product would you like to add: "
        },
        {
            name: "department_id",
            type: "rawlist",
            message: "Please select the department to which the product belongs (If you cannot find the department, end the program and go to <<node bamazonSupervisor>> to create the department): ",
            // Fill choices with departments from database
            choices: departments
        },
        {
            name: "price",
            type: "input",
            message: "insert the price of the product: ",
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "How many units of the product would you like to add?",
        }
    ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    item_id: 0,
                    product_name: answer.product_name,
                    // Select the value stored in departments prompt wich contains the department id
                    department_id: answer.department_id,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity,
                    product_sales: 0
                },
                function (error) {
                    if (error) console.error(error);
                    console.log("The product was created successfully!");
 
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