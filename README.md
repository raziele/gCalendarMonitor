# Google Calendar Events Monitor

## Why
Sometimes we want event openers to add useful information to their event so we can tell for sure if we are needed and prepare accordingly.

## What
This script continuously monitors the owner`s calendar.
This script monitors events updates in the owner's calendar (new events, updated events etc.)
Events that don't have the keywords mentioned in their description are declined and a cute-but-telling-off email message of your choice.
<<<<<<< HEAD
||||||| parent of 91ed194... fixing markers
<<<<<<< HEAD
=======

>>>>>>> 90cd49ccbe6fd180cc35a9c65ada153b6d5da9e0
=======

>>>>>>> 91ed194... fixing markers
The following events are not checked:
  - A cancelled event 
  - An all-day event
  - The event came from a different domain

Note that:                                                                                                        
 - All keywords are required to be in the description                                                                                                                                
 - Keywords are case insensitive   

## How (To Install)
Create a project with the script:
1. go to script.google.com (make sure you're connected with the account its calendar you'd like to monitor)
2. Create a new project (e,g "myAwesomeTimeSaverScript")
3. Open the project (go to "My Project" >  click your project name > click "Open Project"). You'll get to an IDE-like screen
4. Paste the code from this repo to the screen (monitorCalendarEvents.gs)
5. Under "Run" menu, Make sure "new Apps script runtime powered by Chrome V8" is disabled
6. Under "Edit" menu, click "Current project's triggers"
7. Click "Add Trigger" 
8. Make sure the following fields are filled correctly, then click save:
**Choose which function to run**: onCalendarChange
**Which runs at deployment**: Head
**Select event source**: From Calendar
**Enter calendar details**: Calendar updated
**Calendar owner email**: your account email
9. Back in the IDE-like screen, select "Resources" > "Advanced Google Services" and make sure Calendar API is on.

Now your project is ready to run.

## Script Permissions
Unfortunately, Google makes it harder to use some of Google Apps APIs, including the calendars. 
If you try to run the screen now, you'll get a "Sign in with Google temporarily disabled for this app" message.

To overcome this, we need to explicitely open those permissions using Google's oAuth mechanism.

Here how it goes:
1. Go to console.cloud.google.com
2. Click on "Select a project" (upper left area)
3. Click on "New project"
4. Give you project a name (e.g "Oauth-for-calendar-monitor", note the dashes) and click "Create" (it may take a few seconds for the server to create the project)
5. Select "API & Services" > "Dashboard" on the left meny
6. Click "Enable APIs and Services" (top area)
7. Search for "Google Calendar API", click it then click "Enable". Repeat the process with "Apps Script API".
8  From the left menu, select APIs & Services >  OAuth consent screen.
9. Select "External" if you're on a Gmail account or "Internal" If you're on a Gsuite account.
9. Make sure the following fields are filled correctly, then click "Save":
**Application name**: e.g "monitor_calendar"
**Add scope**: a selection screen will open. Make sure the following scopes are marked:
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/script.send_mail
10. Now, go to "Project Settings" (3 dots icon next to your profile photo) and copy the project number.
11. Go back to the IDE-like screen, select "Resources" > "Cloud Platfrom Project", enter the project number you got from last step and click "set project". Make sure to approve in the following screen.
12. Run the project by selecting "Run" > "Run function" > "onCalendarChange". You should get a message saying "This app is not verified".
13. Click the "Advanced" link next to the message, then "go to myAwesomeTimeSaverScript (unsafe)
14. Approve the permissions screen.
15 That's it! phew, that was long...


## Liability
Use this script at your own risk
