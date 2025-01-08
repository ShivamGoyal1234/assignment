// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock IntersectionObserver if needed
class IntersectionObserver {
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
}

window.IntersectionObserver = IntersectionObserver;

// Add any other global mocks or setup here