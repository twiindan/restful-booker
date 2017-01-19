# restful-booker
A simple Node booking form for testing RESTful web services.

# Requirements
- Node 5.0.0
- Mongo 2.6.5

# Installation
1. Clone the repo
2. Navigate into the restful-booker root folder
3. Run ```npm install```
4. Run ```npm start```

# API
The API for this application can be found by importing the following collections into [Postman](https://www.getpostman.com/apps)

JSON based API: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/3c3375accb9680f4e0ad)

XML based API: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/a4291ccccb55814be2f8)

Form based API: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/9f53ac82b8f51a97255c)

# Using feature switching
Restful-booker can be feature switched by setting environmental variables to affect the functionality of the application.  The features are:

__Payload__
Sets what format request and response payloads are formatted in
```
export payload=json|xml|form
```

__DOB__
Sets how the system will determine if a person is over 21 and have a booking
```
export dob=boolean|string|compare
```

__Index__
Either shows bookings in pagination form or a full list
```
export index=page|full
```

__Edit__
Determines whether when editing you have to send a full payload to edit or a partial one
```
export edit=partial|full
```

__Validation__
Sets if validation of input is done on the server side, client side or on both
```
export validation=server|client|both
```

__Auth__
Determines the authentication behaviour for the export endpoitn
```
export auth=basic|query|token
```

__Version__
Sets whether the export endpoint uses versioning or not and switches between v1 and v2 behaviour of the endpoint
```
export version=nov1|nov2|yesv1|yesv2
```
