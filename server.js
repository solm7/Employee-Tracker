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
  console.log("You are now connected");

  // Function for inquirer to search data
  searchDatabase();
});

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
        case "View every employee":
          byEmployees();
          searchDatabase();

          break;
        // New case
        case "View Departments":
          byDepartment();
          searchDatabase();

          break;

        case "View all roles":
          byRole();
          searchDatabase();

          break;

        // New case
        case "Add employee":
          inquirer
            .prompt([
              {
                name: "employeeFirstName",
                type: "input",
                message: "Enter the employee's first name.",
                validate: (answer) => {
                  if (answer !== "") {
                    return true;
                  }
                  return "Enter a character.";
                },
              },
              {
                name: "employeeLastName",
                type: "input",
                message: "Enter the employee's last name",
                validate: (answer) => {
                  if (answer !== "") {
                    return true;
                  }
                  return "Enter a character.";
                },
              },
              {
                name: "department",
                type: "input",
                message: "Enter role id",
              },
              {
                name: "manager",
                type: "input",
                message: "Enter Manager id",
              },
            ])
            .then((answers) => {
              addEmployee(
                answers.employeeFirstName,
                answers.employeeLastName,
                answers.department,
                answers.manager
              );
              searchDatabase();
            });

          break;
        // New case
        case "Add Department":
          inquirer
            .prompt([
              {
                name: "Department",
                type: "input",
                message: "Enter new Department name.",
                validate: (answer) => {
                  if (answer !== "") {
                    return true;
                  }
                  return "Enter a character.";
                },
              },
            ])
            .then((answers) => {
              // Add department to Database
              addDepartment(answers.Department);
              searchDatabase();
            });
          break;
        // New case
        case "Add Role":
          inquirer
            .prompt([
              {
                name: "title",
                type: "input",
                message: "Please enter the role's title.",
                validate: (answer) => {
                  if (answer !== "") {
                    return true;
                  }
                  return "Enter a character.";
                },
              },
              {
                name: "department_id",
                type: "input",
                message: "Enter the department id.",
              },
              {
                name: "salary",
                type: "input",
                message: "Enter role's salary.",
              },
            ])
            .then((answers) => {
              // Adds role to database
              addRole(answers.title, answers.salary, answers.department_id);
              searchDatabase();
            });
          break;

        // New case
        case "Remove employee":
          inquirer
            .prompt([
              {
                name: "id",
                type: "input",
                message: "Enter the Employee id you'd like to remove.",
              },
            ])
            .then((answers) => {
              // Removes employee to database
              removeEmployee(answers.id);
              searchDatabase();
            });
          break;

        // New case
        case "Update employee role":
          inquirer
            .prompt([
              {
                name: "employeeId",
                type: "input",
                message: "Please enter employee's id you'd like to update.",
              },
              {
                name: "roleId",
                type: "input",
                message: "Please enter role's id",
              },
            ])
            .then((answers) => {
              // Updates employee's role
              updateByRole(answers.employeeId, answers.roleId);
              searchDatabase();
            });

          break;
        // Start new case
        // Takes further input
        case "Update employee manager":
          inquirer
            .prompt([
              {
                name: "manager",
                type: "input",
                message: "Enter the manager id",
              },
              {
                name: "Employee",
                type: "input",
                message: "Enter the employee id",
              },
            ])
            .then((answers) => {
              // Updates employee's manager
              updateByManager(answers.manager, answers.Employee);
              searchDatabase();
            });

          break;
      }
    });
}

// "View all employees",
function byEmployees() {
  var results = connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.d_name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employees.role_id = role.id LEFT JOIN department on roles.department_id = department.id LEFT JOIN employee manager on manager.id = employees.manager_id;",

    function (error, results) {
      if (error) throw error;
      console.log("\n");
      console.table(results);
    }
  );
}

// "View alL departments",
function byDepartment() {
  var department = connection.query(
    "SELECT departments.id, departments.d_name FROM employee LEFT JOIN role on employees.role_id = roles.id LEFT JOIN department department on roles.department_id = departments.id WHERE departments.id;",

    function (error, department) {
      if (error) throw error;
      console.log("\n");
      console.table(department);
    }
  );
}

// "View all roles",
function byRole() {
  var manager = connection.query(
    "SELECT employees.id, roles.title, departments.d_name AS department, roles.salary AS manager FROM employee LEFT JOIN role on employees.role_id = roles.id LEFT JOIN department on roles.department_id = departments.id LEFT JOIN employee manager on manager.id = employees.manager_id;",

    function (error, manager) {
      if (error) throw error;
      console.log("\n");
      console.table(manager);
    }
  );
}

// "Update employee manager"
function updateByManager(managerId, employeeId) {
  var updateManager = connection.query(
    "UPDATE employee SET manager_id = ? WHERE id = ?",
    [managerId, employeeId],
    function (error, updateManager) {
      if (error) throw error;
      // console.table(manager)
    }
  );

  byRole();
}

// "Add employee"
function addEmployee(employeeFirstName, employeeLastName, department, manager) {
  var add = connection.query(
    "INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?",
    [employeeFirstName, employeeLastName, department, manager],
    function (error, add) {
      if (error) throw error;
    }
  );

  byEmployees();
}

// Shows departments only, without employees
function departmentTable() {
  var dTable = connection.query(
    "SELECT d_name FROM department;",

    function (error, dTable) {
      if (error) throw error;
      console.table(dTable);
    }
  );
}

// "Add Department"
function addDepartment(department) {
  var department = connection.query(
    "INSERT INTO department SET d_name = ?",
    [department],
    function (error, department) {
      if (error) throw error;
      // console.table(manager)
    }
  );

  departmentTable();
}

// Shows roles only, without employees:

function roleTable() {
  let roles = connection.query(
    "SELECT title, salary, department_id FROM role;",

    function (error, roles) {
      if (error) throw error;
      console.table(roleT);
    }
  );
}
// "Add role"
function addRole(title, salary, department_id) {
  var newRole = connection.query(
    "INSERT INTO role SET title = ?, salary = ?, department_id = ?",
    [title, salary, department_id],
    function (error, newRole) {
      if (error) throw error;
      // console.table(manager)
    }
  );

  roleTable();
}

// "Remove employee"
function removeEmployee(id) {
  var add = connection.query(
    "DELETE FROM employee WHERE id = ?",
    [id],
    function (error, id) {
      if (error) throw error;
    }
  );

  byEmployees();
}

// "Update employee role",
function updateByRole(employeeId, roleId) {
  var role = connection.query(
    "UPDATE employee SET role_id = ? WHERE id = ?",

    [roleId, employeeId],
    function (error, role) {
      if (error) throw error;
    }
  );
  byDepartment();
}
