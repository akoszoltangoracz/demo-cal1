#User Features
- Register/login
- Change password
- List interests
- Subscribe to interests
- Create new event in an interest
- Manage own events
- Create post in an interest
- Manage own posts
- List posts from all (or the selected) subscribed interests (feed)
- List events from all (or the selected) subscribed interests (calendar?)
- Attend to events

#Admin Features
- Manage interests
- Manage posts
- Manage events

#Schemas

###User
| Property | Type | Description |
|----------|------|-------------|
|username  |string||
|password  |string||
|interests |Array of ids | interests ids|
|isAdmin| boolean ||
|createdAt| date | creation date|

###Interest

| Property | Type | Description |
|----------|------|-------------|
|name|string||
|description|string||
|coverUrl|string|Cover picture's url|
|createdBy|id||
|createdAt| date | creation date|

###Event

| Property | Type | Description |
|----------|------|-------------|
|title|string||
|description|string||
|coverUrl|string|Cover picture's url|
|interestId|id|Interest id|
|startDate|date||
|endDate|date||
|createdBy|id||
|createdAt| date | creation date|


###Post

| Property | Type | Description |
|----------|------|-------------|
|content|string||
|imageUrl|string|picture's url|
|interestId|id|Interest id|
|createdBy|string||
|createdAt| date | creation date|