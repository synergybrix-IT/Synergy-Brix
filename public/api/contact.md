# Synergy Brix project enquiry submission

These endpoints receive project enquiries submitted through the Synergy Brix website. They are form-submission handlers, not a general-purpose software integration API.

## Endpoints

- `POST https://www.synergybrix.com/api/contact`
- `POST https://www.synergybrix.com/api/project-inquiry`

Both endpoints accept a JSON object with these fields:

| Field | Required | Validation |
| --- | --- | --- |
| `fullName` | Yes | Must not be empty |
| `businessEmail` | Yes | Must be a valid email address |
| `phone` | Yes | At least 7 characters |
| `mainGoal` | Yes | Must not be empty |
| `description` | Yes | At least 10 characters |
| `company` | No | Text |
| `budget` | No | Text |

Example request:

```http
POST /api/contact HTTP/1.1
Host: www.synergybrix.com
Content-Type: application/json
Accept: application/json
```

```json
{
  "fullName": "Example Person",
  "company": "Example Company",
  "businessEmail": "person@example.com",
  "phone": "+91 12345 67890",
  "mainGoal": "Discuss a project",
  "budget": "To be discussed",
  "description": "I would like to discuss a website project."
}
```

Successful submissions return HTTP `200` with a JSON object containing `success: true`. Invalid JSON or fields return HTTP `400`; unsupported methods return HTTP `405`; forwarding errors return HTTP `500`. Requests are forwarded to the company's enquiry form provider.

Do not include passwords, payment details, or other sensitive information. The site does not provide OAuth, API keys, an uptime commitment, or a separate integration support channel for these form endpoints. See the [Privacy Policy](https://www.synergybrix.com/privacy) for information about enquiry data.
