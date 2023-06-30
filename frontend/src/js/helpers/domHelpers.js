export function replaceEventListener(element, event, handler) {
    element.removeEventListener(event, handler);
    element.addEventListener(event, handler);
}