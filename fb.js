
// Sample call for this function 

var events = [
 {start : 30, end : 150},  // an event from 9:30am to 11:30am
 {start : 540, end : 600}, // an event from 6pm to 7pm
 {start : 560, end : 620}, // an event from 6:20pm to 7:20pm
 {start : 610, end : 670} // an event from 7:10pm to 8:10pm
];

layOutDay(events);


  function layOutDay(events) {
    var container_width = 600,
        container_height = 720;

  /*resetting the previous elements in the calendar if any*/
  var parentDiv = document.getElementById("calendar_block");
    while (parentDiv.firstChild) {
        parentDiv.removeChild(parentDiv.firstChild);
    }

    events.sort(sortByStartTime);
    var intervalArray = [];

    /*Intializing an array[][] for every time interval (i.e from 9.00 am(0) to 9.00 pm(720))*/
     for (var i=0; i<container_height; i++) {
       intervalArray[i] = [];
     }

    /*Matching events to intervals in the interval[][]*/
    for(var i=0;i<events.length;i++){
        var startTime =  events[i].start,
            endTime =  events[i].end;
            events[i].conflicts = 0;

    //Fixme: Throw an error
        if(startTime > endTime){
            temp = startTime;
            startTime = endTime;
            endTime = temp; 
        }
    
        for(var j=startTime ; j<endTime; j++){              
            intervalArray[j].push(events[i]);           
        }
    }

    /*Finding out the conflicting events at each interval and also the horizontal order for the events*/
  for (var i = 0; i < container_height; i+=10) {
    var numOfEventsInInterval = intervalArray[i].length;
    var eventOccurenceNumber = 0;

    if (numOfEventsInInterval > 0) {
      //console.log("i : " + i + " objects length : " + intervalArray[i].length);       
      intervalArray[i].sort(sortByOrder);
      console.log("SORTED");
      
      // for (var j = 0; j < numOfEventsInInterval; j++) {
      //     console.log(intervalArray[i][j]);
      // }

      for (var j = 0; j < numOfEventsInInterval; j++) {
        var current_event = intervalArray[i][j];
        console.log(current_event);
        
        if (current_event.conflicts < numOfEventsInInterval) {
          current_event.conflicts = numOfEventsInInterval;
          if(!current_event.order){
            current_event.order = eventOccurenceNumber;
            console.log("inside i : "+i+" event : "+current_event)
          }
          eventOccurenceNumber++;
        }
      }
    }
  }
  console.log("-----------------------");
    
    /*Calculating thr positions and appending the DOM*/
  for (i=0; i<events.length; i++) {
    current_event = events[i];      

    //console.log(current_event);
    current_event.width_px = container_width / current_event.conflicts;     /*Total width of the calendar divided by the total no of events to be fit in that*/
    current_event.height_px = current_event.end - current_event.start;      
    current_event.x_px = current_event.order * current_event.width_px ;    /*left value determined by the order number of the event * the element width */
    current_event.y_px = current_event.start;

    var div = document.createElement("div");
    div.setAttribute('id','event')
    div.style.width = current_event.width_px + "px";
    div.style.height = current_event.height_px + "px";
    div.style.top = current_event.y_px + "px";
    div.style.left = current_event.x_px + 10 +"px";

    var text = "<p class=\"p1text\">Sample Item " + i + "</p><p class=\"p2text\">Sample location@" + current_event.start + "-" + current_event.end + "</p>";
    div.innerHTML = text;
    parentDiv.appendChild(div);
  }
}

function sortByStartTime(a,b) {
    return a.start-b.start;
}
function sortByOrder(a,b) {
  return (a.order!==undefined && b.order!==undefined)?a.order-b.order: (a.order?-1:1);
}
