const MIN_PRESS_MS = 90;
const PRESSABLE_SELECTOR = '.ui-press, .ui-dim';

function isDisabled(el: HTMLElement): boolean {
  return (
    (el as HTMLButtonElement).disabled === true ||
    el.getAttribute('aria-disabled') === 'true'
  );
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

function computePressScale(el: HTMLElement): string {
  if (el.classList.contains('ui-press--surface')) return '0.985';
  const rect = el.getBoundingClientRect();
  if (!rect.width && !rect.height) return '0.96';
  return clamp(1 - 8 / (rect.width + rect.height), 0.9, 0.985).toFixed(4);
}

type PressTrackedElement = HTMLElement & {
  _uiPressAt?: number;
  _uiPressTimer?: number;
};

function pressOn(el: PressTrackedElement, clientX?: number, clientY?: number) {
  if (isDisabled(el)) return;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--ui-press-scale', computePressScale(el));
  if (clientX != null && clientY != null && rect.width > 0 && rect.height > 0) {
    const px = (((clientX - rect.left) / rect.width) * 100).toFixed(1) + '%';
    const py = (((clientY - rect.top) / rect.height) * 100).toFixed(1) + '%';
    el.style.setProperty('--ui-px', px);
    el.style.setProperty('--ui-py', py);
  } else {
    el.style.setProperty('--ui-px', '50%');
    el.style.setProperty('--ui-py', '50%');
  }
  el._uiPressAt = performance.now();
  window.clearTimeout(el._uiPressTimer);
  el.setAttribute('data-pressed', '');
}

function pressOff(el: PressTrackedElement | null) {
  if (!el || !el.hasAttribute('data-pressed')) return;
  const held = performance.now() - (el._uiPressAt || 0);
  const wait = Math.max(0, MIN_PRESS_MS - held);
  window.clearTimeout(el._uiPressTimer);
  el._uiPressTimer = window.setTimeout(() => {
    el.removeAttribute('data-pressed');
  }, wait);
}

export function initInteractionKit(scope: Document | HTMLElement = document): () => void {
  let activeEl: PressTrackedElement | null = null;

  const onPointerDown = (e: Event) => {
    const pe = e as PointerEvent;
    if (pe.pointerType === 'mouse' && pe.button !== 0) return;
    const target = pe.target as HTMLElement | null;
    const el = target?.closest?.(PRESSABLE_SELECTOR) as PressTrackedElement | null;
    if (!el || !scope.contains(el)) return;
    activeEl = el;
    pressOn(el, pe.clientX, pe.clientY);
  };

  const onPointerUp = () => {
    pressOff(activeEl);
    activeEl = null;
  };

  const onKey = (e: Event) => {
    const ke = e as KeyboardEvent;
    if (ke.repeat) return;
    const target = ke.target as HTMLElement | null;
    const el = target?.closest?.(PRESSABLE_SELECTOR) as PressTrackedElement | null;
    if (!el) return;
    if (ke.key === ' ' || ke.key === 'Enter') {
      if (ke.type === 'keydown') pressOn(el);
      else pressOff(el);
    }
  };

  const onFocusOut = (e: Event) => {
    const target = e.target as HTMLElement | null;
    const el = target?.closest?.(PRESSABLE_SELECTOR) as PressTrackedElement | null;
    if (el) pressOff(el);
  };

  scope.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });
  scope.addEventListener('keydown', onKey);
  scope.addEventListener('keyup', onKey);
  scope.addEventListener('focusout', onFocusOut);

  return () => {
    scope.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    scope.removeEventListener('keydown', onKey);
    scope.removeEventListener('keyup', onKey);
    scope.removeEventListener('focusout', onFocusOut);
  };
}
