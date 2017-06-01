# #4 - Edit a booking

Description:

There have been no use cases identified yet where a user would prefer to see just a read-only view of a booking. Therefore, we will not be doing a view only and instead any time you open a booking it will have its current values loaded into editable fields. All of the same validations are required as with add a booking (see story #1).

Out of scope:

- Any warning on navigating away with changes unsaved

Acceptance Criteria:

**Given** the client is viewing all bookings
**When** they select the option to edit the booking
**Then** the edit booking popup is displayed

**Given** a booking exists
**When** the client views the booking
**Then** the booking is displayed with all fields filled in

**Given** a client edits an already existing booking
**When** there are validation errors
**Then** the client is alerted on save and no information is updated

**Given** a client edits an already existing booking
**When** there are no validation errors
**Then** a message is displayed that the booking has been saved

**Given** the booking required age validation
**When** the booking is loaded to edit
**Then** the age validation is visible

## Implementation Options

Put with full record

Requires the full payload to be sent **Note:** change depositpaid with option from story #2

```
PUT /booking/{id}
```

### Payload - x-www-form-urlencoded

```
firstname=Mark&lastname=Winter&totalprice=111&depositpaid=true&dob=true&bookingdates[checkin]=2017-01-19&bookingdates[checkout]=2017-01-20
```

### Payload - JSON

```
{
    "firstname"; : "Eric",
    "lastname"; : "Brown",
    "totalprice"; : 111,
    "depositpaid"; : true,
    "additionalneeds" : "Breakfast",
    "dob" : "true",
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    }
}
```

### Payload - XML

```
<booking>
    <firstname>Eric</firstname>
    <lastname>Brown</lastname>
    <totalprice>111</totalprice>
    <depositpaid>true</depositpaid>
    <dob>true</dob>
    <bookingdates>
      <checkin>2018-01-01</checkin>
      <checkout>2019-01-01</checkout>
    </bookingdates>
<booking>
```

## Patch with partial record

Partial or incomplete payloads can be sent be sent along with depositpaid to update specific fields for a booking **Note:** change depositpaid with option from story #2

```
PATCH /booking/{id}
```

### Payload - x-www-form-urlencoded

```
dob=true&firstname=Mar
```

### Payload - JSON

```
{
  "dob" : true,
  "firstname" : "Mark"
}
```

### Payload - XML

```
<booking>
  <dob>true</dob>
  <firstname>Mark</firstname>
</booking>
```

## Some things to consider

- Data integrity
- Readability
- Idempotency
