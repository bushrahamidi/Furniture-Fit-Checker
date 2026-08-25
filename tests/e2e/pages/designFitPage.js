class DesignFitPage {
  constructor(page) {
    this.page = page;
    this.roomName = page.getByLabel('Room Name');
    this.roomLength = page.getByLabel('Room Length (in)');
    this.roomWidth = page.getByLabel('Room Width (in)');
    this.furnitureName = page.getByLabel('Furniture Name');
    this.furnitureType = page.getByLabel('Furniture Type');
    this.furnitureWidth = page.getByLabel('Width (in)', { exact: true });
    this.furnitureDepth = page.getByLabel('Depth (in)');
    this.checkFitButton = page.getByRole('button', { name: 'Check Fit' });
    this.fitResult = page.getByRole('heading', { name: 'Fit Result' }).locator('..');
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillDetails({ roomName, roomLength, roomWidth, furnitureName, furnitureType, furnitureWidth, furnitureDepth }) {
    await this.roomName.fill(roomName);
    await this.roomLength.fill(String(roomLength));
    await this.roomWidth.fill(String(roomWidth));
    await this.furnitureName.fill(furnitureName);
    await this.furnitureType.selectOption(furnitureType);
    await this.furnitureWidth.fill(String(furnitureWidth));
    await this.furnitureDepth.fill(String(furnitureDepth));
  }

  async submit() {
    await this.checkFitButton.click();
  }
}

module.exports = { DesignFitPage };