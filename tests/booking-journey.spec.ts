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

const getBookingDates = () => {
  const checkIn = new Date();
  checkIn.setHours(0, 0, 0, 0);

  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 1);

  return {
    checkIn,
    checkOut,
    checkInUk: formatToUkDate(checkIn),
    checkOutUk: formatToUkDate(checkOut),
    checkInIso: checkIn.toISOString().slice(0, 10),
    checkOutIso: checkOut.toISOString().slice(0, 10),
  };
};

const submitReservation = async (page: any) => {
  const reserveButton = page.locator('button:has-text("Reserve Now")').last();
  await expect(reserveButton).toBeVisible();
  await reserveButton.click();
};

test.describe('Customer booking journey', () => {
  test('customer can search for a room, reserve it, and confirm the booking', async ({ page }) => {
    const guest = buildGuest();
    const dates = getBookingDates();

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Welcome to Shady Meadows B&B' })).toBeVisible();
    await page.getByRole('button', { name: 'Check Availability' }).click();
    await expect(page.getByRole('heading', { name: 'Our Rooms' })).toBeVisible();

    const firstRoomBookingLink = page.locator('div.card-footer a').first();
    await expect(firstRoomBookingLink).toBeVisible();
    await firstRoomBookingLink.click();

    await expect(page.getByRole('heading', { name: 'Book This Room', exact: true })).toBeVisible();
    const reserveButton = page.getByRole('button', { name: 'Reserve Now' });
    await expect(reserveButton).toBeVisible();
    await reserveButton.click();
    await expect(page.getByPlaceholder('Firstname')).toBeVisible();
    await page.getByPlaceholder('Firstname').fill(guest.firstName);
    await page.getByPlaceholder('Lastname').fill(guest.lastName);
    await page.getByPlaceholder('Email').fill(guest.email);
    await page.getByPlaceholder('Phone').fill(guest.validPhone);

    await submitReservation(page);

    await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
    await expect(page.getByText('Your booking has been confirmed for the following dates:')).toBeVisible();
  });

  test('customer can browse room list and open a room detail page before reserving', async ({ page }) => {
    const dates = getBookingDates();
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Our Rooms' })).toBeVisible();
    const roomCards = page.locator('div.card-footer a');

    const firstRoomTitle = page.locator('h5').filter({ hasText: /Single|Double|Suite/ }).first();
    await expect(firstRoomTitle).toBeVisible();

    await roomCards.first().click();
    await expect(page.getByRole('heading', { name: 'Book This Room', exact: true })).toBeVisible();
    const reserveButton = page.getByRole('button', { name: 'Reserve Now' });
    await expect(reserveButton).toBeVisible();
    await reserveButton.click();
    await expect(page.getByPlaceholder('Firstname')).toBeVisible();
  });

  test('customer gets a validation message when phone number is too short', async ({ page }) => {
    const guest = buildGuest();
    const dates = getBookingDates();

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Welcome to Shady Meadows B&B' })).toBeVisible();
    await page.getByRole('button', { name: 'Check Availability' }).click();
    await expect(page.getByRole('heading', { name: 'Our Rooms' })).toBeVisible();

    const firstRoomBookingLink = page.locator('div.card-footer a').first();
    await expect(firstRoomBookingLink).toBeVisible();
    await firstRoomBookingLink.click();

    await expect(page.getByRole('heading', { name: 'Book This Room', exact: true })).toBeVisible();
    const reserveButton = page.getByRole('button', { name: 'Reserve Now' });
    await expect(reserveButton).toBeVisible();
    await reserveButton.click();
    await expect(page.getByPlaceholder('Firstname')).toBeVisible();
    await page.getByPlaceholder('Firstname').fill(guest.firstName);
    await page.getByPlaceholder('Lastname').fill(guest.lastName);
    await page.getByPlaceholder('Email').fill(guest.email);
    await page.getByPlaceholder('Phone').fill(guest.invalidPhone);

    await submitReservation(page);

    await expect(page.getByText(/size must be between 11 and 21/i)).toBeVisible();
  });

  test('customer can reserve using a different generated guest profile', async ({ page }) => {
    const guest = buildGuest();
    const dates = getBookingDates();

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Welcome to Shady Meadows B&B' })).toBeVisible();
    await page.getByRole('button', { name: 'Check Availability' }).click();
    await expect(page.getByRole('heading', { name: 'Our Rooms' })).toBeVisible();

    const firstRoomBookingLink = page.locator('div.card-footer a').first();
    await expect(firstRoomBookingLink).toBeVisible();
    await firstRoomBookingLink.click();

    await expect(page.getByRole('heading', { name: 'Book This Room', exact: true })).toBeVisible();
    const reserveButton = page.getByRole('button', { name: 'Reserve Now' });
    await expect(reserveButton).toBeVisible();
    await reserveButton.click();
    await expect(page.getByPlaceholder('Firstname')).toBeVisible();
    await page.getByPlaceholder('Firstname').fill(guest.firstName);
    await page.getByPlaceholder('Lastname').fill(guest.lastName);
    await page.getByPlaceholder('Email').fill(guest.email);
    await page.getByPlaceholder('Phone').fill(guest.validPhone);
    await submitReservation(page);

    await expect(page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
  });
});
