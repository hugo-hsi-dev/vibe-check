import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, 'matchMedia', {
	value: vi.fn().mockImplementation((query) => ({
		removeEventListener: vi.fn(),
		addEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
		matches: false,
		onchange: null,
		media: query
	})),
	enumerable: true,
	writable: true
});

// add more mocks here if you need them
