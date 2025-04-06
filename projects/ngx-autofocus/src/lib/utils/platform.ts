/**
 * Check if the current platform is iOS
 * @param window The window object
 * @returns True if the current platform is iOS
 */
export function isIOS(window: Window): boolean {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent) || 
           (userAgent.includes('mac') && 'ontouchend' in document);
}
