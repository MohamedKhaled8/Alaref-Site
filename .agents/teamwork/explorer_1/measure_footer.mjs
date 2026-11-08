import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('E:/Mt FlutterProject/yalaAcademy/study-buddy-sim/node_modules/playwright');

async function measure() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const report = {};

  // 1. Desktop 1440px
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 25000 });
  await new Promise(r => setTimeout(r, 1500));

  const desktopFooterData = await desktopPage.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return null;

    const footerRect = footer.getBoundingClientRect();
    const footerStyles = window.getComputedStyle(footer);

    // Background element
    const bgDiv = footer.querySelector('div[style*="backgroundImage"], div[style*="background-image"]');
    const bgStyles = bgDiv ? window.getComputedStyle(bgDiv) : null;

    // Top ribbon
    const topRibbon = footer.querySelector('.border-b');
    const topRibbonRect = topRibbon ? topRibbon.getBoundingClientRect() : null;
    const topRibbonStyles = topRibbon ? window.getComputedStyle(topRibbon) : null;

    const mottoEl = footer.querySelector('.font-aref span') || footer.querySelector('.font-aref');
    const mottoStyles = mottoEl ? window.getComputedStyle(mottoEl) : null;

    const titleEl = footer.querySelector('h3');
    const titleStyles = titleEl ? window.getComputedStyle(titleEl) : null;

    const phoneBtn = footer.querySelector('a[href^="tel:"]');
    const phoneBtnStyles = phoneBtn ? window.getComputedStyle(phoneBtn) : null;
    const phoneBtnRect = phoneBtn ? phoneBtn.getBoundingClientRect() : null;

    const whatsappBtn = footer.querySelector('button:has(svg)');
    const whatsappBtnStyles = whatsappBtn ? window.getComputedStyle(whatsappBtn) : null;
    const whatsappBtnRect = whatsappBtn ? whatsappBtn.getBoundingClientRect() : null;

    // Main columns
    const columnsGrid = footer.querySelector('.grid');
    const gridRect = columnsGrid ? columnsGrid.getBoundingClientRect() : null;
    const gridStyles = columnsGrid ? window.getComputedStyle(columnsGrid) : null;

    const cols = columnsGrid ? Array.from(columnsGrid.children).map((col, idx) => {
      const rect = col.getBoundingClientRect();
      const h4 = col.querySelector('h4');
      const h4Styles = h4 ? window.getComputedStyle(h4) : null;
      const links = Array.from(col.querySelectorAll('li button, li a')).map(l => {
        const lStyles = window.getComputedStyle(l);
        const lRect = l.getBoundingClientRect();
        return {
          text: l.innerText.trim(),
          fontSize: lStyles.fontSize,
          lineHeight: lStyles.lineHeight,
          color: lStyles.color,
          height: lRect.height
        };
      });

      return {
        index: idx,
        width: rect.width,
        height: rect.height,
        title: h4 ? h4.innerText.trim() : null,
        titleFontSize: h4Styles ? h4Styles.fontSize : null,
        linksCount: links.length,
        links: links
      };
    }) : [];

    // Col 1 elements (Teacher bio & logo)
    const logoImg = footer.querySelector('img[alt="أستاذي عمرو عارف"]');
    const logoRect = logoImg ? logoImg.getBoundingClientRect() : null;

    const bioP = footer.querySelector('p.max-w-md');
    const bioStyles = bioP ? window.getComputedStyle(bioP) : null;

    const trustBadge = footer.querySelector('.text-amber-300');
    const trustStyles = trustBadge ? window.getComputedStyle(trustBadge) : null;

    // Col 4 cards
    const hotlineCard = footer.querySelector('a[href="tel:01097303002"][class*="rounded-xl"]');
    const hotlineRect = hotlineCard ? hotlineCard.getBoundingClientRect() : null;

    const socialLinks = Array.from(footer.querySelectorAll('a[aria-label]')).map(s => {
      const sRect = s.getBoundingClientRect();
      const sStyles = window.getComputedStyle(s);
      return {
        label: s.getAttribute('aria-label'),
        width: sRect.width,
        height: sRect.height,
        borderRadius: sStyles.borderRadius
      };
    });

    // Bottom copyright ribbon
    const bottomRibbon = footer.querySelector('.border-t:last-child');
    const bottomRect = bottomRibbon ? bottomRibbon.getBoundingClientRect() : null;
    const bottomStyles = bottomRibbon ? window.getComputedStyle(bottomRibbon) : null;

    return {
      footer: {
        width: footerRect.width,
        height: footerRect.height,
        paddingTop: footerStyles.paddingTop,
        paddingBottom: footerStyles.paddingBottom,
        backgroundColor: footerStyles.backgroundColor,
        fontFamily: footerStyles.fontFamily
      },
      backgroundDiv: bgDiv ? {
        backgroundImage: bgStyles.backgroundImage,
        backgroundSize: bgStyles.backgroundSize,
        backgroundRepeat: bgStyles.backgroundRepeat,
        opacity: bgStyles.opacity,
        mixBlendMode: bgStyles.mixBlendMode
      } : null,
      topRibbon: {
        height: topRibbonRect ? topRibbonRect.height : null,
        paddingBottom: topRibbonStyles ? topRibbonStyles.paddingBottom : null,
        mottoFontSize: mottoStyles ? mottoStyles.fontSize : null,
        mottoFontFamily: mottoStyles ? mottoStyles.fontFamily : null,
        titleFontSize: titleStyles ? titleStyles.fontSize : null,
        phoneBtn: phoneBtnRect ? { width: phoneBtnRect.width, height: phoneBtnRect.height, fontSize: phoneBtnStyles.fontSize } : null,
        whatsappBtn: whatsappBtnRect ? { width: whatsappBtnRect.width, height: whatsappBtnRect.height, fontSize: whatsappBtnStyles.fontSize } : null
      },
      grid: {
        width: gridRect ? gridRect.width : null,
        height: gridRect ? gridRect.height : null,
        gap: gridStyles ? gridStyles.gap : null,
        columns: cols
      },
      col1: {
        logoWidth: logoRect ? logoRect.width : null,
        logoHeight: logoRect ? logoRect.height : null,
        bioFontSize: bioStyles ? bioStyles.fontSize : null,
        bioColor: bioStyles ? bioStyles.color : null,
        trustFontSize: trustStyles ? trustStyles.fontSize : null
      },
      col4: {
        hotlineCardHeight: hotlineRect ? hotlineRect.height : null,
        socialLinks
      },
      bottomRibbon: {
        height: bottomRect ? bottomRect.height : null,
        paddingTop: bottomStyles ? bottomStyles.paddingTop : null,
        fontSize: bottomStyles ? bottomStyles.fontSize : null,
        color: bottomStyles ? bottomStyles.color : null
      }
    };
  });

  report.desktop1440 = desktopFooterData;

  const footerEl = await desktopPage.$('footer');
  if (footerEl) {
    await footerEl.screenshot({ path: 'e:/Mt FlutterProject/yalaAcademy/.agents/teamwork/explorer_1/current_footer_desktop.png' });
  }

  // 2. Mobile 390px
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobilePage.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 25000 });
  await new Promise(r => setTimeout(r, 1500));

  const mobileFooterData = await mobilePage.evaluate(() => {
    const footer = document.querySelector('footer');
    if (!footer) return null;
    const footerRect = footer.getBoundingClientRect();
    const footerStyles = window.getComputedStyle(footer);
    return {
      width: footerRect.width,
      height: footerRect.height,
      paddingTop: footerStyles.paddingTop,
      paddingBottom: footerStyles.paddingBottom
    };
  });

  report.mobile390 = mobileFooterData;

  const mobileFooterEl = await mobilePage.$('footer');
  if (mobileFooterEl) {
    await mobileFooterEl.screenshot({ path: 'e:/Mt FlutterProject/yalaAcademy/.agents/teamwork/explorer_1/current_footer_mobile.png' });
  }

  await browser.close();

  console.log(JSON.stringify(report, null, 2));
}

measure().catch(err => {
  console.error(err);
  process.exit(1);
});
