(async function() {
    'use strict';
    const delay = ms => new Promise(r => setTimeout(r, ms));

    const MAX_CONNECTS         = 20;
    const WAIT_BETWEEN_CLICKS  = 2800;
    const WAIT_AFTER_MODAL     = 1400;

    let connectCount = 0;
    let sentCount    = 0;

    console.log("🚀 Starting LinkedIn auto-connect script (max 20 requests)...\n");

    // Helper: find visible Connect buttons in current viewport
    function getVisibleConnectBtns() {
        return [...document.querySelectorAll('button')]
            .filter(el => {
                if (el.textContent.trim() !== 'Connect') return false;
                if (el.disabled || el.offsetParent === null) return false;
                if (el.closest('[class*="premium"], [class*="upsell"], [aria-label*="Premium"]')) return false;
                const rect = el.getBoundingClientRect();
                return rect.top >= 0 && rect.bottom <= window.innerHeight;
            });
    }

    // Helper: find ANY connect button on page (even if below fold)
    function getAllConnectBtns() {
        return [...document.querySelectorAll('button')]
            .filter(el => {
                if (el.textContent.trim() !== 'Connect') return false;
                if (el.disabled || el.offsetParent === null) return false;
                if (el.closest('[class*="premium"], [class*="upsell"], [aria-label*="Premium"]')) return false;
                return true;
            });
    }

    // Helper: try clicking "Show more" / "Load more"
    async function tryLoadMore() {
        const loadMore = [...document.querySelectorAll('button')]
            .find(el =>
                !el.disabled &&
                el.offsetParent !== null &&
                (el.textContent.toLowerCase().includes('show more') ||
                 el.textContent.toLowerCase().includes('load more') ||
                 el.textContent.toLowerCase().includes('see more'))
            );
        if (loadMore) {
            console.log(`📄 Clicking "${loadMore.textContent.trim()}"...`);
            loadMore.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await delay(400);
            loadMore.click();
            await delay(2500 + Math.random() * 1000);
            return true;
        }
        return false;
    }

    // Helper: handle the "Send" / modal step after clicking Connect
    async function handleModal() {
        await delay(800);
        // Try to find Send without note button first
        let send = [...document.querySelectorAll('button')]
            .find(el =>
                (el.textContent.includes('Send without a note') || el.textContent.trim() === 'Send') &&
                (el.className.includes('primary') || el.className.includes('artdeco-button--primary'))
            );
        if (send) {
            send.click();
            sentCount++;
            console.log(`✅ Sent connection #${sentCount} (click #${connectCount})`);
            await delay(WAIT_AFTER_MODAL + Math.random() * 900);
            return true;
        }
        // No Send button — dismiss modal if any
        const close = document.querySelector(
            'button[aria-label*="Dismiss"], button.artdeco-modal__dismiss, button[aria-label*="Close"]'
        );
        if (close) {
            close.click();
            console.log(`ℹ️ Modal dismissed (already connected or other state)`);
        }
        return false;
    }

    // ── MAIN LOOP ─────────────────────────────────────────
    while (connectCount < MAX_CONNECTS) {

        // 1. Check for visible Connect buttons first (no scrolling needed)
        let visible = getVisibleConnectBtns();

        if (visible.length > 0) {
            let btn = visible[0];
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await delay(400);
            btn.click();
            connectCount++;
            console.log(`🔗 Clicked Connect (${connectCount}/${MAX_CONNECTS})`);
            await handleModal();
            await delay(WAIT_BETWEEN_CLICKS + Math.random() * 1200);
            continue;
        }

        // 2. No visible buttons — check if any exist below fold
        const allBtns = getAllConnectBtns();
        if (allBtns.length > 0) {
            // Smoothly scroll to the next button just below viewport
            const nextBtn = allBtns[0];
            nextBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await delay(1000);
            continue; // Re-check visible on next iteration
        }

        // 3. No buttons at all — try to load more results
        console.log("⏬ No Connect buttons found — trying to load more...");
        const loaded = await tryLoadMore();
        if (loaded) continue;

        // 4. Truly nothing left
        console.log("🏁 No more Connect buttons or pages to load. Done!");
        break;
    }

    console.log(`\n✨ Finished!\n   Clicked Connect → ${connectCount} times\n   Invites sent    → ${sentCount}`);
})();