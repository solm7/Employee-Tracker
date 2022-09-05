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
          let currentManagers = [];
          let currentRoles = [];
          connection
            .promise()
            .query(
              'SELECT CONCAT(first_name, " ", last_name) AS "mgr" FROM employees ORDER BY id'
            )
            .then(([rows]) => {
              for (row of rows) {
                currentManagers.push(row.mgr);
              }
              currentManagers.push("none");
            });
          connection
            .promise()
            .query("SELECT title FROM roles ORDER BY id")
            .then(([rows]) => {
              for (row of rows) {
                currentRoles.push(row.title);
              }
            });
          inquirer
            .prompt([
              {
                name: "First_Name",
                type: "input",
                message: "What is the Employee's First Name?",
              },
              {
                name: "Last_Name",
                type: "input",
                message: "What is the Employee's Last Name?",
              },
              {
                name: "Role",
                type: "list",
                message: "Select the employee's role.",
                choices: currentRoles,
              },
              {
                name: "Manager",
                type: "list",
                message: "Select employee's manager.",
                choices: currentManagers,
              },
            ])
            .then((answers) => {
              let role_id;
              let manager = answers.Manager.split(" ");
              let manager_id = "NULL";
              if (!(answers.Manager === "none")) {
                connection
                  .promise()
                  .query(
                    "SELECT id FROM roles WHERE title = " +
                      "'" +
                      answers.Role +
                      "'" +
                      ";"
                  )
                  .then(([rows]) => {
                    role_id = rows[0].id;

                    connection
                      .promise()
                      .query(
                        "SELECT id FROM employees WHERE first_name = " +
                          "'" +
                          manager[0] +
                          "'" +
                          "AND last_name = " +
                          "'" +
                          manager[1] +
                          "';"
                      )
                      .then(([rows]) => {
                        manager_id = rows[0].id;
                        connection
                          .promise()
                          .execute(
                            "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (" +
                              "'" +
                              answers.First_Name +
                              "', " +
                              "'" +
                              answers.Last_Name +
                              "', " +
                              "'" +
                              role_id +
                              "', " +
                              "'" +
                              manager_id +
                              "');"
                          )
                          .then(() => {
                            searchDatabase();
                          });
                      });
                  });
              }
            });
          // connection
          //   .promise()
          //   .execute(
          //     'SELECT id AS "ID", title AS "Roles" FROM roles ORDER BY id;'
          //   )
          //   .then(([rows]) => {
          //     console.table(rows);
          //     searchDatabase();
          //   });
          break;

        default:
          console.log("something went wrong");
      }
    });
}
