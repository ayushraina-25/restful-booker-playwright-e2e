# Restful Booker Playwright E2E

This project automates a core customer booking flow for the Restful Booker demo site.

## Setup Instructions

1. Install Node.js 18+ and npm.
2. Clone the repository and open the project folder.
3. Install dependencies:

   npm install

4. Install the browser used by Playwright:

   npx playwright install --with-deps chromium

5. Run the test suite:

   npx playwright test

6. To view the HTML report:

   npx playwright show-report

## Scenarios Covered

- Search for available dates and confirm the booking form is reachable from the landing page
- Book the first room in the list and confirm the reservation success message
- Open a room detail page and validate pricing and room information before booking
- Validate the phone number length rule for invalid submissions
- Retry the reservation flow with a different generated guest profile to verify data-driven behavior

## Automation Decisions

### Why these scenarios

The booking journey is the most important user flow on the site because it directly drives the primary business action for the application. The automated scenarios cover:

- room discovery
- date-based availability checks
- room selection
- reservation form completion
- business-rule validation
- confirmation state verification

This gives coverage across the critical happy path and a key defensive validation rule without over-testing low-value UI components.

### Assumptions

- The public demo environment remains available during execution.
- Guest form validation is enforced on the frontend and the resulting error message is deterministic.
- Room pricing and availability are stable enough for the selected dates to predict the expected booking flow.

### Risks identified

- Date formatting and calendar behavior can vary slightly across browsers or locale settings.
- The demo site may update text or validation messages over time.
- Dynamic test data is important to reduce false positives caused by fixed values or repeated email/phone payloads.

## Time Spent

- Exploration: 1 hour
- Framework setup: 30 minutes
- Automation development: 2 hours

## AI Usage Disclosure

Used GitHub Copilot for:

- project scaffolding and TypeScript configuration
- creating robust Playwright selectors for the room and reservation flow
- designing a data-driven test strategy using generated customer data
- drafting and refining this README

The automation logic, scenario selection, and documentation were AI-assisted, and the browser-based validation was checked against the live application. The test data is generated dynamically with Faker rather than using hard-coded personal details.
