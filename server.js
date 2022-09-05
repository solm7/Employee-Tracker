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
        "Update employee role",
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
          break;

        case "Add department":
          inquirer
            .prompt([
              {
                name: "Department",
                type: "input",
                message:
                  "What is the name of the Department you'd like to add?",
              },
            ])
            .then((answer) => {
              connection
                .promise()
                .execute(
                  "INSERT INTO departments (department_name) VALUES (" +
                    "'" +
                    answer.Department +
                    "');"
                )
                .then(() => {
                  console.log("Department added successfully");
                  searchDatabase();
                });
            });

          break;

        case "Add Role":
          let currentDepartments = [];
          connection
            .promise()
            .query("SELECT department_name FROM departments ORDER BY id;")
            .then(([rows]) => {
              for (row of rows) {
                currentDepartments.push(row.department_name);
              }
              inquirer
                .prompt([
                  {
                    name: "Role",
                    type: "input",
                    message: "What is the name of the Role you'd like to add?",
                  },
                  {
                    name: "Salary",
                    type: "input",
                    message:
                      "What is the salary of the role you'd like to add?",
                  },
                  {
                    name: "Role_department",
                    type: "list",
                    message:
                      "What is the department for the role you'd like to add?",
                    choices: currentDepartments,
                  },
                ])
                .then((answer) => {
                  let deptID;
                  connection
                    .promise()
                    .query(
                      "SELECT id FROM departments WHERE department_name = " +
                        "'" +
                        answer.Role_department +
                        "';"
                    )
                    .then(([rows]) => {
                      deptID = rows[0].id;

                      connection
                        .promise()
                        .execute(
                          "INSERT INTO roles (title, salary, department_id) VALUES (" +
                            "'" +
                            answer.Role +
                            "', " +
                            "'" +
                            answer.Salary +
                            "', " +
                            "'" +
                            deptID +
                            "'" +
                            ");"
                        )
                        .then(() => {
                          console.log("Role added successfully");
                          searchDatabase();
                        });
                    });
                });
            });
          break;

        default:
          console.log("something went wrong");
      }
    });
}
