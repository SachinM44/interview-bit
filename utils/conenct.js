// === LinkedIn Auto-Load + Auto-Click "Connect" in search results (2025–2026 updated) ===
// Paste into Chrome DevTools console on a People search results page

(async function() {

    'use strict';

    const delay = ms => new Promise(r => setTimeout(r, ms));

    // ────────────────────────────────────────────────
    //   CONFIG – tune these values
    // ────────────────────────────────────────────────
    const MAX_CONNECT_CLICKS   = 10;         // safety – don't go crazy
    const MAX_LOAD_ATTEMPTS    = 15;         // how many times to try loading more
    const WAIT_BETWEEN_CLICKS  = 2800;       // 2.8–4.5 s → mimic human
    const WAIT_AFTER_MODAL     = 1400;
    const SCROLL_PAUSE         = 1200;       // ms after each scroll
    // ────────────────────────────────────────────────

    let connectCount = 0;
    let sentCount    = 0;
    let loadAttempts = 0;

    // ─── Phase 1: Load more results until we can't ───────────────────────────────
    console.log("Starting to load more profiles...");

    while (loadAttempts < MAX_LOAD_ATTEMPTS) {
        // Try classic "Show more results" button (text can vary slightly)
        let loadMore = [...document.querySelectorAll('button')]
            .find(el =>
                el.textContent.toLowerCase().includes('show more') ||
                el.textContent.toLowerCase().includes('load more') ||
                el.textContent.toLowerCase().includes('see more')
            );

        if (loadMore && loadMore.offsetParent !== null && !loadMore.disabled) {
            console.log(`Clicking "${loadMore.textContent.trim()}" button...`);
            loadMore.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await delay(400);
            loadMore.click();
            loadAttempts++;
            await delay(2200 + Math.random() * 1800); // 2.2–4 s
            continue;
        }

        // If no button → try scrolling (many pages are infinite scroll)
        window.scrollTo(0, document.body.scrollHeight - 1200);
        await delay(SCROLL_PAUSE);

        // Check if we reached the end (very rough heuristic)
        let oldHeight = document.body.scrollHeight;
        await delay(900);
        if (document.body.scrollHeight === oldHeight) {
            console.log("No more content seems to be loading → stopping load phase");
            break;
        }

        loadAttempts++;
    }

    console.log(`\nLoading finished after ${loadAttempts} attempts. Now looking for Connect buttons...\n`);

    while (connectCount < MAX_CONNECT_CLICKS) {
        const connectBtns = [...document.querySelectorAll('button')]
            .filter(el =>
                el.textContent.trim() === 'Connect' &&
                el.offsetParent !== null &&
                !el.disabled &&
                !el.closest('[class*="premium"], [class*="upsell"], [aria-label*="Premium"]') // avoid premium walls
            );

        if (connectBtns.length === 0) {
            console.log("No more visible Connect buttons found on this page");
            break;
        }

        console.log(`Found ${connectBtns.length} Connect button(s) → clicking one...`);

        let btn = connectBtns[0];
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await delay(500);

        btn.click();
        connectCount++;

        await delay(800); 

        let send = [...document.querySelectorAll('button')]
            .find(el => 
                el.textContent.includes('Send') && 
                (el.className.includes('primary') || el.className.includes('artdeco-button--primary'))
            );

        if (send) {
            send.click();
            sentCount++;
            console.log(`✅ Sent connection #${sentCount} / click #${connectCount}`);
            await delay(WAIT_AFTER_MODAL + Math.random() * 900);
        } else {
            let close = document.querySelector('button[aria-label*="Dismiss"], button.artdeco-modal__dismiss, button[aria-label*="Close"]');
            if (close) close.click();
            console.log(`Modal closed (no Send needed or already connected)`);
        }

        await delay(WAIT_BETWEEN_CLICKS + Math.random() * 1200); 
    }

    console.log(`\nFinished.\nClicked Connect → ${connectCount} times\nProbably sent → ${sentCount} invites`);

})();