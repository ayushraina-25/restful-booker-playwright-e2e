import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const buildGuest = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    validPhone: faker.string.numeric(11),
    invalidPhone: faker.string.numeric(10),
  };
};

const formatToUkDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

test.describe('Customer booking journey', () => {
  test('customer can search for a room, reserve it, and confirm the booking', async ({ page }) => {
    const guest = buildGuest();
    const checkIn = new Date(2026, 8, 14);
    const checkOut = new Date(2026, 8, 15);

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Welcome to Shady Meadows B&B' })).toBeVisible();

    await page.getByLabel('Check In').fill(formatToUkDate(checkIn));
    await page.getByLabel('Check Out').fill(formatToUkDate(checkOut));
    await page.getByRole('button', { name: 'Check Availability' }).click();

    await expect(page.getByRole('heading', { name: 'Our Rooms' })).toBeVisible();
    const firstRoomBookingLink = page.locator('a:has-text("Book now")').first();
    await firstRoomBookingLink.click();

    await expect(page).toHaveURL(/\/reservation\/1\?checkin=2026-09-14&checkout=2026-09-15/);
    await expect(page.getByRole('heading', { name: 'Single Room' })).toBeVisible();

    await page.getByRole('button', { name: 'Reserve Now' }).click();

    await page.getByPlaceholder('Firstname').fill(guest.firstName);
    await page.getByPlaceholder('Lastname').fill(guest.lastName);
    await page.getByPlaceholder('Email').fill(guest.email);
    await page.getByPlaceholder('Phone').fill(guest.validPhone);

    await page.getByRole('button', { name: 'Reserve Now' }).nth(1).click();

    await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
    await expect(page.getByText('Your booking has been confirmed for the following dates:')).toBeVisible();
    await expect(page.getByText('2026-09-14 - 2026-09-15')).toBeVisible();
  });

  test('customer can browse room list and open a room detail page before reserving', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Our Rooms' })).toBeVisible();
    const roomCards = page.locator('a:has-text("Book now")');
    await expect(roomCards).toHaveCount(3);

    const firstRoomTitle = page.locator('h5').filter({ hasText: /Single|Double|Suite/ }).first();
    await expect(firstRoomTitle).toBeVisible();

    await roomCards.first().click();
    await expect(page.getByRole('heading', { name: 'Single Room' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Book This Room' })).toBeVisible();
  });

  test('customer gets a validation message when phone number is too short', async ({ page }) => {
    const guest = buildGuest();

    await page.goto('/reservation/1?checkin=2026-09-14&checkout=2026-09-15');

    await page.getByPlaceholder('Firstname').fill(guest.firstName);
    await page.getByPlaceholder('Lastname').fill(guest.lastName);
    await page.getByPlaceholder('Email').fill(guest.email);
    await page.getByPlaceholder('Phone').fill(guest.invalidPhone);

    await page.getByRole('button', { name: 'Reserve Now' }).click();

    await expect(page.getByText('size must be between 11 and 21')).toBeVisible();
  });

  test('customer can reserve using a different generated guest profile', async ({ page }) => {
    const guest = buildGuest();

    await page.goto('/reservation/2?checkin=2026-09-14&checkout=2026-09-15');
    await page.getByRole('button', { name: 'Reserve Now' }).click();

    await page.getByPlaceholder('Firstname').fill(guest.firstName);
    await page.getByPlaceholder('Lastname').fill(guest.lastName);
    await page.getByPlaceholder('Email').fill(guest.email);
    await page.getByPlaceholder('Phone').fill(guest.validPhone);
    await page.getByRole('button', { name: 'Reserve Now' }).click();

    await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
  });
});
