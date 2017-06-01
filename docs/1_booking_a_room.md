# #1 - Booking a room

Description:

A core feature of the Restful Booking platform is to allow clients to book rooms for customers with a minimal set of information. However, given early conversations with prospective clients, we expect "minimal information" to be one of the more flexible and growing parts of our application. Therefore, we should keep that in mind while building the start to this feature.

Out of scope:
- Checking for availability
- Multiple guests
- Price breakdown by night
- Any warning on navigating away with changes unsaved
- Validating any inputs

__Acceptance Criteria:__

**Given** a reception agent has entered all fields for a booking
**When** they submit the form
**Then** they can see that the booking has been completed

**Given** a reception agent is on the booking page
**When** they choose to enter their stay dates
**Then** they are provided a calendar input style

**Given** the booking has been accepted
**When** the booking is loaded in the future
**Then** all entered fields are displayed

## Implementation Options

### URL encoded implementation

__Overview:__

Wikipedia: [https://en.wikipedia.org/wiki/POST\_(HTTP)](https://en.wikipedia.org/wiki/POST_(HTTP))

When a web browser sends a POST request from a web form element, the default Internet media type is &quot;application/x-www-form-urlencoded&quot;. This is a format for encoding key-value pairs with possibly duplicate keys. Each key-value pair is separated by an &#39;&amp;&#39; character, and each key is separated from its value by an &#39;=&#39; character. Keys and values are both escaped by replacing spaces with the &#39;+&#39; character and then using URL encoding on all other non-alphanumeric characters.

Technical implementation - Example:

```
POST /booking

firstname=Mark&lastname=Winteringham&totalprice=111&depositpaid=true&dob=true&bookingdates[checkin]=2017-01-19&bookingdates[checkout]=2017-01-20
```

### XML implementation

Overview [http://www.webopedia.com/TERM/X/XML.html](http://www.webopedia.com/TERM/X/XML.html)

Short for Extensible Markup Language, a specification developed by the W3C. XML is a pared-down version of SGML, designed especially for Web documents. It allows designers to create their own customized tags, enabling the definition, transmission,

validation, and interpretation of data between applications and between organizations.

Technical implementation - Example:

```
POST /booking

<booking>
    <firstname>Jim</firstname>
    <lastname>Brown</lastname>
    <totalprice>111</totalprice>
    <depositpaid>true</depositpaid>
    <dob>true</dob>
    <bookingdates>
            <checkin>2018-01-01</checkin>
            <checkout>2019-01-01</checkout>
    </bookingdates>
</booking>
```

### JSON implementation

Overview:

[http://json.org/](http://json.org/)

JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write. It is easy for machines to parse and generate. It is based on a subset of the JavaScript Programming Language, Standard ECMA-262 3rd Edition - December 1999.

JSON is a text format that is completely language independent but uses conventions that are familiar to programmers of the C-family of languages, including C, C++, C#, Java, JavaScript, Perl, Python, and many others. These properties make JSON an ideal data-interchange language.

JSON is built on two structures:

- A collection of name/value pairs. In various languages, this is realized as an object, record, struct, dictionary, hash table, keyed list, or associative array.
- An ordered list of values. In most languages, this is realized as an array, vector, list, or sequence.

Technical implementation - Example:

```
POST /booking
{
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "dob": "true",
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    }
}
```

## Some things to consider

- Human readability
- Congruency within tech stack
- Extensibility
- Customisation
- Data handling
