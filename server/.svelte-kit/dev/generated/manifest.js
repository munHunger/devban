const c = [
	() => import("../../../src/routes/__layout.svelte"),
	() => import("../components/error.svelte"),
	() => import("../../../src/routes/index.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.json.ts
	[/^\/index\.json$/],

	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/item.json.ts
	[/^\/item\.json$/]
];

export const fallback = [c[0](), c[1]()];