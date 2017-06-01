# #2 - Limiting customer ages for certain clients

Description:

Our featured market differentiator is customisations for high end bed and breakfasts. A couple of the early clients have requested a 21 and up age restriction as a part of booking on their site.

We may need to accommodate registrations with no age restriction as well as for over 21 year old bookers in the future. However, since the other ages have only been indicated with interest, we should keep them in mind, but will not be currently implementing anything else.

Out of scope:

- Requiring that we know the exact age of the customers

Acceptance Criteria:

**Given** a client requires age validation
**When** reception is entering a booking
**Then** the age validation field is required

**Given** reception is entering/editing a booking
**When** they indicate the customer is below the age restriction
**Then** the booking is not completed

**Given** a booking has been made
**When** the booking is edited
**Then** previous age validation value is shown in the edit view

## Implementation Options

### Date value

Data format can be any valid date following _yyyy-mm-dd_ pattern

#### x-www-form-urlencoded implementation

```
firstname=Mark&lastname=Winteringham&totalprice=111&depositpaid=true&dob=1983-11-11&bookingdates[checkin]=2017-01-19&bookingdates[checkout]=2017-01-20
```

#### JSON implementation

```
{
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "dob" : "1983-11-11",
    "bookingdates&quot; : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    }
}
```

#### XML implementation

```
<booking>
    <firstname>Jim</firstname>
    <lastname>Brown</lastname>
    <totalprice>111</totalprice>
    <depositpaid>true</depositpaid>
    <dob>1983-11-11</dob>
    <bookingdates>
      <checkin>2018-01-01</checkin>
      <checkout>2019-01-01</checkout>
    </bookingdates>
</booking>
```

### String

Data format can be "over21" or "under21"

#### x-www-form-urlencoded implementation
```
firstname=Mark&lastname=Winteringham&totalprice=111&depositpaid=true&dob=over21&bookingdates[checkin]=2017-01-19&bookingdates[checkout]=2017-01-20
```

#### JSON implementation

```
{
    "firstname"; : "Jim",
    "lastname"; : "Brown",
    "totalprice"; : 111,
    "depositpaid"; : true,
    "dob" : "over21",
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01";
    }
}
```

#### XML implementation

```
<booking>
    <firstname>Jim</firstname>
    <lastname>Brown</lastname>
    <totalprice>111</totalprice>
    <depositpaid>true</depositpaid>
    <dob>over21</dob>
    <bookingdates>
      <checkin>2018-01-01</checkin>
      <checkout>2019-01-01</checkout>
    </bookingdates>
</booking>
```

### Boolean

Data format can be either true or false

#### x-www-form-urlencoded implementation
```
firstname=Mark&lastname=Winteringham&totalprice=111&depositpaid=true&dob=true&bookingdates[checkin]=2017-01-19&bookingdates[checkout]=2017-01-20
```

#### JSON implementation

```
{
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "dob" : "true",
    "bookingdates" : {
        "checkin"; : "2018-01-01",
        "checkout" : "2019-01-01"
    }
}
```

#### XML implementation

```
<booking>
    <firstname>Jim</firstname>
    <lastname>Brow</lastname>
    <totalprice>111</totalprice>
    <depositpaid>true</depositpaid>
    <dob>true</dob>
    <bookingdates>
      <checkin>2018-01-01</checkin>
      <checkout>2019-01-01</checkout>
    </bookingdates>
</booking>
```

## Some things to consider

- Where logic lives
- Extensibility
- Manifestation of data at the User Interface (UI) level
- Testing permutations
- Security
