// The renderer modules come from capri-desktop (MIT) as plain JS; typed loosely on purpose.
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*/vendor/capri.js' { export class Capri { constructor(opts: any); [k: string]: any } }
declare module '*/vendor/fx.js' { export class FxLayer { constructor(canvas: HTMLCanvasElement, opts?: any); [k: string]: any } export const COLORS: any; export function drawMask(...a: any[]): void }
declare module '*/vendor/chip.js' { export class Mask { constructor(canvas: HTMLCanvasElement); [k: string]: any } export class Chip { constructor(canvas: HTMLCanvasElement); [k: string]: any } }
declare module '*/vendor/util.js' { export const reducedMotion: { setting: string; readonly matches: boolean; onSystemChange(fn: () => void): void }; export function sleep(ms: number): Promise<void>; export function rand(a: number, b: number): number; export function pick<T>(a: T[]): T; export function clamp(v: number, a: number, b: number): number }
declare module '*/vendor/acting.js' { export const ACTS: any; export const NEUTRAL: any; export class Player { constructor(name: string, opts?: any); [k: string]: any } }
declare module '*/vendor/sprite.js' { export class SpriteRenderer { constructor(canvas: HTMLCanvasElement, image: any); [k: string]: any } export const SPRITE: any }
