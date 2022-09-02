// Dependencies
const fs = require('fs/promises');
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const util = require("util");
const cTable = require('console.table');
const { type } = require('os');
const { default: Choices } = require('inquirer/lib/objects/choices');


// MYSQL2: Create a connection to the database
const connection = mysql2.createConnection({
    port: 3001,
    host: 'localhost',
    user: 'root',
    password: 'V&|DgC{=7',
    database: 'company_db'
});
connection.query = util.promisify(connection.query)

connection.connect((err) => {
    if (err) {
        console.log(err);
        res.status(500);
        return res.send("There was an error connecting to the database.");
    } console.log("You're connected!");

    // Function for inquirer to prompt data
    runSearch();
})

// Function to provide prompts
function searchDatabase() {
    inquirer
        .prompt({
            name: '',
            type: 'list',
            message: "How do you want to proceed?",
            choices: [
                "View Employee Directory",
                "View all departments",
                "View all roles",
                "Add an Employee",
                "Add department",
                "Add Role",
                "Remove an employee",
                "Update employee role",
                "Update Employee Manager"

            ]
        }).then(answers =>{
            //switch statement for inquirer
            switch(answers.action){
            //case 
            case "View all Employees":
                searchEmployees();
                searchDatabase();
                
                break;
            //case 
            case "View Departments":
                searchDepartments();
                searchDatabase();
                break;
            // case
            case "View Roles":
                searchRoles();
                searchDatabase():
                break;




            }
            
        }
)}
