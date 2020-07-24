/******************************************************************************
* Configuration

* (Mandatory) Emails not from this domain will be skipped
CAL_MON_INTERNAL_DOMAIN = 'my_organizaion.com'  

* Your calendar ID, can be found under: 
* Google Celendar Settings --> Settings for my calendars --> <Calendar name> --> Integrate Calendar
CAL_MON_CALENDAR_ID = 'my_user@my_organization.com' 

* Decline the event or only send an alerting email
CAL_MON_DECLINE_EVENT = true 

* Keywords to look for in event description \ notes (case insensitive)
CAL_MON_KEYWORDS = ['agenda', 'goal']  

* (Optional) Maximum number of events to process every time the function executes
CAL_MON_MAX_RETURNED_EVENTS = 100 

* (Optional) How many days should the function look ahead (in the future)
CAL_MON_DAYS_TO_LOOK_AHEAD = 14 
******************************************************************************/

//==================================
function onCalendarChange(){
  var properties = PropertiesService.getUserProperties();
  var options = {
    maxResults: CAL_MON_MAX_RETURNED_EVENTS
  };

  var syncToken = properties.getProperty('syncToken');
  var fullSync = properties.getProperty('fullSync'); 
  
  if (syncToken && fullSync == 'false') { //check this is true if properties don't exist
    options.syncToken = syncToken;
    } 
  else {
    // Sync events up to CAL_MON_DAYS_TO_LOOK_AHEAD days in the future.
    options.timeMin = getRelativeDate(CAL_MON_DAYS_TO_LOOK_AHEAD, 0).toISOString();
  }
  

  var events;
  var pageToken;
  
  do {
    try {
      options.pageToken = pageToken;
      events = Calendar.Events.list(CAL_MON_CALENDAR_ID, options);
      properties.setProperty('fullSync', 'false')
    } 
    catch (e) {
      // Check to see if the sync token was invalidated by the server;
      // if so, perform a full sync instead.
      if (e.message === 'Sync token is no longer valid, a full sync is required.') {
        properties.deleteProperty('syncToken');
        properties.setProperty(fullSync, 'true')
        onCalendarChange();
        return;
      } else {
        throw new Error(e.message);
      }
    }
  
    
    if (events.items && events.items.length > 0) {
      for (var i = 0; i < events.items.length; i++) {
        var event = events.items[i];
      
        if (event.status === 'cancelled') {
          console.log('Event name %s was cancelled.', event.summary);
          continue;
        } else if (isExternalCreator(event.creator.email)) {
                   console.log('Event name %s was created by external email ', event.summary);
                   continue;
        } else if (event.start.date){
                   console.log('Event name %s is an all-day event', event.summary);
                   continue;
        } else if (isMissingKeyWords(event.description)){
                   sendAlertEmail(event.organizer.email, event.summary);
                   if (CAL_MON_DECLINE_EVENT) {
                     var eve = CalendarApp.getEventById(event.id);
                     eve.setMyStatus(CalendarApp.GuestStatus.NO);
                   }
                   continue;    
        } else {
          consolde.log('Event %s looks good!', event.summary)
        }
      }
    } else {
      console.log('No events found.');
    }
         
    pageToken = events.nextPageToken;
  } while (pageToken);

  properties.setProperty('syncToken', events.nextSyncToken);
    
}

//==================================
function isExternalCreator(email){
  var domainRegexMatch = new RegExp('@(.+)');
  var e = domainRegexMatch.exec(email)[1];
  
  if (e != CAL_MON_INTERNAL_DOMAIN){
    return true;
  } else{
     return false;
    }
}

//==================================
function isMissingKeyWords(description){
  if(!description){
    return true
  }
  
  for (i=0; i<CAL_MON_KEYWORDS.length; i++){
    var word = CAL_MON_KEYWORDS[i];
    //var result = description.search(word,"i");
    var keyWordRegexMatch = new RegExp(word, "gi");
    var e = keyWordRegexMatch.exec(description);
 
    if(e == null){
      return true
    }
  }
  
  return false; 
}


//==================================
function sendAlertEmail(to, eventSummary) {
  var subject = ['Missing goal or agenda: ', eventSummary].join('');
  var alertMessage = ['Hi! It seems like your event:', 
                      eventSummary, 
                      'is missing a goal or an agenda in the event description.',
                      'Its important to me to have those so I know how can I contribute to the meeting',
                      'Could you please add those under the event description?',
                      'Until you do, I assume I am not needed so I am going focus my time on other matters', 
                      'Thanks!',
                      ].join('\n');
                   
  MailApp.sendEmail(to, eventSummary, alertMessage);
}
                      
                   
//==================================
function getRelativeDate(daysOffset, hour) {
  var date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}
