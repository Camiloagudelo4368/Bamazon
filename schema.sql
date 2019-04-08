CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL auto_increment,
    product_name VARCHAR(200),
    department_ID INT,
    price DECIMAL(8,2),
    stock_quantity INT,
    product_sales DECIMAL(8,2),
    PRIMARY KEY(item_id)
);


CREATE TABLE departments (
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(200),
over_head_costs INT,
PRIMARY KEY (department_id));

INSERT INTO departments (
    department_id,
    department_name,
    over_head_costs
)

VALUES(
    1,
    "Housing",
    25
),
(
    2,
    "Garden",
    34
),
(
    3,
    "Music",
    12
),
(
    4,
    "Cars",
    1000
),
(
    5,
    "Laptops",
    1000.45
),
(
    6,
    "Data Storage",
    20
),
(
    7,
    "Routers",
    23
),
(
    8,
    "Desktops",
    125
),
(
    9,
    "Tables",
    234
),
(
    10,
    "Monitors",
    85
),
(
    11,
    "Movies",
    25
),
(
    12,
    "CellPhones",
    500
);

INSERT INTO products (
item_id, 
product_name,
department_id,
price,
stock_quantity,
product_sales
)
VALUES (
    1,
    "Apple MacBook Pro - Space Gray",
    5,
    2499.00,
    5,
    0
),
(
    2,
    "New Microsoft Surface Book 2",
    5,
    1499.00,
    10,
    0
),
(
    3,
    "iBUYPOWER Gaming Computer Desktop PC AM006A AMD FX-8320 8-Core 3.5Ghz (4.0Ghz), NVIDIA Geforce GTX 1050 Ti 4GB, 16GB DDR3 RAM, 2TB 7200RPM HDD, Wi-Fi USB Adapter, Win 10 Home, Black",
    8,
    899.99,
    20,
    0
),
(
    4,
    'ASUS VG248QE 24" Full HD 1920x1080 144Hz 1ms HDMI Gaming Monitor',
    10,
    259.47,
    3,
    0
)
,(
    5,
    'Samsung Electronics SM-T830NZKAXAR Galaxy Tab S4, 10.5", Black',
    9,
    529.99,
    8,
    0
),
(
    6,
    "New Microsoft Surface Go (Intel Pentium Gold, 4GB RAM, 64GB)",
    9,
    374.99,
    15,
    0
),
(
    7,
    "Toshiba HDTB410XK3AA Canvio Basics 1TB Portable External Hard Drive USB 3.0, Black",
    6,
    49.99,
    11,
    0
),
(
    8,
    "TP-Link AC1750 Smart WiFi Router - Dual Band",
    7,
    56.99,
    18,
    0
),
(
    9,
    "ASUS ROG Rapture GT-AX11000 AX11000 Tri-Band 10 Gigabit WiFi Router",
    7,
    449.99,
    5,
    0
),
(
    10,
    'Acer Chromebook 15 CB515-1HT-P39B, Pentium N4200, 15.6" Full HD Touch, 4GB LPDDR4, 32GB Storage, Pure Silver',
    5,
    350.00,
    5,
    0
)




