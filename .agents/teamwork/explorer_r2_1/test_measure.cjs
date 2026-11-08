const { chromium } = require('e:/Mt FlutterProject/yalaAcademy/study-buddy-sim/node_modules/@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  async function testFinalSpec() {
    console.log(`\n=================== TESTING FINAL RECOMMENDED SPEC ===================`);
    
    // Desktop test (1440x900)
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await desktop.goto('http://localhost:8080');

    const dResult = await desktop.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return null;

      // Root padding
      footer.classList.remove('pt-10', 'pb-8', 'sm:pt-12', 'sm:pb-9');
      footer.classList.add('pt-6', 'pb-5', 'sm:pt-8', 'sm:pb-6');

      const container = footer.querySelector('.max-w-7xl');
      // Container space-y
      container.classList.remove('space-y-7', 'sm:space-y-8');
      container.classList.add('space-y-4', 'sm:space-y-5');

      // Top Ribbon
      const topRibbon = container.children[0];
      topRibbon.classList.remove('pb-5', 'sm:pb-6', 'gap-5');
      topRibbon.classList.add('pb-3', 'sm:pb-3.5', 'gap-3', 'sm:gap-4');
      
      const mottoContainer = topRibbon.children[0];
      if (mottoContainer) {
        mottoContainer.classList.remove('space-y-1.5');
        mottoContainer.classList.add('space-y-0.5', 'sm:space-y-1');
        const mottoSpan = mottoContainer.querySelector('.font-aref');
        if (mottoSpan) {
          mottoSpan.classList.remove('text-sm', 'sm:text-base');
          mottoSpan.classList.add('text-xs', 'sm:text-sm');
        }
        const titleH3 = mottoContainer.querySelector('h3');
        if (titleH3) {
          titleH3.classList.remove('text-xl', 'sm:text-2xl');
          titleH3.classList.add('text-base', 'sm:text-xl');
        }
      }

      const buttonsDiv = topRibbon.children[1];
      if (buttonsDiv) {
        buttonsDiv.querySelectorAll('a, button').forEach(el => {
          el.classList.remove('px-5', 'py-2.5', 'sm:px-6', 'sm:py-3', 'text-sm', 'sm:text-base');
          el.classList.add('px-3.5', 'py-1.5', 'sm:px-5', 'sm:py-2.5', 'text-xs', 'sm:text-sm');
        });
      }

      // Main Grid
      const mainGrid = container.children[1];
      mainGrid.classList.remove('gap-6', 'lg:gap-6');
      mainGrid.classList.add('gap-4', 'sm:gap-5', 'lg:gap-6');

      // Col 1
      const col1 = mainGrid.children[0];
      col1.classList.remove('space-y-5');
      col1.classList.add('space-y-2.5', 'sm:space-y-3.5');

      const logoImg = col1.querySelector('img[alt="أستاذي عمرو عارف"]');
      if (logoImg) {
        logoImg.classList.remove('h-14', 'sm:h-16');
        logoImg.classList.add('h-10', 'sm:h-13');
      }

      const avatarDiv = col1.children[1];
      if (avatarDiv) {
        avatarDiv.classList.remove('gap-3.5', 'pt-1');
        avatarDiv.classList.add('gap-2.5', 'sm:gap-3');
        const avatarImg = avatarDiv.querySelector('img[alt="مستر عمرو عارف"]');
        if (avatarImg) {
          avatarImg.classList.remove('w-14', 'h-14');
          avatarImg.classList.add('w-11', 'h-11', 'sm:w-12', 'sm:h-12');
        }
      }

      const bioP = col1.querySelector('p');
      if (bioP) {
        bioP.classList.remove('text-sm', 'sm:text-base', 'leading-relaxed');
        bioP.classList.add('text-xs', 'sm:text-sm', 'leading-normal');
      }

      const trustBadge = col1.querySelector('.inline-flex');
      if (trustBadge) {
        trustBadge.classList.remove('px-4', 'py-2', 'text-xs', 'sm:text-sm');
        trustBadge.classList.add('px-2.5', 'py-1', 'sm:px-3', 'sm:py-1.5', 'text-[11px]', 'sm:text-xs');
      }

      // Col 2 & Col 3 combined subgrid
      const col2 = mainGrid.children[1];
      const col3 = mainGrid.children[2];
      const col4 = mainGrid.children[3];

      if (col2 && col3) {
        const subgrid = document.createElement('div');
        subgrid.className = 'col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6';
        
        col2.classList.remove('lg:col-span-2', 'space-y-3.5');
        col2.classList.add('space-y-2', 'sm:space-y-2.5');

        col3.classList.remove('lg:col-span-2', 'space-y-3.5');
        col3.classList.add('space-y-2', 'sm:space-y-2.5');

        col2.querySelectorAll('ul').forEach(ul => {
          ul.classList.remove('space-y-2');
          ul.classList.add('space-y-1', 'sm:space-y-1.5');
        });
        col3.querySelectorAll('ul').forEach(ul => {
          ul.classList.remove('space-y-2');
          ul.classList.add('space-y-1', 'sm:space-y-1.5');
        });

        col2.querySelectorAll('button').forEach(btn => {
          btn.classList.remove('py-1');
          btn.classList.add('py-0.5');
        });
        col3.querySelectorAll('button').forEach(btn => {
          btn.classList.remove('py-1');
          btn.classList.add('py-0.5');
        });

        mainGrid.insertBefore(subgrid, col2);
        subgrid.appendChild(col2);
        subgrid.appendChild(col3);
      }

      // Col 4
      const actualCol4 = mainGrid.querySelector('.lg\\:col-span-3');
      if (actualCol4) {
        actualCol4.classList.remove('space-y-3.5');
        actualCol4.classList.add('space-y-2', 'sm:space-y-2.5');

        const hotlineCard = actualCol4.querySelector('a[href^="tel:"]');
        if (hotlineCard) {
          hotlineCard.classList.remove('p-4');
          hotlineCard.classList.add('p-2.5', 'sm:p-3');
        }

        const waCard = actualCol4.querySelector('button');
        if (waCard) {
          waCard.classList.remove('p-4');
          waCard.classList.add('p-2.5', 'sm:p-3');
        }

        // On mobile 2-col, on desktop stacked
        if (hotlineCard && waCard) {
          const contactGroup = document.createElement('div');
          contactGroup.className = 'grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-2.5';
          actualCol4.insertBefore(contactGroup, hotlineCard);
          contactGroup.appendChild(hotlineCard);
          contactGroup.appendChild(waCard);
        }

        const socialRow = actualCol4.children[actualCol4.children.length - 1];
        if (socialRow) {
          socialRow.classList.remove('pt-1');
          const socialLabel = socialRow.children[0];
          if (socialLabel) {
            socialLabel.classList.remove('pb-2');
            socialLabel.classList.add('pb-1');
          }
        }
      }

      // Bottom Ribbon
      const bottomRibbon = container.children[2];
      bottomRibbon.classList.remove('pt-5', 'sm:pt-6', 'gap-3');
      bottomRibbon.classList.add('pt-3', 'sm:pt-4', 'gap-2');

      const rect = footer.getBoundingClientRect();
      const navLinks = Array.from(footer.querySelectorAll('ul button')).map(b => window.getComputedStyle(b).fontSize);
      const socialButtons = Array.from(footer.querySelectorAll('footer a[aria-label]')).map(a => {
        const r = a.getBoundingClientRect();
        return { label: a.getAttribute('aria-label'), width: r.width, height: r.height };
      });

      return {
        height: rect.height,
        scrollHeight: footer.scrollHeight,
        offsetHeight: footer.offsetHeight,
        navLinksFontSize: navLinks[0],
        socialButtons
      };
    });

    console.log(`Desktop (1440px):`, JSON.stringify(dResult, null, 2));
    await desktop.close();

    // Mobile test (390x844)
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobile.goto('http://localhost:8080');

    const mResult = await mobile.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return null;

      footer.classList.remove('pt-10', 'pb-8', 'sm:pt-12', 'sm:pb-9');
      footer.classList.add('pt-6', 'pb-5', 'sm:pt-8', 'sm:pb-6');

      const container = footer.querySelector('.max-w-7xl');
      container.classList.remove('space-y-7', 'sm:space-y-8');
      container.classList.add('space-y-4', 'sm:space-y-5');

      const topRibbon = container.children[0];
      topRibbon.classList.remove('pb-5', 'sm:pb-6', 'gap-5');
      topRibbon.classList.add('pb-3', 'sm:pb-3.5', 'gap-3', 'sm:gap-4');
      
      const mottoContainer = topRibbon.children[0];
      if (mottoContainer) {
        mottoContainer.classList.remove('space-y-1.5');
        mottoContainer.classList.add('space-y-0.5', 'sm:space-y-1');
        const mottoSpan = mottoContainer.querySelector('.font-aref');
        if (mottoSpan) {
          mottoSpan.classList.remove('text-sm', 'sm:text-base');
          mottoSpan.classList.add('text-xs', 'sm:text-sm');
        }
        const titleH3 = mottoContainer.querySelector('h3');
        if (titleH3) {
          titleH3.classList.remove('text-xl', 'sm:text-2xl');
          titleH3.classList.add('text-base', 'sm:text-xl');
        }
      }

      const buttonsDiv = topRibbon.children[1];
      if (buttonsDiv) {
        buttonsDiv.querySelectorAll('a, button').forEach(el => {
          el.classList.remove('px-5', 'py-2.5', 'sm:px-6', 'sm:py-3', 'text-sm', 'sm:text-base');
          el.classList.add('px-3.5', 'py-1.5', 'sm:px-5', 'sm:py-2.5', 'text-xs', 'sm:text-sm');
        });
      }

      const mainGrid = container.children[1];
      mainGrid.classList.remove('gap-6', 'lg:gap-6');
      mainGrid.classList.add('gap-4', 'sm:gap-5', 'lg:gap-6');

      const col1 = mainGrid.children[0];
      col1.classList.remove('space-y-5');
      col1.classList.add('space-y-2.5', 'sm:space-y-3.5');

      const logoImg = col1.querySelector('img[alt="أستاذي عمرو عارف"]');
      if (logoImg) {
        logoImg.classList.remove('h-14', 'sm:h-16');
        logoImg.classList.add('h-10', 'sm:h-13');
      }

      const avatarDiv = col1.children[1];
      if (avatarDiv) {
        avatarDiv.classList.remove('gap-3.5', 'pt-1');
        avatarDiv.classList.add('gap-2.5', 'sm:gap-3');
        const avatarImg = avatarDiv.querySelector('img[alt="مستر عمرو عارف"]');
        if (avatarImg) {
          avatarImg.classList.remove('w-14', 'h-14');
          avatarImg.classList.add('w-11', 'h-11', 'sm:w-12', 'sm:h-12');
        }
      }

      const bioP = col1.querySelector('p');
      if (bioP) {
        bioP.classList.remove('text-sm', 'sm:text-base', 'leading-relaxed');
        bioP.classList.add('text-xs', 'sm:text-sm', 'leading-normal');
      }

      const trustBadge = col1.querySelector('.inline-flex');
      if (trustBadge) {
        trustBadge.classList.remove('px-4', 'py-2', 'text-xs', 'sm:text-sm');
        trustBadge.classList.add('px-2.5', 'py-1', 'sm:px-3', 'sm:py-1.5', 'text-[11px]', 'sm:text-xs');
      }

      const col2 = mainGrid.children[1];
      const col3 = mainGrid.children[2];
      const col4 = mainGrid.children[3];

      if (col2 && col3) {
        const subgrid = document.createElement('div');
        subgrid.className = 'col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6';
        
        col2.classList.remove('lg:col-span-2', 'space-y-3.5');
        col2.classList.add('space-y-2', 'sm:space-y-2.5');

        col3.classList.remove('lg:col-span-2', 'space-y-3.5');
        col3.classList.add('space-y-2', 'sm:space-y-2.5');

        col2.querySelectorAll('ul').forEach(ul => {
          ul.classList.remove('space-y-2');
          ul.classList.add('space-y-1', 'sm:space-y-1.5');
        });
        col3.querySelectorAll('ul').forEach(ul => {
          ul.classList.remove('space-y-2');
          ul.classList.add('space-y-1', 'sm:space-y-1.5');
        });

        col2.querySelectorAll('button').forEach(btn => {
          btn.classList.remove('py-1');
          btn.classList.add('py-0.5');
        });
        col3.querySelectorAll('button').forEach(btn => {
          btn.classList.remove('py-1');
          btn.classList.add('py-0.5');
        });

        mainGrid.insertBefore(subgrid, col2);
        subgrid.appendChild(col2);
        subgrid.appendChild(col3);
      }

      const actualCol4 = mainGrid.querySelector('.lg\\:col-span-3');
      if (actualCol4) {
        actualCol4.classList.remove('space-y-3.5');
        actualCol4.classList.add('space-y-2', 'sm:space-y-2.5');

        const hotlineCard = actualCol4.querySelector('a[href^="tel:"]');
        if (hotlineCard) {
          hotlineCard.classList.remove('p-4');
          hotlineCard.classList.add('p-2.5', 'sm:p-3');
        }

        const waCard = actualCol4.querySelector('button');
        if (waCard) {
          waCard.classList.remove('p-4');
          waCard.classList.add('p-2.5', 'sm:p-3');
        }

        if (hotlineCard && waCard) {
          const contactGroup = document.createElement('div');
          contactGroup.className = 'grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-2.5';
          actualCol4.insertBefore(contactGroup, hotlineCard);
          contactGroup.appendChild(hotlineCard);
          contactGroup.appendChild(waCard);
        }

        const socialRow = actualCol4.children[actualCol4.children.length - 1];
        if (socialRow) {
          socialRow.classList.remove('pt-1');
          const socialLabel = socialRow.children[0];
          if (socialLabel) {
            socialLabel.classList.remove('pb-2');
            socialLabel.classList.add('pb-1');
          }
        }
      }

      const bottomRibbon = container.children[2];
      bottomRibbon.classList.remove('pt-5', 'sm:pt-6', 'gap-3');
      bottomRibbon.classList.add('pt-3', 'sm:pt-4', 'gap-2');

      const rect = footer.getBoundingClientRect();
      const navLinks = Array.from(footer.querySelectorAll('ul button')).map(b => window.getComputedStyle(b).fontSize);
      const socialButtons = Array.from(footer.querySelectorAll('footer a[aria-label]')).map(a => {
        const r = a.getBoundingClientRect();
        return { label: a.getAttribute('aria-label'), width: r.width, height: r.height };
      });

      return {
        height: rect.height,
        scrollHeight: footer.scrollHeight,
        offsetHeight: footer.offsetHeight,
        navLinksFontSize: navLinks[0],
        socialButtons
      };
    });

    console.log(`Mobile (390px):`, JSON.stringify(mResult, null, 2));
    await mobile.close();
  }

  await testFinalSpec();
  await browser.close();
})();
