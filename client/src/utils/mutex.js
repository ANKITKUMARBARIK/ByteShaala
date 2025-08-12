// Simple mutex implementation for preventing concurrent refresh token calls
export class Mutex {
  constructor() {
    this.isLocked = false;
    this.waitingQueue = [];
  }

  acquire() {
    return new Promise((resolve) => {
      if (!this.isLocked) {
        this.isLocked = true;
        resolve(() => this.release());
      } else {
        this.waitingQueue.push(() => {
          this.isLocked = true;
          resolve(() => this.release());
        });
      }
    });
  }

  release() {
    this.isLocked = false;
    if (this.waitingQueue.length > 0) {
      const next = this.waitingQueue.shift();
      next();
    }
  }

  async waitForUnlock() {
    if (!this.isLocked) return;

    return new Promise((resolve) => {
      const checkUnlock = () => {
        if (!this.isLocked) {
          resolve();
        } else {
          setTimeout(checkUnlock, 10);
        }
      };
      checkUnlock();
    });
  }
}
