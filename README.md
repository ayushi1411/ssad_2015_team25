# Elektoo #

### World's first choice engine. ###
The Elektoo project deals with the creation of a choice based search engine probably first of its kind.
The main problem this project is trying to solve:
- Choice Overload
- Wrong choices
- Unavailability of choice centric IT solutions

and to provide the user with results strictly related to te search he/she made.
***
### Features ###
Under this project the user is provided with two kinds of seaching methods to choose from. 
- Search Query Box
- Choice matrix
***
### Search Query Box ###
In this method of search the usser is provided with a query box in which the user gives an input(text) which is prcocessed by the system and if found some ambiguous ords then the system tries to resolve that ambiguity by giving the users some concrete suggestions in place of those ambigous words.
There is also another good feature implemented here which is the "count" related to th query made by the user, which gives the count of the product to be displayed as per the current search query.
The query box is also loaded with feaures like "auto-complete" and "auto-correct".
The final display of the query woulld be a list of products/items related to the query given for search.

***
### Choice Matrix ### 
Here the user will be provided with a 9x6 matrix haxing 9 product features and 5 values of those features(one column for the name of the feature).
Once a user selects a brand from the list of brands the user is provided on the selection of the choice matrix, he'll be displayed with the matrix related to that brand only. There will be options to select or deselect of diffeent tabs in the respected rows as per which the entire matrix will be updated. This method of seaarching will too have the "count" besides it as to diplay the total count of product to be displayed as the result of the till updated matrix.
The fianl display of this will be similar to the "Search Query Box", it will to list down the products.
On selection of the product it will dispay its all features and specifications.
***
### Things to do before running the applicaion. ###
#### install  ``` Express.js, Sequelize.js, Node.js, mysql``` 
#### Node.js #####
```
sudo apt-get update
sudo apt-get install nodejs
```
In most cases you also need to install `npm` node.js package manager. You can do this by typing.
```
sudo apt-get install npm
```
#### Express.js ####
```
npm install express
```
#### Sequelize.js ####
```
npm install sequelize
```
#### MySql ####
```
npm install mysql
```
##### editing some lines in the **Server.js** file as to make it compatible to use it on your system. #####
open file **Server.js** inside the source directory
change the line numbers 5, 17, 18, 19 as per the details of your systems database.
line 6 : ` var sequelize = new Sequelize('database-name', 'user', 'database-password'` and rest lines are self understanding.
**while selecting the port on which to run the apllication first check whetcher the port is already in use or not, if yes then first make that port free or use some other free port(change lines 75, 76 in Server.js file) to run the application.**
```
sudo netstat -tlnp             // to list the current ports listening / open.
sudo fuser XXXX/tcp           // to find which process is using the XXXX port.
sudo fuser XXXX/tcp -k           // to kill the XXXX process and make that port free.
```

**Now we are ready to run the application.**
***
### Running the Application. ###
* go to the source directory.
* run ``` npm install```then run ``` nodejs Server.js``` on your terminal.
* you will see a message on your terminal console `We have started our server on port XXXX` which shows that the application has started runnig on port **XXXX**.
* Now visit `localhost:XXXX` in your browser.
**Use the application and experiance the difference in searching.**
***
### Developing Team ####
* Aman Rai - Team Co-ordinator
* Ayushi Goyal - Tech
* Prachi Agrawal - Tech
* Vinay Singh - Documentation

***