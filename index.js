//Peter Manca
//Upload script for Big Red Liquors


//bring in dependencies
var hubspot = require('hubspot-api-wrapper')
var ctj = require('csvtojson')
var fs = require('fs')
var Log = require('log')
  , log = new Log('info', fs.createWriteStream('my.log'));


//set up map and wrapper
var contactMap = new Map()
var deals = []
const csvFilePath = './deals/BRL2.csv'
var brlHapiKey = "0ddfd73a-8cc0-42a2-8d57-cd61a3916285"
var testHapiKey = "3cd56db7-201e-4b8b-b041-07c409b85a02"

//initialize wrapper
var initiated = hubspot.init({type: "hapikey",value: brlHapiKey})
console.log("API Wrapper was initiated: " + initiated)


console.time("get contacts")






hubspot.contact.getAll(["customer_id","firstname","lastname"]).then(response => {
	//console.log(response[0])
	//console.log(response.length)
	log.info("filling in map")
	let i
	for(i = 0; i < response.length; i++ ){
		if(response[i].properties.hasOwnProperty("customer_id")){
			contactMap.set(response[i].properties.customer_id.value,response[i].vid)
		}
	}
	go()
}).catch(err => {
	console.log(err)
})

function go(){
	console.timeEnd("get contacts")
	//console.log(contactMap.get("446660480804"))
	addDealstoMem()
	
}

function addDealstoMem(){
	
	ctj()
	.fromFile(csvFilePath)
	.on('json',(jsonObj)=>{
    	deals.push(jsonObj)
    	log.info(jsonObj)
	})
	.on('done',(error)=>{
    	console.log('end: pushed ' + deals.length + " deals") 
    	log.info("There are: " + deals.length + " deals");
    	console.log(deals[0])
    	createDeals()   	
	})
}


async function createDeals(){
	console.log("Creating " + deals.length + " deals")
	let i
	for(i = 0; i < deals.length; i++){
		//log.info(deals[i])
		if(deals[i]["Customer ID"]){
			var properties = {
					"associations": {
					    "associatedVids": [
					      contactMap.get(deals[i]["Customer ID"])
					    ]
						  },
				"properties": [
				    {
				      "value": "closedwon",
				      "name": "dealstage"
				    },
				    {
				      "value": deals[i]["Trans Date"],
				      "name": "trans_date"
				    },
				    {
				      "value": "default",
				      "name": "pipeline"
				    },
				    {
				      "value": deals[i]["Trans Num"],
				      "name": "trans_num"
				    },
				    {
				      "value": deals[i]["Trans Line"],
				      "name": "trans_line"
				    },
				    {
				      "value": deals[i].Store,
				      "name": "store"
				    },
				    {
				      "value": deals[i].UPC,
				      "name": "upc"
				    },
				    {
				    	"value": deals[i].Description,
				    	"name": "description"
				    },
				    {
				    	"value": deals[i].Size,
				    	"name": "size"
				    },
				    {
				    	"value": deals[i]["Qty Sold"],
				    	"name": "qty_sold"
				    },
				    {
				    	"value": deals[i]["Sell Price"],
				    	"name": "sell_price"
				    },
				    {
				    	"value": deals[i]["Base Price"],
				    	"name": "base_price"
				    },
				    {
				    	"value": deals[i].Dept,
				    	"name": "dept"
				    },
				    {
				    	"value": deals[i].BRD_Name,
				    	"name": "dealname"
				    },
				    {
				    	"value": deals[i].Category,
				    	"name": "category"
				    },
				    {
				    	"value": deals[i].Region,
				    	"name": "region"
				    },
				    {
				    	"value": deals[i]["Size/Var"],
				    	"name": "size_var"
				    }
		  		]
	  		}
	  }else{
	  	var properties = {
		
			"properties": [
			    {
			      "value": "closedwon",
			      "name": "dealstage"
			    },
			    {
			      "value": deals[i]["Trans Date"],
			      "name": "trans_date"
			    },
			    {
			      "value": "default",
			      "name": "pipeline"
			    },
			    {
			      "value": deals[i]["Trans Num"],
			      "name": "trans_num"
			    },
			    {
			      "value": deals[i]["Trans Line"],
			      "name": "trans_line"
			    },
			    {
			      "value": deals[i].Store,
			      "name": "store"
			    },
			    {
			      "value": deals[i].UPC,
			      "name": "upc"
			    },
			    {
			    	"value": deals[i].Description,
			    	"name": "description"
			    },
			    {
			    	"value": deals[i].Size,
			    	"name": "size"
			    },
			    {
			    	"value": deals[i]["Qty Sold"],
			    	"name": "qty_sold"
			    },
			    {
			    	"value": deals[i]["Sell Price"],
			    	"name": "sell_price"
			    },
			    {
			    	"value": deals[i]["Base Price"],
			    	"name": "base_price"
			    },
			    {
			    	"value": deals[i].Dept,
			    	"name": "dept"
			    },
			    {
			    	"value": deals[i].BRD_Name,
			    	"name": "dealname"
			    },
			    {
			    	"value": deals[i].Category,
			    	"name": "category"
			    },
			    {
			    	"value": deals[i].Region,
			    	"name": "region"
			    },
			    {
			    	"value": deals[i]["Size/Var"],
			    	"name": "size_var"
			    }
	  		]
	  	}

	  }
		
		for(var x = 0; x < 100000; x++){}

	  	//log.info(properties)
	  
	  	await hubspot.deal.create(properties).then(response => {
			log.info("Deal: " + i + "  "  )
			log.info(response)
			//console.log(contactMap.get(deals[i]["Customer ID"]))
			console.log("Created Deal: " + i)
			
		}).catch(err => {
			log.info("Deal Error: " + i + "  "  )
			log.info(err)
			console.log(err)
		})
	  
		
	  
		
	}//end of for loop
	
}





// var dealsTest = { 'Customer ID': '081128011680',
//   'Trans Date': '5/26/16',
//   'Trans Num': '309121',
//   'Trans Line': '1',
//   Store: '218',
//   UPC: '822372105486',
//   Description: 'Bella Vita Gift Bag Ribbons 1btl',
//   Size: '',
//   'Qty Sold': '1',
//   'Sell Price': '1.59',
//   'Base Price': '1.59',
//   Dept: 'Misc',
//   BRD_Name: 'Bella Vita',
//   Category: 'Gift Bags & Boxes',
//   Region: '',
//   'Size/Var': '' }