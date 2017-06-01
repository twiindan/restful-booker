# #7 - Validate booking information

Description:

To be ready for real users we will need basic validation. While we may need to change the boundaries in the future, the idea of minimums and maximums and disallowed characters will persist so these are our best guesses at this time.

Out of scope:

- Checking for availability
- Multiple guests
- Price breakdown by night
- Any warning on navigating away with changes unsaved

Acceptance Criteria:

## Validations:

### First and last name validations:

- Minimum of 2 characters
- Maximum of 25 characters
- Leading and trailing spaces are not counted towards the min/max count and should be trimmed
- Any spaces between characters will stay as inputted and count towards character count
- There should be no special character limitations

### Total stay price validations:

- Can be 0
- Must not be negative
- Must be an integer
- There is no maximum
- Can not include characters or special characters

### Check-in and out date validations:

- Check-in must be before check-out
- Check-in must be today or in the future
- There is no minimum or maximum stay
- Stay must conclude before December 31st 2099

### Deposit:

- No validation, can be true or false

Behaviour:

**Given** a reception agent has entered a complete and valid booking
**When** they submit the form
**Then** they are provided confirmation that the form has been submitted

**Given** a reception agent is on the bookings page
**When** they submit the form with any errors
**Then** error state is indicated

**Given** a reception agent is on the booking page
**When** they choose to enter their stay dates
**Then** they are only provided a calendar input style
**And** are not able to type in any type of date

**Given** reception is entering a check-in OR check-out date
**When** they view a date in the past on the calendar
**Then** it is not selectable

**Given** reception is selecting their check-in OR check-out date
**When** attempting to enter a date on or after Dec 31st 2099
**Then** it is not selectable

**Given** the booking has been accepted
**When** the booking is loaded in the future
**Then** all entered fields are displayed

## Implementation Options

### Client side

Validation will be carried out client side using JavaScript to evaluate data being sent.  If it passes validation the payload will be sent to the backend if fails then the payload is not sent.

### Server side

Validation will be carried out server side with the back-end taking the payload and validating it.  If the payload passes validation then it's stored in the database and a 200 status code response is returned.  If the payload fails validation then a 400 status code response is returned with details on validation failure.

### Client and server side

This option combines both of the implementations above.

_*Note: Because this option is basically picking both of the above, there is an additional cost associated with it. To simulate this, we will change one of your other stories implementation choice to a less costly solution to reroute time to this choice._

## Some things to consider

- Security
- Usability
- Performance
- Code duplication
