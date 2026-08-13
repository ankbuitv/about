// Minimal ambient declarations for the Cloudflare Workers runtime,
// so the project does not need @cloudflare/workers-types.

interface CacheStorage {
  readonly default: Cache;
}

declare interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}
