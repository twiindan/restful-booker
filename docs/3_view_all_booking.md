# #3 - View all bookings

Description:

While looking up a specific booking can be helpful, sometimes there are misspellings or other issues meaning a client would benefit from seeing a full listing of their bookings.

This story allows a client to access a simple table of their bookings with a series of well defined fields visible.

Acceptance Criteria:

**Given** a client is currently viewing the new booking page
**When** they have more than one booking
**Then** they can see all their bookings

**Given** a client has not yet made any bookings
**When** viewing the booking index page
**Then** a note is shown to indicate that the empty list is not in error

**Given** the client has at least one booking
**When** viewing the booking index page
**Then** the bookings are listed in a table with the following fields:
    | Firstname |
    | Surname   |
    | Price     |
    | Age       |
    | Deposit   |
    | Check-in  |
    | Check-out |

## Implementation Options

### Complete payload returned

Calling the endpoint will return all bookings currently stored in database
```
GET /booking
```

### Paginated payload

Calling the endpoint with a query string of ?page=1 will return the first ten bookings current stored in the database

```
GET /booking?page={page_number}
```

Calling the endpoint will return the count of bookings in the database to determine pagination controls

```
GET /booking/count
```

**Response:**

```
{
  "count" : 11
}
```

##

## Some things to consider

- Performance
- Usability
- User Interface interaction differences
