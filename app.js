const qrcode = require("qrcode-terminal");
const express = require("express"); 
const morgan = require("morgan"); 
const { parse } = require("csv-parse");
const readline = require('readline');
const removeDuplicateLines = require('remove-duplicate-lines');
const { Client, LocalAuth, ChatTypes } = require("whatsapp-web.js");

var fs = require('fs');

var arrayNumbers =[]
var uniqueNumbers = [];
const port = 3030;
const client = new Client({
  authStrategy: new LocalAuth(),
}); 
const app = express();

client.initialize();

client.on("qr", (qr) => {
  console.log("********************************* Application is starting... *******************************")
  qrcode.generate(qr, { small: true });
  console.log("Qr generated")
});
client.on('authenticated', () => {
    console.log('AUTHENTICATED');

});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on("ready", async() => {
  console.log("Client is ready!");
  const chats = await client.getChats()
  var file = fs.createWriteStream('array.txt');
  file.on('error', function(err) { /* error handling */ });
   file.write( JSON.stringify(chats));
  file.end();
 
  chats.map((chat)=>{
    if(chat.isGroup){
    if(chat.groupMetadata.size>0){
        chat.groupMetadata.participants.map((users)=>{
            arrayNumbers.push(users.id.user)
            
        }) 
    }
    }
  })
//check for duplicates in arrat
uniqueNumbers = [...new Set(arrayNumbers)];
//write unique numbers to csv
console.log(uniqueNumbers)

//remove kenyan numbers
for(var i=uniqueNumbers.length-1 ; i>=0;i--){
  if(uniqueNumbers[i].includes("254")){
     uniqueNumbers.splice(i, 1);
  }
}
console.log(uniqueNumbers)
var file = fs.createWriteStream('number.csv');
file.on('error', function(err) { /* error handling */ });
uniqueNumbers.forEach((number)=>{
  fs.appendFile("contact2.txt", number+"\n", (err) => {
    if (err) {
      console.log(err);
    }
    
        
    
  });
 
})
const rl = readline.createInterface({
  input: fs.createReadStream('contact.txt')
});

// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms))
var array = fs.readFileSync('contact.txt').toString().split("\n")
console.log(array)
var interval = 10000; // how much time should the delay between two iterations be (in milliseconds)?
array.forEach(function (el, index) {
  setTimeout(function () {
    var numberprocessed = el.includes('@c.us') ? el : `${el}@c.us`;
    
    console.log(numberprocessed);
    try {
      client.sendMessage(numberprocessed, "join https://t.me/studenthelpcenter945 JOIN THOUSANDS OF INTERNATIONAL STUDENTS.").then((error)=>{"An error occurred sending to "+numberprocessed})
    } catch (error) {
      console.log(error)
    }
    //
    console.log("sending to the next person after 10 seconds...")
  }, index * interval);
});
console.log('Bot is done sending messages.');


    });
    
    


app.get('/', function (req, res) {
    res.send('Hello World');
 })


 client.on('group_join', (notification) => {
    // User has joined or been added to the group.
    console.log('join', notification);
    console.log(notification.recipientIds)
});






app.listen(port, () => {
    console.log(`Connected to server on port ${port}`);
  });