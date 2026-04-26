(async function() {
    'use strict';
    
    const delay = ms => new Promise(r => setTimeout(r, ms));
    
    const MAX_APPLIES = 20;
    const WAIT_BETWEEN_APPLIES = 1400;   // Reduced significantly
    const WAIT_MODAL_OPEN = 800;         // Faster modal wait
    const WAIT_AFTER_SEND = 900;         // Reduced

    let applyCount = 0;
    let successCount = 0;

    console.log("🚀 Starting FAST Cutshort Auto-Apply Script (max 20)...\n");
    console.log("⚡ Speed mode enabled - Be careful!\n");

    // Helper: Find all "Apply now" buttons
    function getApplyNowButtons() {
        return [...document.querySelectorAll('button')]
            .filter(btn => {
                const text = btn.textContent.trim().toLowerCase();
                return text === 'apply now' || text.includes('apply now');
            })
            .filter(btn => !btn.disabled && btn.offsetParent !== null);
    }

    // Faster modal handler
    async function handleApplyModal() {
        await delay(WAIT_MODAL_OPEN);

        let sendButton = [...document.querySelectorAll('button')]
            .find(btn => {
                const text = btn.textContent.trim();
                return (text === 'Send' || text.includes('Send')) && !btn.disabled;
            });

        if (sendButton) {
            // Quick click without too much scrolling
            sendButton.scrollIntoView({ behavior: 'instant', block: 'center' });
            await delay(300);
            sendButton.click();
            
            successCount++;
            console.log(`✅ Sent #${successCount} (Total: ${applyCount}/${MAX_APPLIES})`);
            await delay(WAIT_AFTER_SEND + Math.random() * 400);
            return true;
        } 
        else {
            console.log("⚠️ Send button not found");
            const closeBtn = document.querySelector('button[aria-label*="Close"], button[aria-label*="Dismiss"], button.x, .close');
            if (closeBtn) closeBtn.click();
            return false;
        }
    }

    // ── MAIN FAST LOOP ─────────────────────────────────
    while (applyCount < MAX_APPLIES) {
        const applyButtons = getApplyNowButtons();

        if (applyButtons.length === 0) {
            console.log("🏁 No more Apply now buttons found. Stopping.");
            break;
        }

        const currentBtn = applyButtons[0];

        // Fast scroll + click
        currentBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
        await delay(400);

        console.log(`📤 Applying #${applyCount + 1}/${MAX_APPLIES}...`);
        currentBtn.click();
        applyCount++;

        await handleApplyModal();

        await delay(WAIT_BETWEEN_APPLIES + Math.random() * 600);
    }

    console.log("\n🎉 === FAST CUTSHORT AUTO-APPLY FINISHED ===");
    console.log(`Total Apply clicks : ${applyCount}`);
    console.log(`Successfully sent   : ${successCount}`);
    console.log("👉 Refresh page to run again if needed.");

})();
