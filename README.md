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

I selected the booking flow because it represents the most important customer journey on the application: users search for dates, choose a room, complete the reservation form, and receive confirmation. The scenarios were chosen to cover the business-critical path and a key validation rule that protects the form from invalid data.

The automated coverage includes:

- room discovery and searching
- date-based room availability flow
- room selection and navigation into the booking form
- successful reservation completion
- validation of short phone numbers
- repeat validation with fresh generated customer details

This gives confidence in the primary user journey while also checking an important business rule that could otherwise allow invalid user input.

### Assumptions

- The public demo site is available and stable during test execution.
- The app uses a predictable booking flow with dates pre-filled from the current day.
- The room selection and booking form structure remain consistent enough for reliable automation.

### Risks identified

- Date and time handling can change if the app behavior is updated or localized.
- UI text and validation messages may vary over time and must be validated against the live page.
- Hard-coded customer data would reduce realism and increase the chance of duplicate failures, so dynamic generation is safer.

## Time Spent

- Exploration and live app review: approximately 1 hour
- Framework setup and dependency installation: approximately 30 minutes
- Test design, implementation, and refinements: approximately 2 hours

## AI Usage Disclosure

AI tools were used as a support mechanism, but the core QA work was carried out manually and validated directly against the live application.

GitHub Copilot was used for:

- helping with initial project setup and TypeScript scaffolding
- suggesting candidate selectors and Playwright patterns for the booking flow
- assisting with dynamic data generation ideas and scenario wording
- helping polish the project documentation and README structure

The actual test scenarios, validation steps, selectors, browser-based checks, and final fixes were driven by hands-on review of the application. I reviewed the AI suggestions, adapted them to the real page behavior, and added/modifed the cases where the live application required different timing or validation logic. The dynamic customer data is generated with Faker to avoid repeated hard-coded details and better reflect a realistic booking workflow.
