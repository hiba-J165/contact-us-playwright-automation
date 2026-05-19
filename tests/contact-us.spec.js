import { test, expect } from '@playwright/test';

const CONTACT_URL = 'https://safora.se/en/contact.html';

test.setTimeout(180000);

async function waitForPageToSettle(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('load').catch(() => {});
  await page.waitForLoadState('networkidle').catch(() => {});

  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  }).catch(() => {});

  await page.waitForTimeout(4000);
}

async function getVisibleCount(locator) {
  const count = await locator.count();
  let visibleCount = 0;

  for (let i = 0; i < count; i++) {
    const isVisible = await locator.nth(i).isVisible().catch(() => false);

    if (isVisible) {
      visibleCount++;
    }
  }

  return visibleCount;
}

async function scrollToContactForm(page) {
  const sendMessageButton = page.getByText(/Send Message/i).first();

  await expect(sendMessageButton).toBeVisible({ timeout: 20000 });
  await sendMessageButton.scrollIntoViewIfNeeded();

  await page.mouse.wheel(0, -250);
  await page.waitForTimeout(1500);

  return sendMessageButton;
}

async function fillVisibleFormFields(page) {
  const fields = page.locator(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea'
  );

  const count = await fields.count();
  let filledCount = 0;

  for (let i = 0; i < count; i++) {
    const field = fields.nth(i);
    const visible = await field.isVisible().catch(() => false);

    if (!visible) {
      continue;
    }

    const tagName = await field.evaluate((element) =>
      element.tagName.toLowerCase()
    ).catch(() => '');

    const type = (await field.getAttribute('type')) || '';
    const name = (await field.getAttribute('name')) || '';
    const id = (await field.getAttribute('id')) || '';
    const placeholder = (await field.getAttribute('placeholder')) || '';

    const fieldInfo = `${type} ${name} ${id} ${placeholder}`.toLowerCase();

    if (tagName === 'textarea') {
      await field.fill(
        'This is a Playwright automation test message for the QA internship assessment.'
      );
    } else if (fieldInfo.includes('email') || type.toLowerCase() === 'email') {
      await field.fill('qa.test@example.com');
    } else if (
      fieldInfo.includes('phone') ||
      fieldInfo.includes('mobile') ||
      type.toLowerCase() === 'tel'
    ) {
      await field.fill('+94771234567');
    } else if (fieldInfo.includes('name')) {
      await field.fill('QA Test User');
    } else if (fieldInfo.includes('subject')) {
      await field.fill('QA Internship Assessment');
    } else {
      await field.fill('QA Test Data');
    }

    filledCount++;
    await page.waitForTimeout(700);
  }

  return filledCount;
}

test('Safora Contact Us form should show validation and allow valid data entry', async ({ page }) => {
  await page.goto(CONTACT_URL, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });

  await waitForPageToSettle(page);

  await expect(page).toHaveURL(/contact/i);

  const sendMessageButton = await scrollToContactForm(page);

  // Step 1: Click Send Message without entering data
  await sendMessageButton.click();

  const invalidFields = page.locator(
    'input:invalid, textarea:invalid, select:invalid'
  );

  const invalidCountAfterEmptySubmit = await getVisibleCount(invalidFields);

  console.log(
    `Invalid fields found after empty submission: ${invalidCountAfterEmptySubmit}`
  );

  expect(invalidCountAfterEmptySubmit).toBeGreaterThan(0);

  await page.waitForTimeout(1500);

  // Step 2: Fill visible Contact Us form fields
  const filledCount = await fillVisibleFormFields(page);

  console.log(`Visible form fields filled: ${filledCount}`);

  expect(filledCount).toBeGreaterThan(0);

  // Step 3: Verify visible fields contain values
  const visibleFields = page.locator(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea'
  );

  const fieldCount = await visibleFields.count();

  for (let i = 0; i < fieldCount; i++) {
    const field = visibleFields.nth(i);
    const visible = await field.isVisible().catch(() => false);

    if (visible) {
      const value = await field.inputValue().catch(() => '');
      expect(value.trim().length).toBeGreaterThan(0);
    }
  }

  /*
    Important:
    This script fills the Contact Us form fields and verifies validation behavior.
    The final real submission is intentionally avoided because Safora is a live public website
    and the page includes CAPTCHA verification.
  */

  console.log('Automation completed successfully.');
  console.log('The browser will remain open for 5 seconds so the result can be reviewed.');

  await page.waitForTimeout(5000);
});