//return a list of nodes that have their selected giftee!
//var apiKey = "7VXmcSj45NS6GwcvPsg1fw";
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'secret.santa.frondz@gmail.com',
        pass: ''
    }
});

function personNode(name, email, excludedPerson) {
    this.name = name;
    this.giftee;
    this.email = email;
    this.excludedPerson = excludedPerson;
    this.potentialGiftees = Array();
    this.connections = 0;
}


function sortingHat(){
    // hit database to create a list of objects and put them in an array.
    var personList = createPersonList();
   
    setupNodes(personList);
   
    createMatches(personList);
   
    printMatches(personList);
    
    sendEmails(personList);
    
}

function createPersonList(){
    var personList = new Array();
    personList.push(new personNode("Trevor",    "jtrevag@gmail.com",                        "Christian"));
    personList.push(new personNode("Christian", "cmariek2014@gmail.com",                    "Trevor"));
    personList.push(new personNode("Hudson",    "cooled22@gmail.com",                       "Laura"));
    personList.push(new personNode("Laura",     "Laura.c.penrod@gmail.com",                       "Hudson"));
    personList.push(new personNode("Chad",      "craymer13@gmail.com",                      "Lisa"));
    personList.push(new personNode("Lisa",      "Lisamreynolds22@gmail.com",                "Chad"));
    personList.push(new personNode("Cameron",   "Cameron.Elizabeth.Robertson@gmail.com",    "Nick"));
    personList.push(new personNode("Nick",      "Nicholas.s.Robertson@gmail.com",           "Cameron"));
    personList.push(new personNode("Steven",    "me@steven-schroeder.com",                  ""));
    shuffle(personList);
    return personList;
}

// Function to shuffle the array; nothing more, nothing less. 
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function printMatches(personList) {
    for (var i = 0; i < personList.length; i++){
        console.log("Name of person: " + personList[i].name);
        console.log("Giftee: " + personList[i].giftee);
        console.log("-------");
    }
}

// Setting up each node and all of the nodes it can give gifts to. 
function setupNodes(personList){
    // i is the current person we are setting up nodes for
    for(var i = 0; i < personList.length; i++){
        // j is the person we are trying to add to their list
        for(var j = 0; j < personList.length; j++){
            // if i == j, then we are looking at the same person. if i's excluded person is the name of the person at j, don't include them.
            if(i != j && personList[i].excludedPerson != personList[j].name){
                personList[i].potentialGiftees.push(personList[j]);
                personList[i].connections++;
            }
        }
    }
}

// Iterating through all of the people and matching them with someone else.
function createMatches(personList){
    // Find the person with the least connections and start there.
    var leastConnectionsIndex = getLeastConnections(personList);
    
    // Setting up the actual objects. 
    var firstPerson = personList[leastConnectionsIndex];
    var currentPerson = personList[leastConnectionsIndex];
    
    do{
        // Handling the case where we want to give to the first person, or OMIT the first person.
        // Create a list of people who have the least connections out of the potentialGiftees the currentPerson can give to. 
        var gifteeList = getLeastConnectionsList(shuffle(currentPerson.potentialGiftees));
        // if there is only one person left, give to that person. (It's the firstPerson).
        if(gifteeList.length == 1){
            currentPerson.giftee = gifteeList[0].name;
        } else {
            // iterate through the people until we find NOT the first person, then assign them as the gift giver.
            for(var z = 0; z < gifteeList.length; z++){
                if(gifteeList[z].name != firstPerson.name) {
                    currentPerson.giftee = gifteeList[z].name;
                    break;
                }
            }
        }
        
        var overallGifteeIndex;
        //calculate giftee's overall index; that is, the index in the main list. 
        for(var y = 0; y < personList.length; y++){
            if(personList[y].name == currentPerson.giftee) {
                overallGifteeIndex = y;
                break;
            }
        }
        
        // Remove giftee from everyone's list
        
        //x is the index of the current person
        for(var x = 0; x < personList.length; x++){
            //w is the index of all of the person's giftees
            for(var w = 0; w < personList[x].potentialGiftees.length; w++){
                //if we find the person in the list with the same name as the currentPerson's giftee, remove them
                if(personList[x].potentialGiftees[w].name == currentPerson.giftee){
                    //Swap current index with the last element and pop
                    var personSwap = personList[x].potentialGiftees[(personList[x].potentialGiftees.length)-1];
                    personList[x].potentialGiftees[(personList[x].potentialGiftees.length)-1] = personList[x].potentialGiftees[w];
                    personList[x].potentialGiftees[w] = personSwap;
                    personList[x].potentialGiftees.pop();
                    personList[x].connections--;
                    break;
                }
            }
        }
        
        // the currentPerson is set to the person we just gave a gift to. 
        currentPerson = personList[overallGifteeIndex];
        
    }while(firstPerson != currentPerson);
    
    
}

// return the index of the person with the smallest index. This is the index of the main list. 
function getLeastConnections(personList) {
    var min = personList.length;
    var personIndex = 0;
    for (var i = 0; i < personList.length; i++) {
        if (personList[i].connections < min) {
            min = personList[i].connections;
            personIndex = i;
        }
    }
    return personIndex;
}

// create a list of people who have the minimum number of connections. 
function getLeastConnectionsList(personList) {
    var leastConnectionList = Array();
    var min = personList.length;
    
    //Calculate minimum number of connections
    for (var v = 0; v < personList.length; v++) {
        if (personList[v].connections < min) {
            min = personList[v].connections;
        }
    }
    
    //Create a list of people who have this many connections
    for(var u = 0; u < personList.length; u++){
        if(personList[u].connections <= min){
            leastConnectionList.push(personList[u]);
        }
    }
    
    return leastConnectionList;
}

function sendEmails(personList){
    for(var i = 0; i < personList.length; i++){
        var giver = personList[i].name;
        var email = personList[i].email;
        var giftee = personList[i].giftee;
        //var body = "Hello " + giver + "! You are giving a gift to " + giftee + ". \n Remember, there is a $30 limit and you have until the New Years Party to get your gift. \n Merry Christmas :)";
        var mailOptions;
        
        
        if(giver == 'Trevor'){
            mailOptions = {
                from: 'Secret Santa Frondz 2015 <secret.santa.frondz@gmail.com>', // sender address 
                to: email, // list of receivers 
                subject: 'Secret Santa 2015!!', // Subject line 
                text: 'Hello ' + giver + '! Please reply to this email to let me know I have your email input correctly and this message is not spam. \n Love, \n Santa', // plaintext body 
                html: '<p>Hello ' + giver + '! Please reply to this email to let me know I have your email input correctly and this message is not spam.</p> <br/> Love, <br/> Santa' // html body 
            };
    
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent to: ' + giver + ' \n ' + info.response);
             
            });
        }
        
    }
    
    
}

sortingHat();