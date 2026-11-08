import os
import base64
from playwright.sync_api import sync_playwright

ASSETS_DIR = r"study-buddy-sim/public/assets"
AVATAR_PATH = os.path.join(ASSETS_DIR, "teacher_avatar.png")

with open(AVATAR_PATH, "rb") as f:
    avatar_b64 = base64.b64encode(f.read()).decode("utf-8")

COURSES = [
    {
        "id": "prep3",
        "title": "الصف الثالث",
        "highlight": "الإعدادي",
        "tag": "الشهادة الإعدادية • 2026",
        "subtitle": "شرح المنهج كاملاً • خرائط ذهنية للنحو • حل امتحانات المحافظات",
        "accent": "#fe6257",
        "files": ["course_prep3.png", "amr_course_prep3.png", "thumb_prep3.png"]
    },
    {
        "id": "prep2",
        "title": "الصف الثاني",
        "highlight": "الإعدادي",
        "tag": "المرحلة الإعدادية • 2026",
        "subtitle": "إتقان الإعراب والبناء • نصوص وقراءة متحررة • قصة كفاح شعب مصر",
        "accent": "#38bdf8",
        "files": ["course_prep2.png", "amr_course_prep2.png", "thumb_prep2.png"]
    },
    {
        "id": "prep1",
        "title": "الصف الأول",
        "highlight": "الإعدادي",
        "tag": "المرحلة الإعدادية • 2026",
        "subtitle": "همزة القطع وألف الوصل • أنواع الخبر والضمائر • تطبيقات وبنك أسئلة",
        "accent": "#a855f7",
        "files": ["course_prep1.png", "amr_course_prep1.png", "thumb_prep1.png"]
    },
    {
        "id": "prim6",
        "title": "الصف السادس",
        "highlight": "الابتدائي",
        "tag": "المرحلة الابتدائية • المنهج الجديد",
        "subtitle": "تأسيس القواعد النحوية • مهارات التعبير والكتابة السردية • تدريبات شاملة",
        "accent": "#10b981",
        "files": ["course_prim6.png", "amr_course_prim6.png", "thumb_prim6.png"]
    },
    {
        "id": "taasis",
        "title": "كورس التأسيس",
        "highlight": "الشامل",
        "tag": "دورة النخبة في النحو والبلاغة",
        "subtitle": "من الصفر حتى الاحتراف • مفاتيح الإعراب السحري • فك شفرات البلاغة",
        "accent": "#f59e0b",
        "files": ["course_taasis.png", "amr_course_taasis.png", "thumb_taasis.png"]
    },
    {
        "id": "sec1",
        "title": "الصف الأول",
        "highlight": "الثانوي",
        "tag": "المرحلة الثانوية • نظام حديث",
        "subtitle": "الأفعال الناقصة والتامة • بلاغة ومحسنات بديعية • قراءة ونصوص متحررة",
        "accent": "#6366f1",
        "files": ["course_sec1.png", "amr_course_sec1.png", "thumb_sec1.png"]
    },
    {
        "id": "sec2",
        "title": "الصف الثاني",
        "highlight": "الثانوي",
        "tag": "المرحلة الثانوية • نظام حديث",
        "subtitle": "إعمال المشتقات والمصادر • علم المعاني والإيجاز والإطناب • أدب العصر الجاهلي",
        "accent": "#ec4899",
        "files": ["course_sec2.png", "amr_course_sec2.png", "thumb_sec2.png"]
    },
    {
        "id": "sec3",
        "title": "الصف الثالث",
        "highlight": "الثانوي",
        "tag": "الثانوية العامة • دفعة التفوق",
        "subtitle": "مراجعات مكثفة للوحدات السبع • بنك أسئلة الوزارة • ليالي الامتحان",
        "accent": "#ef4444",
        "files": ["course_sec3.png", "amr_course_sec3.png", "thumb_sec3.png"]
    }
]

