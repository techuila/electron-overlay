export default class Settings {
  private static instance: Settings;
  private overlay: boolean;

  private constructor() {
    this.overlay = false;
  }

  public static getInstance() {
    if (Settings.instance === undefined) {
      Settings.instance = new Settings();
    }

    return this.instance;
  }

  setOverlay(value: boolean) {
    this.overlay = value;
  }

  updateOverlayFromMain(value: boolean) {
    this.overlay = value;
  }

  get isOverlay() {
    return this.overlay;
  }
}
