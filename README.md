# Safora Contact Us Form Automation

The automation focuses on the "Contact Us" form on the Safora website. It opens the Contact Us page, verifies required-field validation, fills the visible form fields with valid test data, and confirms that the form fields contain the entered values.

## Website Under Test

https://safora.se/en/contact.html

## Tools Used

- Playwright
- JavaScript
- Visual Studio Code
- Node.js
- Google Chrome
- Windows

## Test Coverage

The automation script covers the following behavior:

1. Opens the Safora Contact Us page.
2. Waits for the page UI, fonts, and content to load properly.
3. Automatically scrolls to the Contact Us form section.
4. Clicks the Send Message button without entering data.
5. Verifies that required-field validation is triggered.
6. Fills the visible form fields with valid test data:
   - Name
   - Email
   - Phone number
   - Message
7. Verifies that the visible fields contain entered values.
8. Ends the test successfully and generates a Playwright test report.


## Project Structure

```txt
Part-2-Playwright-Automation/
│
├── tests/
│   └── contact-us.spec.js
│
├── playwright.config.js
├── package.json
├── package-lock.json
└── .gitignore
