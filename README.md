# Employee_Tracker

This is an easy-to-use node application for any manager/owner to be able to view and organize their employees via role, and departments. This will allow the user to add/delete a role, employee, or department. As well as search specific employees, and update their roles & salaries. 

---

## Installation

* Run `npm install`. This will install all necessary dependencies.
* Run `npm install inquirer` to install inquirer NPM.
* Run `npm i promise-mysql` to install promise-mysql.
* Run `npm i console.table` to install console.table.
* Run `npm i mysql` to install mysql driver.
* Run `schema.sql` in MYSQL Workbench.

---

## Usage

1. Run `node app.js` to start the application. 

2. Use the arrows to scroll the menu, and hit `Enter` to select.

![Sc1](https://user-images.githubusercontent.com/62081345/94760279-0df03a80-0370-11eb-81f0-668d3cfd5664.png)

3. If choosing `View employees by department`, you can select one of four departments available.

![Sc2](https://user-images.githubusercontent.com/62081345/94760484-a090d980-0370-11eb-86ca-8a63ade925f6.png)

4. Once selected IT department. All employees working in IT will be displayed. 

![Sc3](https://user-images.githubusercontent.com/62081345/94760911-c36fbd80-0371-11eb-8cb4-45fd75dfba8f.png)

5. If we want to add a manager to IT, we can do so by implementing role, department, name, and salary.

![Sc4](https://user-images.githubusercontent.com/62081345/94761248-8bb54580-0372-11eb-8d19-20e970f45b60.png)

**I used VS Code, Node.js, and MySql workbench for this project. I ran into some errors early on when it came to making promises and queries. Some of these errors still persist. I also had an issue with SQL workbench and VS code, I was having issues in vs code with localhost and connecting to mysql server. When selecting view all employees, none of them appear. But if I choose view employees, by deparment, that is displayed in the command line. There is also an error when I try to add an employee to a department. I used screenshots instead of gif video because the laptop I used for this project is having some issues and needs a deep diagnostics scan. Promise-sql was used after having problems turning the query into a promise.**



---



