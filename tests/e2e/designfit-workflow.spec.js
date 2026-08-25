const { test, expect } = require('@playwright/test');
const { DesignFitPage } = require('./pages/designFitPage');

test.describe('DesignFit user workflows', () => {
  test('shows the empty-state form', async ({ page }) => {
    const designFit = new DesignFitPage(page);

    await designFit.goto();

    await expect(page.getByRole('heading', { name: 'DesignFit' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Room Information' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Furniture Information' })).toBeVisible();
    await expect(page.getByText('Fill in the room and furniture details')).toBeVisible();
  });

  test('reports required fields when submitted empty', async ({ page }) => {
    const designFit = new DesignFitPage(page);

    await designFit.goto();
    await designFit.submit();

    await expect(page.getByText('Room name is required.')).toBeVisible();
    await expect(page.getByText('Room length must be a number greater than zero.')).toBeVisible();
    await expect(page.getByText('Furniture name is required.')).toBeVisible();
    await expect(page.getByText('Select a furniture type.')).toBeVisible();
  });

  test('displays a positive fit result for a well-proportioned sofa', async ({ page }) => {
    const designFit = new DesignFitPage(page);

    await designFit.goto();
    await designFit.fillDetails({
      roomName: 'Living Room', roomLength: 196, roomWidth: 159,
      furnitureName: 'Sofa', furnitureType: 'sofa', furnitureWidth: 96, furnitureDepth: 40,
    });
    await designFit.submit();

    await expect(designFit.fitResult.getByText('Fits')).toBeVisible();
    await expect(designFit.fitResult.getByText('100', { exact: true })).toBeVisible();
    await expect(designFit.fitResult.getByText('GOOD', { exact: true })).toBeVisible();
    await expect(designFit.fitResult.getByText('No warnings.')).toBeVisible();
  });

  test('displays a warning when furniture is too wide', async ({ page }) => {
    const designFit = new DesignFitPage(page);

    await designFit.goto();
    await designFit.fillDetails({
      roomName: 'Small Room', roomLength: 120, roomWidth: 100,
      furnitureName: 'Large Sofa', furnitureType: 'sofa', furnitureWidth: 110, furnitureDepth: 40,
    });
    await designFit.submit();

    await expect(designFit.fitResult.getByText('Does not fit')).toBeVisible();
    await expect(designFit.fitResult.getByRole('list')).toBeVisible();
  });

  test('rejects non-positive dimensions before making an API request', async ({ page }) => {
    const designFit = new DesignFitPage(page);
    let requestCount = 0;
    page.on('request', (request) => {
      if (request.url().endsWith('/api/fit-check')) requestCount += 1;
    });

    await designFit.goto();
    await designFit.fillDetails({
      roomName: 'Office', roomLength: 0, roomWidth: 120,
      furnitureName: 'Desk', furnitureType: 'sofa', furnitureWidth: 40, furnitureDepth: 20,
    });
    await designFit.submit();

    await expect(page.getByText('Room length must be a number greater than zero.')).toBeVisible();
    expect(requestCount).toBe(0);
  });

  test('shows a readable API error when the fit service is unavailable', async ({ page }) => {
    await page.route('**/api/fit-check', (route) => route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Fit service unavailable' }),
    }));
    const designFit = new DesignFitPage(page);

    await designFit.goto();
    await designFit.fillDetails({
      roomName: 'Living Room', roomLength: 196, roomWidth: 159,
      furnitureName: 'Sofa', furnitureType: 'sofa', furnitureWidth: 96, furnitureDepth: 40,
    });
    await designFit.submit();

    await expect(page.getByRole('alert')).toHaveText('Fit service unavailable');
  });
});