def generate_html(course):
    return f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{
    width: 720px;
    height: 405px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background: #111625;
  }}
  body {{
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px 34px;
    font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
    color: #ffffff;
  }}
  .glow-container {{
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
  }}
  .bg-glow-1 {{
    position: absolute;
    top: -80px;
    right: -80px;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(117, 59, 71, 0.45) 0%, rgba(17, 22, 37, 0) 70%);
    filter: blur(35px);
  }}
  .bg-glow-2 {{
    position: absolute;
    bottom: -60px;
    left: -60px;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, {course['accent']}33 0%, rgba(17, 22, 37, 0) 70%);
    filter: blur(40px);
  }}
  .bg-grid {{
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.6;
  }}
  .frame {{
    position: absolute;
    inset: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 20px;
    z-index: 2;
    pointer-events: none;
  }}
  .header-row {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
  }}
  .subject-badge {{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(117, 59, 71, 0.35);
    border: 1px solid rgba(254, 98, 87, 0.4);
    padding: 6px 16px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 800;
    color: #ff9b93;
    backdrop-filter: blur(8px);
  }}
  .subject-badge .dot {{
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fe6257;
    box-shadow: 0 0 8px #fe6257;
  }}
  .stage-tag {{
    font-size: 13px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.06);
    padding: 4px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }}
  .content-area {{
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin: 6px 0;
  }}
  .text-col {{
    flex: 1;
    min-width: 0;
    padding-right: 18px;
  }}
  .main-title {{
    font-size: 26px;
    font-weight: 900;
    line-height: 1.25;
    color: #ffffff;
    text-shadow: 0 4px 16px rgba(0,0,0,0.6);
    margin-bottom: 6px;
    white-space: nowrap;
  }}
  .highlight {{
    background: linear-gradient(135deg, #ffffff 20%, {course['accent']} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }}
  .subtitle {{
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
  }}
  .teacher-card {{
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(24, 26, 36, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.14);
    padding: 8px 12px;
    border-radius: 18px;
    backdrop-filter: blur(12px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    z-index: 10;
    flex-shrink: 0;
  }}
  .avatar-wrap {{
    position: relative;
    width: 52px;
    height: 52px;
  }}
  .avatar-img {{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #753b47;
    box-shadow: 0 0 10px rgba(117, 59, 71, 0.5);
  }}
  .check-badge {{
    position: absolute;
    bottom: -2px;
    left: -2px;
    width: 16px;
    height: 16px;
    background: #0284c7;
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 900;
    border: 1.5px solid #111625;
  }}
  .teacher-info {{
    display: flex;
    flex-direction: column;
    text-align: right;
  }}
  .teacher-name {{
    font-size: 13px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.2;
  }}
  .teacher-title {{
    font-size: 10.5px;
    font-weight: 600;
    color: #fe6257;
    margin-top: 2px;
  }}
  .footer-row {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 10px;
    padding-right: 14px;
    z-index: 10;
  }}
  .features-list {{
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.65);
  }}
  .feature-item {{
    display: flex;
    align-items: center;
    gap: 6px;
  }}
  .feature-dot {{
    width: 5px;
    height: 5px;
    background: #38bdf8;
    border-radius: 50%;
  }}
  .brand-logo {{
    font-size: 12px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.4);
  }}
</style>
</head>
<body>
  <div class="glow-container">
    <div class="bg-glow-1"></div>
    <div class="bg-glow-2"></div>
    <div class="bg-grid"></div>
  </div>
  <div class="frame"></div>

  <div class="header-row">
    <div class="subject-badge">
      <span class="dot"></span>
      <span>اللغة العربية</span>
    </div>
    <div class="stage-tag">{course['tag']}</div>
  </div>

  <div class="content-area">
    <div class="text-col">
      <h1 class="main-title">{course['title']} <span class="highlight">{course['highlight']}</span></h1>
      <p class="subtitle">{course['subtitle']}</p>
    </div>

    <div class="teacher-card">
      <div class="avatar-wrap">
        <img class="avatar-img" src="data:image/png;base64,{avatar_b64}" alt="مستر عمرو عارف">
        <div class="check-badge">✓</div>
      </div>
      <div class="teacher-info">
        <span class="teacher-name">مستر عمرو عارف</span>
        <span class="teacher-title">كبير معلّمي اللغة العربية</span>
      </div>
    </div>
  </div>

  <div class="footer-row">
    <div class="features-list">
      <div class="feature-item"><span class="feature-dot"></span><span>نحو وبلاغة</span></div>
      <div class="feature-item"><span class="feature-dot"></span><span>نصوص متحررة وقراءة</span></div>
      <div class="feature-item"><span class="feature-dot"></span><span>امتحانات إلكترونية تفاعلية</span></div>
    </div>
    <div class="brand-logo">منصة مستر عمرو عارف</div>
  </div>
</body>
</html>"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 720, "height": 405}, device_scale_factor=2)
    
    for c in COURSES:
        html = generate_html(c)
        page.set_content(html)
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")
        
        # Save to primary and alias paths
        for fname in c["files"]:
            out_path = os.path.join(ASSETS_DIR, fname)
            page.screenshot(path=out_path)
            print(f"Generated: {fname}")
            
    browser.close()
print("All 16:9 course thumbnails generated successfully!")
