const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const promisemysql = require("promise-mysql");


const connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "118balliol",
    database: "employees_DB"
}

const connection = mysql.createConnection(connectionProperties);

connection.connect((err) => {
    if (err) throw err;

    console.log("\n Employee Tracker \n");
    mainMenu();
});


function mainMenu() {
    inquirer.prompt ({
        name:"action",
        type: "list",
        message: "Main Menu",
        choices: [
            "View employees",
            "View employees by department",
            "View employees by manager",
            "View employees by role",
            "Add employee",
            "Add role",
            "Add department",
            "Update employee manager",
            "Update employee role",
            "Delete department",
            "Delete employee",
            "Delete role",
            "View department budets"
        ]
    })
    .then((answer) => {

        // switch the case depending on user choice
        switch (answer.action) {
            case "View employees":
                viewEmp();
                break;

            case "View employees by department":
                viewEmpByDept();
                break;  
            
            case "View employees by manager":
                viewEmpByMngr();
                break;

            case "View employees by role":
                viewEmpByRole();
                break;

            case "Add employee":
                addEmp();
                break;

            case "Add role":
                addRole();
                break;

            case "Add department":
                addDep();
                break;

            case "Update employee manager":
                updateEmpMngr();
                break;

            case "Update employee role":
                updateEmpRole();
                break;

            case "Delete depeartment":
                deleteDept();
                break;

            case "Delete employee":
                deleteEmp();
                break;

            case "Delete role":
                deleteRole();
                break;
        }
    });
}

function viewEmp() {

    // query to view employees
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concay(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id=m.id INNER JOIN ON e.role_id=role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";

    connection.query(query, function(err, res) {
        if (err) return err;
        console.log("\n");
        console.table(res);

        mainMenu();
    })
}

function viewEmpByDept() {

    let deptArr = [];           // global array for dept titles

    promisemysql.createConnection(connectionProperties)
    .then((conn) => {


        return conn.query('SELECT name FROM department');
    }).then(function(value) {
        deptQuery = value;
        for (i=0; i < value.length; i++) {
            deptArr.push(value[i].name);
        }
    }).then(() => {
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "Which department would you like to search?",
            choices: deptArr
        })
        .then((answer) => {

            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC`;
            connection.query(query, (err, res) => {
                if (err) return err;

                console.log("\n");
                console.table(res);

                mainMenu();
            });
        });
    });
}

function viewEmpByRole() {
    let roleArr = [];

    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return conn.query('SELECT title FROM role');
    }).then(function(roles) {
        for (i=0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        }
    }).then(() => {
        inquirer.prompt({
            name: "role",
            type: "list",
            message: "Which role do you want to search?",
            choices: roleArr
        })
        .then((answer) => {

            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC`;
            connection.query(query, (err, res) => {
                if (err) return err;

                console.log("\n");
                console.table(res);
                mainMenu();
            });
        });
    });
}

//Add employee and 2 arrays

