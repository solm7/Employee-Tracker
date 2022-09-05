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
              'SELECT workers.id AS "ID",  workers.first_name, workers.last_name, roles.title AS "Title", department_name AS "Department", roles.salary AS "Salary", CONCAT(mgr.first_name, " ", mgr.last_name) AS "Manager" FROM employees workers LEFT JOIN employees mgr ON workers.manager_id = mgr.id INNER JOIN roles ON workers.role_id = roles.id INNER JOIN departments ON department_id = departments.id ORDER BY workers.id;'
            )
            .then(([rows]) => {
              console.table(rows);
              searchDatabase();
            });
          break;

        case "View all departments":
          connection
            .promise()
            .query(
              'SELECT id AS "ID", department_name AS "Department Name" FROM departments ORDER BY id;'
            )
            .then(([rows]) => {
              console.table(rows);
              searchDatabase();
            });
          break;

        case "View all roles":
          connection
            .promise()
            .query(
              'SELECT roles.id AS "ID", title AS "Roles", salary AS "Salary", department_name AS "Departments"  FROM roles INNER JOIN departments ON roles.department_id = departments.id ORDER BY roles.id;'
            )
            .then(([rows]) => {
              console.table(rows);
              searchDatabase();
            });
          break;

        case "Hire Employee":
          connection
            .promise()
            .execute(
              'SELECT id AS "ID", title AS "Roles" FROM roles ORDER BY id;'
            )
            .then(([rows]) => {
              console.table(rows);
              searchDatabase();
            });
          break;

        default:
          console.log("something went wrong");
      }
    });
}
