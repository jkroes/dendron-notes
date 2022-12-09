var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main.ts
__export(exports, {
  default: () => ScrollSpeed
});
var import_obsidian = __toModule(require("obsidian"));
var DEFAULT_SETTINGS = {
  speed: 5,
  altMultiplier: 5,
  enableAnimations: true
};
var ScrollSpeed = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.animationSmoothness = 3;
    this.positionY = 0;
    this.isMoving = false;
    this.scrollDistance = 0;
    this.windowOpenListener = (_win, window2) => {
      this.registerDomEvent(window2, "wheel", this.scrollListener, { passive: false });
    };
    this.scrollListener = (event) => {
      event.preventDefault();
      const path = event.path || event.composedPath && event.composedPath();
      for (const element of path) {
        if (this.isScrollable(element, event)) {
          this.target = element;
          if (this.isTrackPadUsed(event) || !this.settings.enableAnimations) {
            this.scrollWithoutAnimation(event);
          } else {
            this.scrollWithAnimation(event);
          }
          break;
        }
      }
    };
  }
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.addSettingTab(new SettingsTab(this.app, this));
      this.registerDomEvent(window, "wheel", this.scrollListener, { passive: false });
      this.registerEvent(this.app.on("window-open", this.windowOpenListener));
    });
  }
  scrollWithoutAnimation(event) {
    const acceleration = event.altKey ? this.settings.speed * this.settings.altMultiplier : this.settings.speed;
    this.target.scrollBy(event.deltaX * acceleration, event.deltaY * acceleration);
  }
  scrollWithAnimation(event) {
    this.positionY = this.target.scrollTop;
    const acceleration = event.altKey ? Math.pow(this.settings.speed * this.settings.altMultiplier, 1.1) : Math.pow(this.settings.speed, 1.1);
    this.positionY += event.deltaY * acceleration;
    this.scrollDistance = event.deltaY * acceleration;
    if (!this.isMoving) {
      this.isMoving = true;
      this.updateScrollAnimation();
    }
  }
  updateScrollAnimation() {
    if (!this.isMoving || !this.target) {
      this.stopScrollAnimation();
    }
    const divider = Math.pow(this.animationSmoothness, 1.3);
    const delta = this.positionY - this.target.scrollTop;
    this.target.scrollTop += delta / divider;
    if (delta < 0 && this.positionY < 0 && this.target.scrollTop === 0) {
      return this.stopScrollAnimation();
    }
    if (delta > 0 && this.positionY > this.target.scrollHeight - this.target.clientHeight / 2 - this.scrollDistance) {
      return this.stopScrollAnimation();
    }
    if (Math.abs(delta) < this.scrollDistance * 0.015 || Math.abs(delta) < 1) {
      return this.stopScrollAnimation();
    }
    window.requestAnimationFrame(this.updateScrollAnimation.bind(this));
  }
  stopScrollAnimation() {
    this.isMoving = false;
    this.scrollDistance = 0;
    if (this.target)
      this.target = void 0;
  }
  isScrollable(element, event) {
    const isHorizontal = event.deltaX && !event.deltaY;
    return this.isContentOverflowing(element, isHorizontal) && this.hasOverflowStyle(element, isHorizontal);
  }
  isContentOverflowing(element, horizontal) {
    const client = horizontal ? element.clientWidth : element.clientHeight;
    const scroll = horizontal ? element.scrollWidth : element.scrollHeight;
    return client < scroll;
  }
  hasOverflowStyle(element, horizontal) {
    const style = getComputedStyle(element);
    const overflow = style.getPropertyValue(horizontal ? "overflow-x" : "overflow-y");
    return /^(scroll|auto)$/.test(overflow);
  }
  isTrackPadUsed(event) {
    let isTrackPad = false;
    if (event.wheelDeltaY) {
      if (event.wheelDeltaY === event.deltaY * -3) {
        isTrackPad = true;
      }
    } else if (event.deltaMode === 0) {
      isTrackPad = true;
    }
    return isTrackPad;
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};
var SettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    let speedSlider;
    new import_obsidian.Setting(containerEl).setName("Mouse Scroll Speed").setDesc("1 is the default scroll speed, higher is faster").addExtraButton((button) => {
      button.setIcon("reset").setTooltip("Restore default").onClick(() => __async(this, null, function* () {
        this.plugin.settings.speed = DEFAULT_SETTINGS.speed;
        speedSlider.setValue(DEFAULT_SETTINGS.speed);
        yield this.plugin.saveSettings();
      }));
    }).addSlider((slider) => {
      speedSlider = slider;
      slider.setValue(this.plugin.settings.speed).setLimits(1, 10, 1).setDynamicTooltip().onChange((value) => __async(this, null, function* () {
        this.plugin.settings.speed = value;
        yield this.plugin.saveSettings();
      }));
    });
    let altMultiplierSlider;
    new import_obsidian.Setting(containerEl).setName("Alt Multiplier").setDesc("Multiply scroll speed when the ALT key is pressed").addExtraButton((button) => {
      button.setIcon("reset").setTooltip("Restore default").onClick(() => __async(this, null, function* () {
        this.plugin.settings.altMultiplier = DEFAULT_SETTINGS.altMultiplier;
        altMultiplierSlider.setValue(DEFAULT_SETTINGS.altMultiplier);
        yield this.plugin.saveSettings();
      }));
    }).addSlider((slider) => {
      altMultiplierSlider = slider;
      slider.setValue(this.plugin.settings.altMultiplier).setLimits(1, 10, 1).setDynamicTooltip().onChange((value) => __async(this, null, function* () {
        this.plugin.settings.altMultiplier = value;
        yield this.plugin.saveSettings();
      }));
    });
    let animationToggle;
    new import_obsidian.Setting(containerEl).setName("Enable Animation").setDesc("Toggle smooth scrolling animations").addExtraButton((button) => {
      button.setIcon("reset").setTooltip("Restore default").onClick(() => __async(this, null, function* () {
        this.plugin.settings.enableAnimations = DEFAULT_SETTINGS.enableAnimations;
        animationToggle.setValue(DEFAULT_SETTINGS.enableAnimations);
        yield this.plugin.saveSettings();
      }));
    }).addToggle((toggle) => {
      animationToggle = toggle;
      toggle.setValue(this.plugin.settings.enableAnimations).onChange((value) => __async(this, null, function* () {
        this.plugin.settings.enableAnimations = value;
        yield this.plugin.saveSettings();
      }));
    });
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHtcclxuICBBcHAsXHJcbiAgUGx1Z2luLFxyXG4gIFBsdWdpblNldHRpbmdUYWIsXHJcbiAgU2V0dGluZyxcclxuICBTbGlkZXJDb21wb25lbnQsXHJcbiAgVG9nZ2xlQ29tcG9uZW50LFxyXG4gIFdvcmtzcGFjZVdpbmRvdyxcclxufSBmcm9tICdvYnNpZGlhbidcclxuXHJcbmludGVyZmFjZSBBdWdtZW50ZWRXaGVlbEV2ZW50IGV4dGVuZHMgV2hlZWxFdmVudCB7XHJcbiAgcGF0aDogRWxlbWVudFtdXHJcbiAgd2hlZWxEZWx0YVk6IG51bWJlclxyXG4gIHdoZWVsRGVsdGFYOiBudW1iZXJcclxufVxyXG5cclxuaW50ZXJmYWNlIFNldHRpbmdzIHtcclxuICBzcGVlZDogbnVtYmVyXHJcbiAgYWx0TXVsdGlwbGllcjogbnVtYmVyXHJcbiAgZW5hYmxlQW5pbWF0aW9uczogYm9vbGVhblxyXG59XHJcblxyXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBTZXR0aW5ncyA9IHtcclxuICBzcGVlZDogNSxcclxuICBhbHRNdWx0aXBsaWVyOiA1LFxyXG4gIGVuYWJsZUFuaW1hdGlvbnM6IHRydWUsXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbFNwZWVkIGV4dGVuZHMgUGx1Z2luIHtcclxuICBzZXR0aW5nczogU2V0dGluZ3NcclxuXHJcbiAgYW5pbWF0aW9uU21vb3RobmVzcyA9IDNcclxuICBwb3NpdGlvblkgPSAwXHJcbiAgaXNNb3ZpbmcgPSBmYWxzZVxyXG4gIHRhcmdldDogRWxlbWVudCB8IHVuZGVmaW5lZFxyXG4gIHNjcm9sbERpc3RhbmNlID0gMFxyXG5cclxuICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpXHJcbiAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSlcclxuXHJcbiAgICB0aGlzLnJlZ2lzdGVyRG9tRXZlbnQod2luZG93LCAnd2hlZWwnLCB0aGlzLnNjcm9sbExpc3RlbmVyLCB7cGFzc2l2ZTogZmFsc2V9KVxyXG5cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHRoaXMucmVnaXN0ZXJFdmVudCh0aGlzLmFwcC5vbignd2luZG93LW9wZW4nLCB0aGlzLndpbmRvd09wZW5MaXN0ZW5lcikpXHJcbiAgfVxyXG5cclxuICB3aW5kb3dPcGVuTGlzdGVuZXIgPSAoX3dpbjogV29ya3NwYWNlV2luZG93LCB3aW5kb3c6IFdpbmRvdykgPT4ge1xyXG4gICAgdGhpcy5yZWdpc3RlckRvbUV2ZW50KHdpbmRvdywgJ3doZWVsJywgdGhpcy5zY3JvbGxMaXN0ZW5lciwge3Bhc3NpdmU6IGZhbHNlfSlcclxuICB9XHJcblxyXG4gIHNjcm9sbExpc3RlbmVyID0gKGV2ZW50OiBBdWdtZW50ZWRXaGVlbEV2ZW50KSA9PiB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM5MjQ1NjM4Lzg1ODY4MDNcclxuICAgIGNvbnN0IHBhdGggPSBldmVudC5wYXRoIHx8IChldmVudC5jb21wb3NlZFBhdGggJiYgKGV2ZW50LmNvbXBvc2VkUGF0aCgpIGFzIEVsZW1lbnRbXSkpXHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHBhdGgpIHtcclxuICAgICAgaWYgKHRoaXMuaXNTY3JvbGxhYmxlKGVsZW1lbnQsIGV2ZW50KSkge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gZWxlbWVudFxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc1RyYWNrUGFkVXNlZChldmVudCkgfHwgIXRoaXMuc2V0dGluZ3MuZW5hYmxlQW5pbWF0aW9ucykge1xyXG4gICAgICAgICAgdGhpcy5zY3JvbGxXaXRob3V0QW5pbWF0aW9uKGV2ZW50KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnNjcm9sbFdpdGhBbmltYXRpb24oZXZlbnQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzY3JvbGxXaXRob3V0QW5pbWF0aW9uKGV2ZW50OiBBdWdtZW50ZWRXaGVlbEV2ZW50KSB7XHJcbiAgICBjb25zdCBhY2NlbGVyYXRpb24gPSBldmVudC5hbHRLZXlcclxuICAgICAgPyB0aGlzLnNldHRpbmdzLnNwZWVkICogdGhpcy5zZXR0aW5ncy5hbHRNdWx0aXBsaWVyXHJcbiAgICAgIDogdGhpcy5zZXR0aW5ncy5zcGVlZFxyXG5cclxuICAgIHRoaXMudGFyZ2V0LnNjcm9sbEJ5KGV2ZW50LmRlbHRhWCAqIGFjY2VsZXJhdGlvbiwgZXZlbnQuZGVsdGFZICogYWNjZWxlcmF0aW9uKVxyXG4gIH1cclxuXHJcbiAgc2Nyb2xsV2l0aEFuaW1hdGlvbihldmVudDogQXVnbWVudGVkV2hlZWxFdmVudCkge1xyXG4gICAgLy8gVE9ETyBob3Jpem9udGFsIHNjcm9sbGluZywgdG9vXHJcbiAgICB0aGlzLnBvc2l0aW9uWSA9IHRoaXMudGFyZ2V0LnNjcm9sbFRvcFxyXG5cclxuICAgIGNvbnN0IGFjY2VsZXJhdGlvbiA9IGV2ZW50LmFsdEtleVxyXG4gICAgICA/IE1hdGgucG93KHRoaXMuc2V0dGluZ3Muc3BlZWQgKiB0aGlzLnNldHRpbmdzLmFsdE11bHRpcGxpZXIsIDEuMSlcclxuICAgICAgOiBNYXRoLnBvdyh0aGlzLnNldHRpbmdzLnNwZWVkLCAxLjEpXHJcblxyXG4gICAgdGhpcy5wb3NpdGlvblkgKz0gZXZlbnQuZGVsdGFZICogYWNjZWxlcmF0aW9uXHJcbiAgICB0aGlzLnNjcm9sbERpc3RhbmNlID0gZXZlbnQuZGVsdGFZICogYWNjZWxlcmF0aW9uXHJcblxyXG4gICAgaWYgKCF0aGlzLmlzTW92aW5nKSB7XHJcbiAgICAgIHRoaXMuaXNNb3ZpbmcgPSB0cnVlXHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbEFuaW1hdGlvbigpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVTY3JvbGxBbmltYXRpb24oKSB7XHJcbiAgICBpZiAoIXRoaXMuaXNNb3ZpbmcgfHwgIXRoaXMudGFyZ2V0KSB7XHJcbiAgICAgIHRoaXMuc3RvcFNjcm9sbEFuaW1hdGlvbigpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGl2aWRlciA9IE1hdGgucG93KHRoaXMuYW5pbWF0aW9uU21vb3RobmVzcywgMS4zKVxyXG4gICAgY29uc3QgZGVsdGEgPSB0aGlzLnBvc2l0aW9uWSAtIHRoaXMudGFyZ2V0LnNjcm9sbFRvcFxyXG4gICAgdGhpcy50YXJnZXQuc2Nyb2xsVG9wICs9IGRlbHRhIC8gZGl2aWRlclxyXG5cclxuICAgIC8vIEJvdW5kYXJ5IGF0IHRoZSB0b3BcclxuICAgIGlmIChkZWx0YSA8IDAgJiYgdGhpcy5wb3NpdGlvblkgPCAwICYmIHRoaXMudGFyZ2V0LnNjcm9sbFRvcCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zdG9wU2Nyb2xsQW5pbWF0aW9uKClcclxuICAgIH1cclxuXHJcbiAgICAvLyBCb3VuZGFyeSBhdCB0aGUgYm90dG9tXHJcbiAgICBpZiAoXHJcbiAgICAgIGRlbHRhID4gMCAmJlxyXG4gICAgICB0aGlzLnBvc2l0aW9uWSA+IHRoaXMudGFyZ2V0LnNjcm9sbEhlaWdodCAtIHRoaXMudGFyZ2V0LmNsaWVudEhlaWdodCAvIDIgLSB0aGlzLnNjcm9sbERpc3RhbmNlXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3RvcFNjcm9sbEFuaW1hdGlvbigpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gU3RvcCB3aGVuIG1vdmVtZW50IGRlbHRhIGlzIGFwcHJvYWNoaW5nIHplcm9cclxuICAgIGlmIChNYXRoLmFicyhkZWx0YSkgPCB0aGlzLnNjcm9sbERpc3RhbmNlICogMC4wMTUgfHwgTWF0aC5hYnMoZGVsdGEpIDwgMSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zdG9wU2Nyb2xsQW5pbWF0aW9uKClcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlU2Nyb2xsQW5pbWF0aW9uLmJpbmQodGhpcykpXHJcbiAgfVxyXG5cclxuICBzdG9wU2Nyb2xsQW5pbWF0aW9uKCkge1xyXG4gICAgdGhpcy5pc01vdmluZyA9IGZhbHNlXHJcbiAgICB0aGlzLnNjcm9sbERpc3RhbmNlID0gMFxyXG4gICAgaWYgKHRoaXMudGFyZ2V0KSB0aGlzLnRhcmdldCA9IHVuZGVmaW5lZFxyXG4gIH1cclxuXHJcbiAgaXNTY3JvbGxhYmxlKGVsZW1lbnQ6IEVsZW1lbnQsIGV2ZW50OiBBdWdtZW50ZWRXaGVlbEV2ZW50KSB7XHJcbiAgICBjb25zdCBpc0hvcml6b250YWwgPSBldmVudC5kZWx0YVggJiYgIWV2ZW50LmRlbHRhWVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIHRoaXMuaXNDb250ZW50T3ZlcmZsb3dpbmcoZWxlbWVudCwgaXNIb3Jpem9udGFsKSAmJlxyXG4gICAgICB0aGlzLmhhc092ZXJmbG93U3R5bGUoZWxlbWVudCwgaXNIb3Jpem9udGFsKVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgaXNDb250ZW50T3ZlcmZsb3dpbmcoZWxlbWVudDogRWxlbWVudCwgaG9yaXpvbnRhbDogYm9vbGVhbikge1xyXG4gICAgY29uc3QgY2xpZW50ID0gaG9yaXpvbnRhbCA/IGVsZW1lbnQuY2xpZW50V2lkdGggOiBlbGVtZW50LmNsaWVudEhlaWdodFxyXG4gICAgY29uc3Qgc2Nyb2xsID0gaG9yaXpvbnRhbCA/IGVsZW1lbnQuc2Nyb2xsV2lkdGggOiBlbGVtZW50LnNjcm9sbEhlaWdodFxyXG4gICAgcmV0dXJuIGNsaWVudCA8IHNjcm9sbFxyXG4gIH1cclxuXHJcbiAgaGFzT3ZlcmZsb3dTdHlsZShlbGVtZW50OiBFbGVtZW50LCBob3Jpem9udGFsOiBib29sZWFuKSB7XHJcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudClcclxuICAgIGNvbnN0IG92ZXJmbG93ID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShob3Jpem9udGFsID8gJ292ZXJmbG93LXgnIDogJ292ZXJmbG93LXknKVxyXG4gICAgcmV0dXJuIC9eKHNjcm9sbHxhdXRvKSQvLnRlc3Qob3ZlcmZsb3cpXHJcbiAgfVxyXG5cclxuICBpc1RyYWNrUGFkVXNlZChldmVudDogQXVnbWVudGVkV2hlZWxFdmVudCkge1xyXG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzYyNDE1NzU0Lzg1ODY4MDNcclxuXHJcbiAgICBsZXQgaXNUcmFja1BhZCA9IGZhbHNlXHJcbiAgICBpZiAoZXZlbnQud2hlZWxEZWx0YVkpIHtcclxuICAgICAgaWYgKGV2ZW50LndoZWVsRGVsdGFZID09PSBldmVudC5kZWx0YVkgKiAtMykge1xyXG4gICAgICAgIGlzVHJhY2tQYWQgPSB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZXZlbnQuZGVsdGFNb2RlID09PSAwKSB7XHJcbiAgICAgIGlzVHJhY2tQYWQgPSB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGlzVHJhY2tQYWRcclxuICB9XHJcblxyXG4gIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpXHJcbiAgfVxyXG5cclxuICBhc3luYyBzYXZlU2V0dGluZ3MoKSB7XHJcbiAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpXHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG4gIHBsdWdpbjogU2Nyb2xsU3BlZWRcclxuXHJcbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogU2Nyb2xsU3BlZWQpIHtcclxuICAgIHN1cGVyKGFwcCwgcGx1Z2luKVxyXG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW5cclxuICB9XHJcblxyXG4gIGRpc3BsYXkoKTogdm9pZCB7XHJcbiAgICBjb25zdCB7Y29udGFpbmVyRWx9ID0gdGhpc1xyXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKVxyXG5cclxuICAgIGxldCBzcGVlZFNsaWRlcjogU2xpZGVyQ29tcG9uZW50XHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoJ01vdXNlIFNjcm9sbCBTcGVlZCcpXHJcbiAgICAgIC5zZXREZXNjKCcxIGlzIHRoZSBkZWZhdWx0IHNjcm9sbCBzcGVlZCwgaGlnaGVyIGlzIGZhc3RlcicpXHJcbiAgICAgIC5hZGRFeHRyYUJ1dHRvbihidXR0b24gPT4ge1xyXG4gICAgICAgIGJ1dHRvblxyXG4gICAgICAgICAgLnNldEljb24oJ3Jlc2V0JylcclxuICAgICAgICAgIC5zZXRUb29sdGlwKCdSZXN0b3JlIGRlZmF1bHQnKVxyXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zcGVlZCA9IERFRkFVTFRfU0VUVElOR1Muc3BlZWRcclxuICAgICAgICAgICAgc3BlZWRTbGlkZXIuc2V0VmFsdWUoREVGQVVMVF9TRVRUSU5HUy5zcGVlZClcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKClcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHtcclxuICAgICAgICBzcGVlZFNsaWRlciA9IHNsaWRlclxyXG4gICAgICAgIHNsaWRlclxyXG4gICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNwZWVkKVxyXG4gICAgICAgICAgLnNldExpbWl0cygxLCAxMCwgMSlcclxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXHJcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdmFsdWUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zcGVlZCA9IHZhbHVlXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KVxyXG5cclxuICAgIGxldCBhbHRNdWx0aXBsaWVyU2xpZGVyOiBTbGlkZXJDb21wb25lbnRcclxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAuc2V0TmFtZSgnQWx0IE11bHRpcGxpZXInKVxyXG4gICAgICAuc2V0RGVzYygnTXVsdGlwbHkgc2Nyb2xsIHNwZWVkIHdoZW4gdGhlIEFMVCBrZXkgaXMgcHJlc3NlZCcpXHJcbiAgICAgIC5hZGRFeHRyYUJ1dHRvbihidXR0b24gPT4ge1xyXG4gICAgICAgIGJ1dHRvblxyXG4gICAgICAgICAgLnNldEljb24oJ3Jlc2V0JylcclxuICAgICAgICAgIC5zZXRUb29sdGlwKCdSZXN0b3JlIGRlZmF1bHQnKVxyXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hbHRNdWx0aXBsaWVyID0gREVGQVVMVF9TRVRUSU5HUy5hbHRNdWx0aXBsaWVyXHJcbiAgICAgICAgICAgIGFsdE11bHRpcGxpZXJTbGlkZXIuc2V0VmFsdWUoREVGQVVMVF9TRVRUSU5HUy5hbHRNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgICAgLmFkZFNsaWRlcihzbGlkZXIgPT4ge1xyXG4gICAgICAgIGFsdE11bHRpcGxpZXJTbGlkZXIgPSBzbGlkZXJcclxuICAgICAgICBzbGlkZXJcclxuICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5hbHRNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgLnNldExpbWl0cygxLCAxMCwgMSlcclxuICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXHJcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgdmFsdWUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5hbHRNdWx0aXBsaWVyID0gdmFsdWVcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKClcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcblxyXG4gICAgbGV0IGFuaW1hdGlvblRvZ2dsZTogVG9nZ2xlQ29tcG9uZW50XHJcbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgLnNldE5hbWUoJ0VuYWJsZSBBbmltYXRpb24nKVxyXG4gICAgICAuc2V0RGVzYygnVG9nZ2xlIHNtb290aCBzY3JvbGxpbmcgYW5pbWF0aW9ucycpXHJcbiAgICAgIC5hZGRFeHRyYUJ1dHRvbihidXR0b24gPT4ge1xyXG4gICAgICAgIGJ1dHRvblxyXG4gICAgICAgICAgLnNldEljb24oJ3Jlc2V0JylcclxuICAgICAgICAgIC5zZXRUb29sdGlwKCdSZXN0b3JlIGRlZmF1bHQnKVxyXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5lbmFibGVBbmltYXRpb25zID0gREVGQVVMVF9TRVRUSU5HUy5lbmFibGVBbmltYXRpb25zXHJcbiAgICAgICAgICAgIGFuaW1hdGlvblRvZ2dsZS5zZXRWYWx1ZShERUZBVUxUX1NFVFRJTkdTLmVuYWJsZUFuaW1hdGlvbnMpXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiB7XHJcbiAgICAgICAgYW5pbWF0aW9uVG9nZ2xlID0gdG9nZ2xlXHJcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUFuaW1hdGlvbnMpLm9uQ2hhbmdlKGFzeW5jIHZhbHVlID0+IHtcclxuICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmVuYWJsZUFuaW1hdGlvbnMgPSB2YWx1ZVxyXG4gICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKClcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFRTztBQWNQLElBQU0sbUJBQTZCO0FBQUEsRUFDakMsT0FBTztBQUFBLEVBQ1AsZUFBZTtBQUFBLEVBQ2Ysa0JBQWtCO0FBQUE7QUFHcEIsZ0NBQXlDLHVCQUFPO0FBQUEsRUFBaEQsY0E1QkE7QUE0QkE7QUFHRSwrQkFBc0I7QUFDdEIscUJBQVk7QUFDWixvQkFBVztBQUVYLDBCQUFpQjtBQVlqQiw4QkFBcUIsQ0FBQyxNQUF1QixZQUFtQjtBQUM5RCxXQUFLLGlCQUFpQixTQUFRLFNBQVMsS0FBSyxnQkFBZ0IsRUFBQyxTQUFTO0FBQUE7QUFHeEUsMEJBQWlCLENBQUMsVUFBK0I7QUFDL0MsWUFBTTtBQUdOLFlBQU0sT0FBTyxNQUFNLFFBQVMsTUFBTSxnQkFBaUIsTUFBTTtBQUV6RCxpQkFBVyxXQUFXLE1BQU07QUFDMUIsWUFBSSxLQUFLLGFBQWEsU0FBUyxRQUFRO0FBQ3JDLGVBQUssU0FBUztBQUVkLGNBQUksS0FBSyxlQUFlLFVBQVUsQ0FBQyxLQUFLLFNBQVMsa0JBQWtCO0FBQ2pFLGlCQUFLLHVCQUF1QjtBQUFBLGlCQUN2QjtBQUNMLGlCQUFLLG9CQUFvQjtBQUFBO0FBRzNCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQTlCQSxTQUFTO0FBQUE7QUFDYixZQUFNLEtBQUs7QUFDWCxXQUFLLGNBQWMsSUFBSSxZ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
