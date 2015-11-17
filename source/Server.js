var express=require('express');
var app=express();
var  mysql=require('mysql');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('data', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'data'
});

connection.connect();
app.use(express.static('public')); // serving static files in express.

app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/JS'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/',function(req,res){
res.render('index.html');
});


// autocomplete feature implementation
app.get('/search',function(req,res){

  
  var param_p = ['company', 'model','color'];
  var exp_words = ['with', 'having', 'have', 'of', 'not', "don't", 'for', 'amount', 'price', 'cost', 'and',
                   'lessthan', 'greaterthan', 'between', 'under', 'equal', 'below', 'above', 'phone', 'company',
                    'rs', 'color', 'coloured', 'screen', 'screensize'];

  console.log("query string");
  console.log(req.query.key);
  var arr = req.query.key.toString().split(/\b\s+/);

  var len = arr.length;
  var last_word = arr[len-1].toLowerCase();

  var data = [];
  var str = '^' + last_word + '.*';

  console.log('regex');
  console.log(str);
  var re = new RegExp(str, "g");

  for(var i=0; i<exp_words.length; i++)
  {
    if(re.test(exp_words[i]))
      data.push(exp_words[i]);
  }


// partially manipulating asynchronous callback by creating partial function for each turn of the loop
  for(var i=0; i<param_p.length; i++) (function(i){
   var  qstr='select distinct '  + param_p[i] + ' from data where ' + param_p[i] + ' like "' + last_word + '%";'; 

    connection.query(qstr, function(err, rows, fields) {

    if (err) throw err;
   

    for(var j=0; j<rows.length; j++)
     {
 
       var temp2 = qstr.split(/\b\s+/);
       console.log(temp2[2]);
       console.log(rows[j][temp2[2]]);
       data.push(rows[j][temp2[2]]);
      
      }
    
    res.end(JSON.stringify(data));
  
  });
  }) (i);

});