function addEmp() {
    let roleArr = [];
    let managerArr = [];

// create connection

promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'),
            conn.query("SLECT employee.id, concat(employee.first_name, ' ' , employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, managers]) => {

        for (i=0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        }

        for (i=0; i < managers.length; i++) {
            managerArr.push(managers[i].Employee);
        }

        return Promise.all([roles, managers]);
    }).then(([roles, managers]) => {

        managerArr.unshift('--');

        //prompt user for first name

        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "First name: ",
                
                validate: function(input) {
                    if (input === "") {
                        console.log("REQUIRED");
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            {
            
        // prompt user for last name
                name: "lastName",
                type: "input",
                message: "LastNname name: ",
                
                validate: function(input) {
                    if (input === "") {
                        console.log("REQUIRED");
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },

        // prompt user for role
        
            {
                name: "role",
                type: "list",
                message: "What is their role?",
                choices: roleArr
            }, {
        
        // prompt user for manager
                name: "manager",
                type: "list",
                message: "Who is their manager?",
                choices: managerArr        
            }]).then((answer) => {

                let roleID;

                let managerID = null;

        // id for role selected
                for (i=0; i < roles.length; i++) {
                    if (answer.role == roles[i].title) {
                        roleID = roles[i].id;
                    }
                }

        // id for manager selected
                for (i=0; i < managers.length; i++) {
                    if (answer.manager == managers[i].Employee) {
                        managerID = managers[i].id;
                    }
                }        
                
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err, res) => {
                    if(err) return err;

                    console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n`);
                    mainMenu();
                });
            });
    });
}

function addRole() {

    let departmentArr = [];

    promisemysql.createConnection(connectionProperties)
    .then((conn) => {

        return conn.query('SELECT id, name FROM department ORDER BY name ASC');
    }).then((departments) => {

        for (i=0; i < departments.length; i++) {
            departmentArr.push(departments[i].name);
        }

        
        return departments;
    }).then((departments) => {

        inquirer.prompt([
            {
                // prompt user role title
                name: "roleTitle",
                type: "input",
                message: "Role title: "
            },
            {
                // prompt user for salary
                name: "salary",
                type: "number",
                message: "Salary: "
            },
            {
                // prompt user to select department role
                name: "dept",
                type: "list",
                message: "Department: ",
                choices: departmentArr
            }]).then((answer) => {

                let deptID;

                for (i=0; i < departments.length; i++) {
                    if (answer.dept == departments[i].name) {
                        dept.ID = departments[i].id;
                    }
                }

                connection.query(`INSERT INTO role (title, salary, department_id)
                VALUES ("${answer.roleTitle}", ${answer.salary}, ${deptID})`, (err, res) => {
                    if(err) return err;
                    console.log(`\n ROLE ${answer.roleTitle} ADDED...\n`);
                    mainMenu();
                });
            });
    });
}

// Add a department
function addDept() {

    inquirer.prompt({
        // prompt user for name of department
        name: "deptName",
        type: "input",
        message: "Department Name: "
    }).then((answer) => {

        // add department to table
        connection.query(`INSERT INTO department (name)VALUES ("${answer.deptName}");`, (err, res) => {
            if(err) return err;
            console.log("\n DEPARTMENT ADDED...\n ");
            mainMenu();
        });
    });
}

// update employee role
function updateEmpRole(){

    // role & employee array
    let employeeArr = [];
    let roleArr = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {
        return Promise.all([

            conn.query('SELECT id, title FROM role ORDER BY title ASC'),
            conn.query("SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, employees]) => {

        for (i=0; i < roles.length; i++) {
            roleArr.push(roles[i].title)
        }

        // place employees in an array
        for (i=0; i < employees.length; i++) {
            employeeArr.push(employees[i].Employee);
        }
        return Promise.all([roles, employees]);
    }).then(([roles, employees]) => {

        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Which employee would you like to edit?",
                choices: employeeArr
            }, {
                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: roleArr
            },]).then((answer) => {

                let roleID;
                let employeeID;

                for (i=0; i < roles.length; i++) {
                    if (answer.role == roles[i].title) {
                        roleID = roles[i].id
                    }
                }

                //get ID of employee selected
                for (i=0; i < employees.length; i++) {
                    if (answer.employee == employees[i].Employee) {
                        employeeID = employees[i].id;
                    }
                }

                // update the employee with a new role
                connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, (err, res) => {
                    if (err) return err;

                    console.log(`\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `);

                    mainMenu();
                });
            });
    });
}


// update the employee manager 
function updateEmpMngr() {

    let employeeArr = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        return conn.query("SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS Employee FROM employee ORDER BY Employee ASC");
    }).then((employees) => {

        for (i=0; i < employees.length; i++) {
            employeeArr.push(employees[i].Employee);
        }

        return employees;
    }).then((employees) => {

        inquirer.prompt([
            {
                // prompt the user to select employee
                name: "employee",
                type: "list",
                message: "Who is their new Manager?",
                choices: employeeArr
            },]).then((answer) => {

                let employeeID;
                let managerID;

                // get manager id
                for (i=0; i < employees.length; i++) {
                    if (answer.manager == employees[i].Employee) {
                        managerID = employees[i].id;
                    }
                }

                // get employee ID
                for (i=0; i < employees.length; i++) {
                    if (answer.employee == employees[i].Employee) {
                        employeeID = employees[i].id;
                    }
                }

                // update the selected employee with manager ID
                connection.query(`UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`, (err, res) => {
                    if(err) return err;

                    console.log(`\n ${answer.employee} MANAGER UPDATED TO ${answer.manager}...\n`);

                    mainMenu();
                });
            });
    });
}

function viewAllEmpByMngr() {

    let managerArr = [];

    promisemysql.createConnection(connectionProperties)
    .then((conn) => {

        return conn.query("SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e Inner JOIN employee m ON e.manager_id = m.id");
    }).then(function(managers) {

        for (i=0; i < managers.length; i++) {
            managerArr.push(managers[i].manager);
        }

        return managers;
    }).then((managers) => {

        inquirer.prompt({

            name: "manager",
            type: "list",
            message: "Which manager would you like to choose",
            choices: managerArr
        }).then((answer) => {

            let managerID;

            for (i=0; i < managers.length; i++) {
                if (answer.manager == managers[i].manager) {
                    managerID = managers[i].id;
                }
            }

            const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ', m.last_name) AS MANAGER
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            INNER JOIN role on e.role_id = role.id
            INNER JOIN department ON role.department_id = department.id
            WHERE e.manager_id = ${managerID};`;

            connection.query(query, (err, res) => {
                if (err) return err;
                console.log("\n");
                console.table(res);

                mainMenu();
            });
        });
    });
}

// Delete an employee

function deleteEmp() {

    let employeeArr = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        return conn.query("SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS employee FROM employee ORDER BY Employee ASC");
    }).then((employees) => {

        // place all employees in an array
        for (i=0; i < employees.length; i++) {
            employeeArr.push(employees[i].employee);
        }

        inquirer.prompt ([
            {
                name: "employee",
                type: "list",
                message: "Who do you want to delete?",
                choices: employeeArr
            }, {
                name: "yesNo",
                type: "list",
                message: "Confirm deletion",
                choices: ["NO", "YES"]    
            }]).then((answer) => {

                if (answer.yesNO == "YES") {
                    let employeeID;

                    for (i=0; i < employees.length; i++) {
                        if (answer.employee == employees[i].employee) {
                            employeeID = employees[i].id;
                        }
                    }

                // delete the employee that is selected
                connection.query(`DELETE FROM employee WHERE id=${employeeID};`, (err, res) => {
                    if(err) return err;
                    console.log(`\n EMPLOYEE '${answer.employee}' DELETED...\n `);
                    
                    mainMenu();
                });    
            }
            else {

                console.log(`\n EMPLOYEE '${answer.employee}' NOT DELETED...\n `);

                mainMenu();
            }
        });
    });
}

