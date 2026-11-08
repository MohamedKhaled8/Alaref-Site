import sys
import os
from playwright.sync_api import sync_playwright
sys.path.append(r"e:\Mt FlutterProject\yalaAcademy")
import scripts.generate_thumbnails as gt

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 720, "height": 405}, device_scale_factor=2)
    for c in gt.COURSES:
        html = gt.generate_html(c)
        page.set_content(html)
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")
        res = page.evaluate("""() => {
            const title = document.querySelector('.main-title').getBoundingClientRect();
            const teacher = document.querySelector('.teacher-card').getBoundingClientRect();
            const sub = document.querySelector('.subject-badge').getBoundingClientRect();
            return {
                scrollW: document.documentElement.scrollWidth,
                scrollH: document.documentElement.scrollHeight,
                title_right: title.right,
                title_left: title.left,
                title_w: title.width,
                teacher_right: teacher.right,
                teacher_left: teacher.left,
                sub_right: sub.right
            };
        }""")
        r_dist = 720 - res['title_right']
        t_gap = res['title_left'] - res['teacher_right']
        print(f"Course {c['id']:7s}: scrollW={res['scrollW']}, scrollH={res['scrollH']}, title_right={res['title_right']:.1f}px, margin_from_right_edge={r_dist:.1f}px, title_w={res['title_w']:.1f}px, title_left={res['title_left']:.1f}px, teacher_right={res['teacher_right']:.1f}px")
    browser.close()
