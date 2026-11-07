/* FUNtasia Studio Expansion Packs: native share + accessible link-copy fallback. */
(() => {
  'use strict';

  const statuses = {
    ja: {
      copied: 'リンクをコピーしました。Instagramで貼り付けて共有できます。',
      manual: '自動コピーできませんでした。こちらをコピーしてください: ',
      failed: '共有できませんでした。リンクをコピーしてお使いください。'
    },
    en: {
      copied: 'Link copied. You can paste it into Instagram.',
      manual: 'Automatic copy failed. Please copy this link: ',
      failed: 'Sharing was unavailable. Please copy the link instead.'
    }
  };
  const messages = statuses[document.documentElement.lang] || statuses.en;

  function showStatus(container, message, url) {
    const node = container.querySelector('.pack-share-status');
    if (!node) return;
    node.textContent = message;
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = url;
      node.appendChild(link);
    }
  }

  async function copyLink(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        return true;
      } catch { /* Try legacy clipboard fallback. */ }
    }
    const field = document.createElement('textarea');
    field.value = url;
    field.readOnly = true;
    field.setAttribute('aria-hidden', 'true');
    field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Clipboard unavailable. */ }
    field.remove();
    return copied;
  }

  for (const container of document.querySelectorAll('.pack-share')) {
    const url = container.dataset.shareUrl;
    const title = container.dataset.shareTitle;
    if (!url || !title) continue;

    const copyButton = container.querySelector('[data-copy-share]');
    copyButton?.addEventListener('click', async () => {
      showStatus(container, (await copyLink(url)) ? messages.copied : messages.manual, null);
      if (!navigator.clipboard && !document.queryCommandSupported?.('copy')) {
        showStatus(container, messages.manual, url);
      }
    });

    const instagramButton = container.querySelector('[data-instagram-share]');
    instagramButton?.addEventListener('click', async () => {
      showStatus(container, '');
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({ title, url });
          return;
        } catch (error) {
          if (error && error.name === 'AbortError') return;
        }
      }
      if (await copyLink(url)) showStatus(container, messages.copied);
      else showStatus(container, messages.manual, url);
    });
  }
})();
