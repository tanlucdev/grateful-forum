import { createLocalId } from "./local-id.ts";

export function leavePageState(dirty: boolean, saving: boolean): "allow" | "confirm" | "blocked" {
  return saving ? "blocked" : dirty ? "confirm" : "allow";
}

export function installLeavePageGuard(window: Window, getState: () => { dirty: boolean; saving: boolean }, requestLeave: (action: () => void) => void, navigate: (href: string) => void) {
  // Track positions without inserting history entries. Cancelled Back restores the same entry.
  let approved = false;
  const push = window.history.pushState;
  const replace = window.history.replaceState;
  const scope = createLocalId();
  const navigation = (window as Window & { navigation?: { currentEntry?: { index: number } } }).navigation;
  let index = navigation?.currentEntry?.index ?? 0;
  let restoring = false;
  let afterRestore = () => {};
  let returnScroll = { x: window.scrollX, y: window.scrollY };
  const originalRestoration = window.history.scrollRestoration;
  replace.call(window.history, { ...window.history.state, writeGuard: scope, writeIndex: index }, "");
  const trackedPush: History["pushState"] = function (this: History, data, unused, url) {
    push.call(this, { ...data, writeGuard: scope, writeIndex: ++index }, unused, url);
  };
  const trackedReplace: History["replaceState"] = function (this: History, data, unused, url) {
    replace.call(this, { ...data, writeGuard: scope, writeIndex: index }, unused, url);
  };
  window.history.pushState = trackedPush;
  window.history.replaceState = trackedReplace;
  function onPop(event: PopStateEvent) {
    if (restoring) {
      event.stopImmediatePropagation();
      restoring = false;
      window.scrollTo(returnScroll.x, returnScroll.y);
      window.history.scrollRestoration = originalRestoration;
      afterRestore();
      return;
    }
    const target = navigation?.currentEntry?.index ?? (event.state?.writeGuard === scope && typeof event.state?.writeIndex === "number" ? event.state.writeIndex : index - 1);
    const delta = target - index;
    if (approved || leavePageState(getState().dirty, getState().saving) === "allow") {
      approved = false;
      index = target;
      return;
    }
    event.stopImmediatePropagation();
    if (!delta) return;
    returnScroll = { x: window.scrollX, y: window.scrollY };
    window.history.scrollRestoration = "manual";
    restoring = true;
    afterRestore = () => requestLeave(() => { approved = true; window.history.go(delta); });
    window.history.go(-delta);
  }
  function onClick(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!link || link.download || (link.target && link.target !== "_self")) return;
    const target = new URL(link.href, window.location.href);
    if (target.origin !== window.location.origin || (target.pathname === window.location.pathname && target.search === window.location.search)) return;
    if (leavePageState(getState().dirty, getState().saving) === "allow") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    requestLeave(() => navigate(`${target.pathname}${target.search}${target.hash}`));
  }
  const unload = (event: BeforeUnloadEvent) => {
    if (approved) { approved = false; return; }
    if (getState().dirty || getState().saving) { event.preventDefault(); event.returnValue = ""; }
  };
  window.addEventListener("popstate", onPop, { capture: true });
  window.document.addEventListener("click", onClick, { capture: true });
  window.addEventListener("beforeunload", unload);
  return { approve: () => { approved = true; }, dispose: () => {
    window.removeEventListener("popstate", onPop, { capture: true });
    window.document.removeEventListener("click", onClick, { capture: true });
    window.removeEventListener("beforeunload", unload);
    if (window.history.pushState === trackedPush) window.history.pushState = push;
    if (window.history.replaceState === trackedReplace) window.history.replaceState = replace;
    window.history.scrollRestoration = originalRestoration;
  } };
}
