// Dependencies
const fs = require("fs/promises");
const inquirer = require("inquirer");
const mysql2 = require("mysql2");
const util = require("util");
const cTable = require("console.table");
const { type } = require("os");
const { default: Choices } = require("inquirer/lib/objects/choices");

// MYSQL2: Create a connection to the database
const connection = mysql2.createConnection({
  port: 3001,
  host: "localhost",
  user: "root",
  password: "V&|DgC{=7",
  database: "company_db",
});
connection.query = util.promisify(connection.query);

connection.connect((err) => {
  if (err) {
    console.log(err);
    res.status(500);
    return res.send("There was an error connecting to the database.");
  }
  console.log("You're connected!");

  // Function for inquirer to prompt data
  runSearch();
});

// Function to provide prompts
function searchDatabase() {
  inquirer
    .prompt({
      name: "",
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
      //switch statement for inquirer
      switch (answers.action) {
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
          searchDatabase();
          break;

        case "Hire Employee":
          inquirer
            .prompt([
              {
                name: "employeeFirstName",
                type: "input",
                message: "Enter Employee's First Name.",
                validate: (answer) => {
                  if (answer !== "") {
                    return true;
                  }
                  return "Please Enter Employee name.";
                },
              },
              {
                name: "employeeLastName",
                type: "input",
                message: "Enter Employee's Last Name.",
                validate: (answer) => {
                  if (answer !== "") {
                    return true;
                  }
                  return "Please Enter Employee name.";
                },
              },
              {
                name: "department",
                type: "input",
                message: "Enter role id",
              },
              {
                name: "manager",
                type: "Input",
                message: "Please enter manager id",
              },
            ])
            .then((answers) => {
              hireEmployee(
                answers.employeeFirstName,
                answer.employeeLastName,
                answers.department,
                answers.manager
              );
              searchDatabase();
            });
          break;

        //Case
        case "Add Department":
          inquirer
            .prompt([
              {
                name: "Department",
                type: "input",
                message: "Enter department Name.",
                validate: (answer) => {
                  if (answer !== "") {
                    return true;
                  }
                  return "Enter department name.";
                },
              },
            ])
            .then((answers) => {
              //Add Department to mysql2 Database
              addDepartment(answers.departments);
              searchDatabase();
            });
          break;
      }
    });
}
