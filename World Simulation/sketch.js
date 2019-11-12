// Required variables
let resources = [];
let resourceNames = ["Water", "Trees", "Grass", "People"];
const resourceRandom = 500000000;
let day = new Day();
let width = 800, height = 400;
let daysPassed = 0;
let disease = false;
let dayState = 0;

// Debug variables
const debug = false;
let cycles = 0;
let daySaid = false;

function setup() {
  createCanvas(width, height);
  for (let i = 0; i < resourceNames.length; i++) {
    resources.push(new Resource(resourceNames[i], Math.floor(Math.random() * resourceRandom)));
  }
  
  displayDebug();
}

function draw() {
  background(220);
  let size = resources.length;
  for (let i = 0; i < resources.length; i++) {
    let resource = resourceSearch(i);
    text(resource.name(), width/4, height/size);
    text(resource.amount(), (width/4)+100, height/size);
    text(resource.removed(), (width/4)+250, height/size);
    if (resource.removed())
      text(resource.dayRemoved(), (width/4)+300, height/size);
    size -= 0.7;
  }
  if (!worldDestroyed())
    dayPass();
  
  if (debug) {
    if (daysPassed%50 === 0 && daySaid === false)
      console.log("Day " + daysPassed + " reached within " + cycles + " cycles.");
    daySaid = true;
  }
}

// Displays resources and their amount if the debug variable is enabled.
function displayDebug() {
  if (debug) {
    for (let i = 0; i < resources.length; i++) {
      console.log(resources[i].name() + " | " + resources[i].amount() + " | " + resources[i].removed());
    }
    console.log();
  }
}

// Checks to see if the world has been destroyed
function worldDestroyed() {
  let check = resources.length;
  for (let i = 0; i < resources.length; i++) {
    if (resourceSearch(i).removed())
      check--;
  }
  return check === 0;
}

// Finds a resource within the resources list by name. If none is found,
//  throws an error
function findResource(name) {
  let test = -1;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  for (let i = 0; i < resources.length; i++) {
    if (resources[i].name() === name) {
      test = i;
    }
  }
  if (test === -1) {
    throw new Error("Name of the resource not found: " + name);
  } else {
    return resources[test];
  }
}

// Returns the resource at position a.
//  If a is bigger than resource array, throws an error.
function resourceSearch(a) {
  a = parseInt(a);
  if (a > resources.length)
    throw new Error("The number " + a + " is too big.");
  
  return resources[a];
}

// This is the main function
//  TODO: Look at notes
function dayPass() {
  cycles++;
  if (dayState === 1) {
    daysPassed++;
    dayState = 0;
    if (daySaid && debug)
      daySaid = false;
  }
  if (!day.returnState()) {
    for (let i = 0; i < resources.length; i++) {
      let resource = resourceSearch(i);
      if (resource.name() != "People" && !findResource("People").removed()) {
        resource.changeAmount(-30 - (Math.floor(Math.random() * findResource("People").amount())%260));
      }
      if (findResource("People").removed())
        if (daysPassed % 4 === 0)
          resource.changeAmount(-10);
      if (resource.removed() && resource.dayRemoved() == 0)
        resource.changeDayGone(daysPassed);
    }
  
  removePeople();
  dayState += 0.5;
    day.changeState();
  } else {
    for (let i = 0; i < resources.length; i++) {
      let resource = resourceSearch(i);
      if (resource.name() != "People" && !findResource("People").removed()) {
        resource.changeAmount(-15 - (Math.floor(Math.random() * findResource("People").amount())%100));
        if (findResource("People").removed())
          if (daysPassed % 4 === 0)
            resource.changeAmount(-10);
      if (resource.removed() && resource.dayRemoved() == 0)
        resource.changeDayGone(daysPassed);
      }
    }
    removePeople();
    dayState += 0.5;
    day.changeState();
  }
}
  
// To remove the people resource, this algorithm is used.
function removePeople() {
  let resource1 = findResource("People");
  resource1.changeAmount(-50);
  resource1.changeAmount(Math.floor(Math.random() * 80));
  if (findResource("Water").removed())
    resource1.changeAmount(-1500 + Math.floor(Math.random() * 40));
  if (findResource("Trees").removed())
    resource1.changeAmount(-800);
  if (findResource("Grass").removed())
    resource1.changeAmount(-40);
  
  if (disease)
    resource1.changeAmount(-Math.floor(Math.random() * 2300));
  if (resource1.removed() && resource1.dayRemoved() == 0)
        resource1.changeDayGone(daysPassed);
  
  if (!resource1.removed())
    randomEvents();
}

// To simulate life better, with random events.
function randomEvents() {
  let eventPick = Math.floor(Math.random() * 9);
  switch (eventPick) {
    // Mass Murder
    case 1:
      findResource("People").changeAmount(-Math.floor(Math.random() * 1000));
      break;
    // Multiple births
    case 2:
      findResource("People").changeAmount(Math.floor(Math.random() * 600));
      break;
    // Trees planted
    case 3:
      findResource("Trees").changeAmount(Math.floor(Math.random() * 10000));
      break;
    // Forest Fire
    case 4:
      findResource("Trees").changeAmount(-Math.floor(Math.random() * 5000));
      findResource("Grass").changeAmount(-Math.floor(Math.random() * 100000));
      break;
    // Nuke
    case 5:
      findResource("People").changeAmount(-Math.floor(Math.random() * 25000));
      break;
    // Disease
    case 6:
      disease = true;
      break;
    // Removed disease
    case 7:
      disease = false;
      break;
    // Not defined
    default:
      break;
  }
}