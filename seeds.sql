CREATE DATABASE employees_DB;

USE employees_db;

INSERT INTO department (id, name)
VALUES (1, "Retail");

INSERT INTO department (id, name)
VALUES (2, "Brand Experience");

INSERT INTO department (id, name)
VALUES (3, "Human Resources");

INSERT INTO department (id, name)
VALUES (4, "IT");



INSERT INTO role (id, title, salary, deparment_id)
VALUES (1, "Stylist", 4200, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (2, "Assistant Store Manager", 60000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (3, "Store Manager", 75000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (4, "Brand Manager", 65000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (5, "Business Partner", 70000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (6, "HR Director", 100000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (7, "System Adminstrator", 80000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (8, "IT Coordinator", 52000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (9, "IT Manager", 105000, 4);