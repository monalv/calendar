
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
    var timeInterval = [];
 
    /*Matching events to intervals in the interval[][]*/
    //Fixme: Increment by min_diff_between_2_events
    for(var i=0;i<events.length;i++){
        //Fixme: Throw an error if start_time > end_time
        
        //Fixme: Conflicts is a misnomer. 1 event != conflict
        events[i].conflicts = 0;
        //Fixme: all conflicting events in same [j]; also add meta data for each [j].start & [j].end
        for(var j=events[i].start ; j<events[i].end; j++){
            timeInterval[j] = timeInterval[j] || [];
            timeInterval[j].push(events[i]);           
        }
    }

    /*Finding out the conflicting events at each interval and also the horizontal order for the events*/
    //Fixme: Increment by min_diff_between_2_events
    for (var i = 0; i < container_height; i++) {
        if(timeInterval[i] === undefined || timeInterval[i].length === 0)
            continue;
        var numOfEventsInInterval = 0 || timeInterval[i].length,
            eventOccurenceNumber = 0;
        for (var j = 0; j < timeInterval[i].length; j++) {
            var current_event = timeInterval[i][j];

            if(current_event.conflicts < numOfEventsInInterval) {
                console.log("Current event has less conflicts:" + current_event.conflicts + "<" + numOfEventsInInterval)
                current_event.conflicts = numOfEventsInInterval;
            }
            else if(numOfEventsInInterval < current_event.conflicts) {
                numOfEventsInInterval = current_event.conflicts;
            }
            if(!current_event.order) {
                current_event.order = eventOccurenceNumber;
                console.log("inside i : "+i+" event : ");
                console.dir(current_event);
                eventOccurenceNumber++;
            }
        }
    }
    console.log(">-----------------------<");
    /*Calculating the propotions of the event and appending the DOM*/
    renderEvent(events, container_width, parentDiv);  
}
function renderEvent(events, container_width, parentDiv) {
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
