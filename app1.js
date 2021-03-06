
'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const path=require("path")
const app = express()
const port = 3000


app.use(bodyParser.urlencoded())
global.orders=[]

let states=[]// arrey 
//statesHTML.push('<html><head><link href="./css/style.css"  rel="stylesheet" type="text/css" ></head><body>')
states.push("ordered")
states.push("cooked")
states.push("served")
states.push("paid")

app.post('/PlaceOrder', (req, res) => {

  const order={}  //object
  order.state= "ordered"  
  order.tableNumber = req.body["tableNumber"]
  delete req.body.tableNumber
  order.items = req.body
  order.number = global.orders.length+1   //Note, the order number is 1 more than the orders index in the array (becuase we don't want an order #0)
  global.orders.push (order)  
  res.send( 'Order Accepted #' + order.number )
  get_table(order)
})


app.get('/view', (req, res) => {
  outputOrders(req,res)  
})

app.get('/setState',(req, res) => {
  setOrderState(req,res)  
  outputOrders(req, res)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })


app.use(express.static(path.join(__dirname, 'public')));

function outputOrders(req,res){

  let filter=req.query["filter"]

  
  let ordersHTML=[]
  ordersHTML.push('<html><head><link href="./css/style.css"  rel="stylesheet" type="text/css" ></head><body>')
  for (const order of global.orders){
    if (filter==null || order.state==filter){
      ordersHTML.push(orderHTML(order))    
    }
  }
  ordersHTML.push('</body></html>')
  res.send(ordersHTML.join(''))
}

function orderHTML(order){  
  let elements=[]  //Arrey
  elements.push(`<table class='table_Order'><thead><tr><th>Order# ${order.number}</th>
  <th>Table# ${order.tableNumber}</th></tr></thead>`)
  
  for (let key in order.items){
   const quantity=order.items[key]
    if (quantity>0){
      elements.push("<tr><td>" + quantity + " * " + key + "</td>")
    }
  }
  elements.push(`<td class='${order.state}'>${order.state}</td></tr></table>`)  
  elements.push(stateButtons(order))

  console.log(order);
  return (elements.join("") +"<br>")
}

function stateButtons(order){
  let buttons=[]// empty arrey
  for(const state of states){
    buttons.push('<a href=/setState?orderNumber=' + order.number + '&state=' + state +'><button>Mark as ' + state + ' </button></a>')
  }
  return ( buttons.join(' ') )
}
function setOrderState(req,res){
  //transition state - based on a ?state=ordernum NameValue pair
  let order = global.orders[parseInt(req.query["orderNumber"])-1]// req is object,query is object inside object
  order.state=req.query["state"]
}
/*Extentsion tasks:-
For clarity - these are OPTIONAL - ideas for extending this exercise into a portfolio piece ... something to show potential employers
You won't have all the skills yet - but you can revisit this project as your skills grow - and refactor/improve as you see fit.
1) (without Javascript) Add some basic input validation on the order page :-
BIG clue https://www.w3schools.com/tags/att_input_type_number.asp
2) Convert the view endpoint (/view in app.js) to output an HTML table of orders
You will need to convert the orderHTML to output a valid HTML table row
Use the backtick `${variable}` (template literals) syntax if you like (it does make things tidier)
3) Add a css class corresponding to the 'state' of orders and use them to set the background colour of the order state table cell
Ordered-red, cooked-orange, served-yellow, paid-green
3.5) Make the PlaceOrder page 'mobile friendly'  - increase the size of the arrows (or find another solution)
4) When you place an order - display your (the customers)  position in the queue (not quite as easy as it might sound)
5) Use a <thead> tag to lock the header rows of the orders table
https://www.w3schools.com/tags/tag_thead.asp
6) What happens if I use my browser back button and press  'Place order' (again) ?
Or if my Internet connection is flaky and I hit place order 6 times
Implement some form of idempotency token.
7) Render a meta refresh tag into the response - to have the 'order accepted/Position in queue 'page' continuously update
(This won't work .. in fact, I think it might be disastrous - but how could you make it work ?)
8) When I use a filter parameter http://localhost:3000/view?filter=ordered - and set an order to a new state - the list becomes unfiltered again - Task: - maintain the filter
9) Define some 'roles' (customer, chef, waitress, manager) and assign some (one or more) rights 'markCooked' 'markServed, 'markPaid'
9) More ideas:-
Add prices to the dishes
Make the menu (placeOrded.html) 'dynamic' (generated by the server)
Create bills/price the orders
Create a logon screen with a username/password
Create and maintain an audit trail of all actions, who did what, when
Add a screen to view the audit trail
Create a UI to edit the menu/create new dishes
Allow paid orders to be archived
Add dates/times to the orders
Split drinks orders from food orders and provide a screen for the barman
Produce a management dashboard - showing
	Average cooking time
	Average wait time (ordered->served)
	Daily turnover - perhaps as a bar chart - over the last 30 days (edited) 
w3schools.comw3schools.com
HTML input type="number"
Well organized and easy to understand Web building tutorials with lots of examples of how to use HTML, CSS, JavaScript, SQL, PHP, Python, Bootstrap, Java and XML.
w3schools.comw3schools.com
HTML thead tag
Well organized and easy to understand Web building tutorials with lots of examples of how to use HTML, CSS, JavaScript, SQL, PHP, Python, Bootstrap, Java and XML.*/
