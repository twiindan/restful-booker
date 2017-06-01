# #6 - Updating export

Description:

After providing original export functionality, we have gotten requests for additional data. In particular customers would like to use the data dump for things other than just quick books including creating mailers from Microsoft word/excel. This requires that they also know check in and out dates to time the mailings.

Acceptance Criteria:

**Given** a request to export bookings
**When** the request is authorised to a client's account
**Then** the data includes check in and out dates

## Updating export Implementation Options

Extension of Contract Without Versioning

The export URI will remain the same once the contract has been updated

**Before and after update**

```
GET /export
```

### URI Versioning

The export URI will contain a path entry to indicate it's version.  Once export is updated both endpoints will be live and supported

**Before update**

```
GET /export/v1
```

**After update**

```
GET /export/v1
GET /export/v2
```

## Some things to consider

- Update transparency
- Backwards compatibility
- Testing combinations
- Impact on customers
