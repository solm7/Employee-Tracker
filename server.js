// Dependencies
const fs = require("fs/promises");
const inquirer = require("inquirer");
const mysql2 = require("mysql2");
const util = require("util");
const consoleTable = require("console.table");

// MYSQL2: Create a connection to the database
const connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "V&|DgC{=7",
  database: "company_db",
});
// Function for inquirer to search data
searchDatabase();

// Function to provide prompts
function searchDatabase() {
  inquirer
    .prompt({
      name: "enterprise",
      type: "list",
      message: "How do you want to proceed?",
      choices: [
        "View Employee Directory",
        "View all departments",
        "View all roles",
        "Hire Employee",
        "Add department",
        "Add Role",
        "Fire Employee",
        "Update employee role",
        "Update Employee Manager",
      ],
    })
    .then((answers) => {
      // Switch statement
      switch (answers.enterprise) {
        // New case
        case "View Employee Directory":
          connection
            .promise()
            .query(
              'SELECT id AS "ID", department_name AS "Department Name" FROM departments ORDER BY id;'
            )
            .then(([rows]) => {
              console.table(rows);
              searchDatabase();
            });
          console.log("selected " + answers.enterprise);
          break;

        default:
          console.log("something went wrong");
      }
    });
}
