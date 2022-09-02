INSERT INTO departments (department_name)
VALUES ("Marketing"),
       ("Legal"),
       ("Finance"),
       ("Development");

INSERT INTO roles (title, salary, department_id)
VALUES ("Marketing Director", 100000, 1),
       ("Senior Marketing Specialist", 90000, 1),
       ("Senior Developer", 150000, 4),
       ("Software Developer", 120000, 4),
       ("Account Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Legal Team Lead", 250000, 2),
       ("Lawyer", 190000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Jack", "Frost", 2, 1),
       ("Angelina", "Sanchez", 3, NULL),
       ("Dwayne", "Johnson", 4, 3),
       ("Kevin", "Singh", 5, NULL),
       ("Alicia", "Brown", 6, 5),
       ("Sarah", "Richardson", 7, NULL),
       ("Joe", "Tsuyik", 8, 7);