app.get('/getcompanydata',function(req,res) {
 //   console.log("This is the query -> ");
   // console.log(req.query.q);
  
  // tokenizing the input string(user query) using whitespaces in an array of strings "arr"
    var arr = req.query.q.toString().split(/\b\s+/);
    
  // Normalising the entire search query and converting it into small letters for structured search.  
    for (var i = 0; i < arr.length; i++) {   
      arr[i]=arr[i].toLowerCase();
    };

 
 // list of "expected words" as parameters' name in the query
    var param_phone = ['phone', 'mobile', 'company'];
    var param_price = ['amount', 'price', 'cost'];
    var param_camera = ['camerasize', 'camera'];
    var param_screen = ['screen', 'screensize'];
    var param_color = ['color', 'coloured', 'colored','coloured'];


    // List of values for parameters as available in the database.
  	var phones_list = ['Samsung' , 'Motorola', 'Sony', 'Meizu', 'Gionee', 'Apple' ,
                       'Asus', 'HTC', 'Google', 'Spice', 'Nokia'];
  	var color_list = ['black', 'white', 'blue', 'pink', 'red', 'grey'];

    // variable to check whether the operator is explicitly mentioaned in the query or not.
    var optr=0;

    // dictionary consisting of different operators and their corresponding "meanings" as key-value pairs 
    var opt1 = {"having": " = ", "have": " = ", "lessthan" : " < " ,"less" : " < " , "greaterthan": " > ","greater than": " > ", 
                  "not":" != ", "above": " > ", "below": " < ", "under": " < ", "equal": " ="};
    
    // dictioanry of operators to be used in case of presence of negation keywords in the query.
    var opt2 = {"having": " != ", "have": " != ", "lessthan" : " >= " , "greaterthan": " <= ", 
                  "not":" != ", "above": " <= ", "below": " >= ", "under": " >= ", "equal": " !="};
   
   // initial query
  	var q_string='select * from data where ';

    // "flag" variable is set to 1 when the first parameter is identified in the query.
  	var flag=0;

    // "temp" variable is set to 1 when any word present in the query is identified as a parameter.
    var temp=0;


      // iterating over the entire in a word by word fashion and identifying that word as a parameter
  		for(var i=0; i<arr.length; i++)
  		{
          temp=0;

          var start_index=i-2 ;
          start_index=Math.max(start_index, 0);
          var end_index=Math.min(i+4, arr.length);

          // "start_index" and" end_index" are the variables that bound the indices around the parameter,
          // in which the "values" and the "operators" will be looked for.

          lowerpar=arr[i].toLowerCase();
          match_param(param_phone, lowerpar,start_index, end_index);
          if(temp!=1)
             match_param(param_price, lowerpar,start_index, end_index);

          if(temp!=1)
             match_param(param_camera, lowerpar,start_index, end_index);

          if(temp!=1)
             match_param(param_screen, lowerpar,start_index, end_index);

          if(temp!=1)
             match_param(param_color, lowerpar,start_index, end_index);

  		}

      // concatinating the query string with a semicolon in the end.
  	q_string=q_string.concat(";");


    // functions that gets invoked , whenever we need to check a word for a parameter.
    // "word" here refers to the word present in the input query that is being ckecked for a parameter.
    // e.g. for the query, "samsung phone ", here "word" will be phone.
    function match_param(param_list, word, start_index, end_index){

      optr=0;
      for(var j=0; j<param_list.length; j++)
      { 

          // incase the word is a parameter
         if(param_list[j].toLowerCase().localeCompare(word)==0)
         {         
      //    console.log("parameter");
        //  console.log(param_list[0]);
          temp=1;


          if(flag==1)
            q_string=q_string.concat(" and ");


           // calling the helper functions "phone_query" and "price_query" to check
           // for values and operators for the identified parameter.

           if(param_list[0]=='phone')
              phone_query(start_index, end_index, phones_list, 'company');
           else if(param_list[0]=='amount')
              price_query(start_index, end_index, 'price');
           else if(param_list[0]=='camerasize')
              price_query(start_index, end_index, 'camera');
           else if(param_list[0]=='screen')
              price_query(start_index, end_index, 'screen_size');
           else if(param_list[0]=='color')
              phone_query(start_index, end_index, color_list, 'color');
           flag=1;
            break;
          }
    }
  }

  	// function to get values for corresponding parameters
  	function phone_query(start_index, end_index, list, parmt){

      if(parmt.toLowerCase().localeCompare("company")==0)
      {
        var lim=arr.indexOf("phone");
        end_index=lim;
        console.log(lim);
      }  
     

     // "list" here refers to either "phones_list" or "color_list" to check for the value of the parameter. 
     // function that checks for the operator for the corresponding parameter in the query.
      check_opt( start_index, end_index, parmt);
  		for(var w=start_index; w<end_index; w++)
  		{
  			var fr=0;
  			for(var fe=0; fe<list.length; fe++)
  			{
  				if(arr[w].toLowerCase().localeCompare(list[fe].toLowerCase())==0)
  				{
  					fr=1;
  					break;
  				}
  			}
  			if(fr==1)
  				break;
  		}
  	


  		if(w!=end_index && optr==1)
  			q_string=q_string.concat("'", list[fe], "'");
      else if(w!=end_index)
        q_string=q_string.concat(parmt, " =", "'", list[fe], "' ");
  		else
  			q_string=q_string.concat(parmt, "!= ", '""', " ");
  	}  


  	function price_query(start_index, end_index, parmt){

      check_opt( start_index, end_index, parmt);
      console.log(q_string);
      console.log(optr);
  		for(var w=start_index; w<end_index;w++)
  			{
  				var fr=0;

          // incase of the parameters such as "price" , "camerasize", "screensize", check for the nearby numerical value.
          // also govern the range limits. for example in case of price , it should be greater than 1000rs, etc.
  				if(parseInt(arr[w])==arr[w]	 &&  ((parseInt(arr[w])>1000 && (parmt.localeCompare('price')==0)) || (parseInt(arr[w])<10 && (parmt.localeCompare('screen_size')==0)) || (parseInt(arr[w])<20 && (parmt.localeCompare('camera')==0))))  
  				{
  					var operator=" = ";
  					break;
  				}
  			}

      if(w!=end_index && optr==1)
        q_string=q_string.concat( parseInt(arr[w]));
      else if(w!=end_index)
        q_string=q_string.concat(parmt, " = ", parseInt(arr[w]));
  		else if(w==end_index && optr!=1)
  				q_string=q_string.concat(parmt, " ", "!= ", 0, " ") ;
      else 
      {
        
          q_string = q_string.substring(0, q_string.length - 3);
          q_string=q_string.concat( " = ", 0, " ") ;
      }
    
  	}


    function check_opt(start_index, end_index, parmt){

      var operator;
      for( var w=start_index; w<end_index; w++)
      {

        // if there is a sign of negation in the query, operate on "opt2", otherwise operate on "opt1".
        if((arr[w].toLowerCase().localeCompare("don't")==0) || (arr[w].toLowerCase().localeCompare("not")==0) || (arr[w].toLowerCase().localeCompare("no")==0)){
          
          // checking for the word after the negation word.
          // if no word is present it is simplt assumed to be "not equal to".
          if(arr[w+1] in opt2)
            operator = opt2[arr[w+1]];
          else
            operator = " != " ;
            break;
        } 
        else if(arr[w] in opt1){
          operator = opt1[arr[w]];
        break;
        }
      }

      // if operator is specified, append it to the query string.
      if(w!=end_index)
      {
        optr=1;
        q_string=q_string.concat(parmt, operator) ;
      }
    
    }

  	// executing the query
    sequelize.query(q_string).spread(function(studentsdata,metadata)
    {
       res.setHeader("Access-Control-Allow-Origin", "*");
       res.json({StudentsDataOut:studentsdata})
       // res.render('demo.html')   
   }); 
});



app.get('/phoneinfo',function(req,res) {
    console.log("This is the query -> ");
    console.log(req.query.pid);
    QueryString = 'select * from data where phoneid= '+ req.query.pid + ';';
    sequelize.query(QueryString).spread(function(studentsdata,metadata)
    {
       res.setHeader("Access-Control-Allow-Origin", "*");
       res.render('phoneinfo.html',{StudentsDataOut:studentsdata})
       // res.render('demo.html')   
   });
});

app.get('/brands',function(req,res){
    QueryString='select distinct(company) from data;';
/*connection.query((QueryString),function(err,rows,field){
if(err) throw err;
console.log(rows[0].company);

});*/
    sequelize.query(QueryString).spread(function(studentsdata,metadata){
      res.setHeader("Access-Control-Allow-Origin","*");
      console.log(studentsdata[0].company);
      res.render('brands.html',{CompanyData:studentsdata})
    });
});

app.get('/matrix',function(req,res){
    QueryString="select * from data where company ='"+req.query.brand+ "' order by price;";
    sequelize.query(QueryString).spread(function(studentsdata,metadata){
      res.setHeader("Access-Control-Allow-Origin","*");
      res.render('matrix.html',{MatrixData:studentsdata})
    });
});

var server=app.listen(3000,function(){
console.log("We have started our server on port 3000");
});

