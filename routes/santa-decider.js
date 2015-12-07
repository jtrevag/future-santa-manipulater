//return a list of nodes that have their selected giftee!

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
     
   
}

function createPersonList(){
    var personList = new Array();
    personList.push(new personNode("Trevor",    "jtrevag@gmail.com",                        "Christian"));
    personList.push(new personNode("Christian", "cmariek2014@gmail.com",                    "Trevor"));
    personList.push(new personNode("Hudson",    "cooled22@gmail.com",                       "Laura"));
    personList.push(new personNode("Laura",     "cooled22@gmail.com",                       "Hudson"));
    personList.push(new personNode("Chad",      "craymer13@gmail.com",                      "Lisa"));
    personList.push(new personNode("Lisa",      "Lisamreynolds22@gmail.com",                "Chad"));
    personList.push(new personNode("Cameron",   "Cameron.Elizabeth.Robertson@gmail.com",    "Nick"));
    personList.push(new personNode("Nick",      "Nicholas.s.Robertson@gmail.com",           "Cameron"));
    personList.push(new personNode("Steven",    "me@steven-schroeder.com",                  ""));
    shuffle(personList);
    return personList;
}

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

function createMatches(personList){
    var leastConnectionsIndex = getLeastConnections(personList);
    
    var firstPerson = personList[leastConnectionsIndex];
    var currentPerson = personList[leastConnectionsIndex];
    
    do{
        
        
        //Handling the case where we want to give to the first person, or OMIT the first person.
        var gifteeList = getLeastConnectionsList(shuffle(currentPerson.potentialGiftees));
        if(gifteeList.length == 1){
            currentPerson.giftee = gifteeList[0].name;
        } else {
            for(var z = 0; z < gifteeList.length; z++){
                if(gifteeList[z].name != firstPerson.name) {
                    currentPerson.giftee = gifteeList[z].name;
                    break;
                }
            }
        }
        
        
        
        //currentPerson.giftee = currentPerson.currentPerson.potentialGiftees[gifteeIndex].name;
        var overallGifteeIndex;
        
        //calculate giftee's overall index
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
        
        currentPerson = personList[overallGifteeIndex];
        
    }while(firstPerson != currentPerson);
    
    
}

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


sortingHat();