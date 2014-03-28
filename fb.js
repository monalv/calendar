/*
Sample call for this function 

var events = [
 {start : 30, end : 150},  // an event from 9:30am to 11:30am
 {start : 540, end : 600}, // an event from 6pm to 7pm
 {start : 560, end : 620}, // an event from 6:20pm to 7:20pm
 {start : 610, end : 670} // an event from 7:10pm to 8:10pm
];

layOutDay(events);
*/

  function layOutDay(events) {
   
  /*resetting the previous elements in the calendar if any*/
  var parentDiv = document.getElementById("calendar_block");
	while (parentDiv.firstChild) {
    	parentDiv.removeChild(parentDiv.firstChild);
	}

	var intervalArray = [];

	/*Two dimensional array*/
	/*Intializing an array for every time interval (i.e from 9.00 am(0) to 9.00 pm(720))*/
     for (var i=0; i<720; i++) {
       intervalArray[i] = [];
     }

	/*Putting events in each of the corresponding interval array*/
	for(var i=0;i<events.length;i++){
		var current_event = events[i];
		var startTime =  current_event.start;
		var endTime =  current_event.end;

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
  for (var i = 0; i < 720; i++) {
    var interval_length = intervalArray[i].length;
    var order_count = 0;

    if (interval_length > 0) {
      console.log("i : "+i+" objects length : "+intervalArray[i].length);       
      intervalArray[i].sort(sortingOrder);
      console.log("SORTED");
      
      for (var j = 0; j < interval_length; j++) {
          console.log(intervalArray[i][j]);
      }

      for (var j = 0; j < interval_length; j++) {
        var current_event = intervalArray[i][j];
        console.log(current_event);
        
        if (!current_event.conflict || current_event.conflict < interval_length) {
       	  current_event.conflict = interval_length;		
       	  if(!current_event.order){
            current_event.order = order_count;
            console.log("inside i : "+i+" event : "+current_event)
          }
          order_count++;
        }
      }
    }
  }
  console.log("-----------------------");
    
	/*Calculating thr positions and appending the DOM*/
  for (i=0; i<events.length; i++) {
    current_event = events[i];      

    console.log(current_event);
    current_event.width_px = 600 / current_event.conflict;   /*Total width of the calendar divided by the total no of events to be fit in that*/
    current_event.height_px = current_event.end - current_event.start; /*left value determined by the order number of the event * the element width */
    current_event.x_px = current_event.order * current_event.width_px ;    
    current_event.y_px = current_event.start;

    var div = document.createElement("div");
    div.style.width = current_event.width_px + "px";
    div.style.height = current_event.height_px + "px";
    div.style.top = current_event.y_px + "px";
    div.style.left = current_event.x_px + 10 +"px";
    div.style.position = "absolute";

    div.style.background="#FFFFFF";
    div.style["box-sizing"] = "border-box";
    div.style.overflow="visible";
    div.style["border-left"] ="2px solid rgb(75,110,169)";
    div.style["border-top"] ="0.5px solid rgb(213,213,213)";
    div.style["border-bottom"] ="0.5px solid rgb(213,213,213)";
    div.style["border-right"] ="0.5px solid rgb(213,213,213)";              
    div.style.color = "RGB(75,110,169)";

    var text = "<p class=\"p1text\">Sample Item</p><p class=\"p2text\">Sample location</p>";
    div.innerHTML = text;
    parentDiv.appendChild(div);
  }
}

 function sortingOrder(a,b) {
  var shouldBeSorted = (a.order!==undefined && b.order!==undefined)?a.order-b.order: (a.order?-1:1);
  return shouldBeSorted;
}
function sortByOrder(a,b){

  console.log("sorting");
  if(a.order === undefined){
    console.log("inside !a.order : "+a.order+" "+b.order);
    return 1;
  }
  else if(!b.order === undefined){    
    console.log("inside !b.order : "+a.order+" "+b.order);
    return -1;
  }
 console.log("outside ! : "+a.order+" "+b.order);
  return (a.order - b.order);
}
