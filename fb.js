
// Sample call for this function 

var events = [
 {start : 530, end : 700}, 
 {start : 30, end : 150},  
 {start : 300, end : 600}, 
 {start : 560, end : 620}, 
 {start : 100, end : 670}, 
 {start : 120, end : 300}, 
 {start : 400, end : 450} 
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
    for(var i=0;i<events.length;i++){
        //Fixme: Throw an error if start_time > end_time
        //Fixme: Conflicts is a misnomer. 1 event != conflict
        events[i].conflicts = 0;
        if(events[i].start>events[i].end){
            alert("error : start time of an event is greater than end time");   
        }
        else{
            for(var j=events[i].start ; j<events[i].end; j++){
                timeInterval[j] = timeInterval[j] || [];
                timeInterval[j].push(events[i]);           
            }
        }
    }

    /*Finding out the conflicting events at each interval and also the horizontal order for the events*/
    //Optimizeme: Increment by min_diff_between_2_events
    var numOfEventsInInterval;
    for (var i = 0; i < container_height; i++) {
        if(timeInterval[i] === undefined || timeInterval[i].length === 0)
            continue;
        var eventOccurenceNumber = 0;
        numOfEventsInInterval = 0 || timeInterval[i].length;

        timeInterval[i].sort(sortByOrder);
        /*
        console.log("SORTED");
        for (var j = 0; j < timeInterval[i].length; j++) {
            console.log("i : "+i+" j : "+j);
            console.log(timeInterval[i][j]);                  
        }
        */
        var eventOrderMap = {};
        for (var j = 0; j < timeInterval[i].length; j++) {
            var current_event = timeInterval[i][j];
            if(current_event.conflicts < numOfEventsInInterval) {
                current_event.conflicts = numOfEventsInInterval;
            }
            else if(numOfEventsInInterval < current_event.conflicts) {
                numOfEventsInInterval = current_event.conflicts;
            }
            if(!current_event.order) {
                while(eventOccurenceNumber in eventOrderMap){
                    eventOccurenceNumber++;
                } 
                current_event.order = eventOccurenceNumber;
                eventOrderMap[current_event.order]=true;                
                eventOccurenceNumber++;           
            }
            else{
                eventOrderMap[current_event.order]=true;
            }
        }
    }
    for(var i = 0; i < events.length-1; i++){
        var eventi = events[i];
        for(var j = i+1; j < events.length; j++){
            var eventj = events[j];
            if(isConflict(eventi,eventj)){
                eventi.conflicts = eventj.conflicts = Math.max(eventj.conflicts,eventi.conflicts);
            }
        }
    }
    console.dir(events);
    console.log(">-----------------------<");
    /*Calculating the propotions of the event and appending the DOM*/
    renderEvent(events, container_width, parentDiv);  
}
function renderEvent(events, container_width, parentDiv) {
    for (var i = 0; i < events.length; i++) {
        current_event = events[i];      

        current_event.width_px = container_width / current_event.conflicts;     /*Total width of the calendar divided by the total no of events to be fit in that*/
        current_event.height_px = current_event.end - current_event.start;      
        //Fixme: left not being set -> ordering not correct
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
function isConflict(a,b) {
    if(a.start == b.start || a.end == b.end)
        return true;
    else if(a.start < b.start && b.start < a.end)
        return true;
    else if(b.start < a.start && a.start < b.end)
        return true;
    return false;
}
function sortByStartTime(a,b) {
    return a.start-b.start;
}
function sortByOrder(a,b) {
  return (a.order!==undefined && b.order!==undefined)?a.order-b.order: ((a.order!==undefined)?-1:1);
}
