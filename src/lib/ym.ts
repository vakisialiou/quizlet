
declare global {
  interface Window {
    ym?: (id: number, type: string, params?: string) => void;
  }
}

export function ym(id: number, type: string, params?: string): void {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(id, type, params);
  }
}
