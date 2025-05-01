// plugins/hide-phantom-ui.client.ts
// Browser-only plugin to hide Phantom entries in the solana-wallets-vue UI
export default defineNuxtPlugin(() => {
  if (process.client) {
    const removePhantomEntries = () => {
      // Select both modal list items and main trigger buttons
      const selectors = [
        '.wallet-adapter-modal-wallet-button',
        '.wallet-adapter-button',
        '.swv-button'
      ];
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          console.log(el)
          const title = el.getAttribute('title')?.trim() || el.textContent?.trim();
          console.log(title)
          if (['Phantom', 'Phantom Detected'].includes(title)) {
            (el as HTMLElement).remove()
          }
        });
      });
    };

    // Initial pass
    setTimeout(removePhantomEntries, 50);

    // Observe future DOM mutations (e.g. modal open/populate)
    const observer = new MutationObserver(removePhantomEntries);
    observer.observe(document.body, { childList: true, subtree: true });
  }
});