function deleteRole() {

    let roleArr = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        return conn.query("SELECT id, title FROM role");
    }).then((roles) => {

        for (i=0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        }

        inquirer.prompt([{
// confirm delete
            name: "continueDelete",
            type: "list",
            message: "If you delete role, it will delete any employee associated with the role. Continue?",
            choices: ["NO", "YES"]
        }]).then((answer) => {

            if (answer.continueDelete === "NO") {
                mainMenu();
            }
        }).then(() => {

            inquirer.prompt([{
                name: "role",
                type: "list",
                message: "Which role would you like to delete?",
                choices: roleArr
            }, {

                name: "confirmDelete",
                type: "input",
                message: "Type the role title to confirm deletion of role"
          
            }]).then((answer) => {

                if (answer.confirmDelete === answer.role) {
                    // get the id of the role that is selected
                    let roleID;
                    for (i=0; i < roles.length; i++) {
                        if (answer.role == roles[i].title) {
                            roleID = roles[i].id;
                        }
                    }

                    // delete the role
                    connection.query(`DELETE FROM role WHERE id=${roleID};`, (err, res) => {
                        if (err) return err;

                        console.log(`\n ROLE '${answer.role}' DELETED...\n `);

                        // return to main menu
                        mainMenu();
                    });
                    }
                    else {
                        console.log(`\n ROLE '${answer.role}' DELETED...\n `);

                        mainMenu();
                    }
                });
            })
        });
    }

    // Delete Department
    function deleteDept() {
        let deptArr = [];

        //create connection 
        promisemysql.createConnection(connectionProperties
            ).then((conn) => {
                return conn.query("SELECT id, name FROM department");
            }).then((depts) => {
                for (i=0; i < dept.length; i ++) {
                    deptArr.push(depts[i].name);
                }

                inquirer.prompt([{
                    name: "continueDelete",
                    type: "list",
                    message: "If you delete department, it will delete all roles and employees associated with the department!",
                    choices: ["NO", "YES"]
                }]).then((answer) => {

                    if (answer.continueDelete === "NO") {
                        mainMenu();
                    }
                }).then(() => {
                    inquirer.prompt([{
                        name: "dept",
                        type: "list",
                        message: "Which department would you like to delete?",
                        choices: deptArr
                    },{
                        name: "confirmDelete",
                        type: "input",
                        message: "Type the department name to confirm deletion: "
                    }]).then((answer) => {

                        if(answer.confirmDelete === answer.dept) {

                            let deptID;
                            for (i=0; i < depts.length; i++) {
                                if (answer.dept == depts[i].name) {
                                    deptID = depts[i].id;
                                }
                            }

                        // delete department
                        connection.query(`DELETE FROM department WHERE id=${deptID};`, (err, res) => {
                            console.log(`\n DEPARTMENT '${answer.dept}' DELETED...\n `);

                            mainMenu();
                        });    
                        }
                        else {

                            // don't delete department if user didn't confirm
                            console.log(`\n DEPARTMENT '${answer.dept}' NOT DELETED...\n `);
                            mainMenu();
                        }
                    });
                })
            });
    }

function viewDeptBudget() {

    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return Promise.all([
            conn.query("SELECT department.name AS department, role.salary FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY department ASC"),
            conn.query('SELECT name FROM department ORDER BY name ASC')
        ]);
    }).then(([deptSalaries, departments]) => {
        let deptBudgetArr = [];
        let department;

        for (d=0; d < deptartments.length; d++) {
            let departmentBudget = 0;

        //add salaries together
            for (i=0; i < deptSalaries.length; i++) {
                if (deparments[d].name == deptSalaries[i].department) {
                    departmentBudget += deptSalaries[i].salary;
                }
            }

            deparment = {
                Department: departments[d].name,
                Budget: departmentBudget
            }

            deptBudgetArr.push(department);
        }
        console.log("\n");

        console.table(deptBudgetArr);

        // Back to main menu
        mainMenu();
    });
}    
       

