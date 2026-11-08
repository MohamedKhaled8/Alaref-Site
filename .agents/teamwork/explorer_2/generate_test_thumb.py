import os
import base64
from playwright.sync_api import sync_playwright

output_dir = r"e:\Mt FlutterProject\yalaAcademy\.agents\teamwork\explorer_2"
avatar_path = r"e:\Mt FlutterProject\yalaAcademy\study-buddy-sim\public\assets\teacher_avatar.png"

with open(avatar_path, "rb") as f:
    avatar_b64 = base64.b64encode(f.read()).decode("utf-8")

html_content = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}
  body {{
    width: 720px;
    height: 405px;
    overflow: hidden;
    background: #111625;
    font-family: 'Cairo', sans-serif;
    color: #ffffff;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 28px 36px;
  }}

  /* Ambient glowing background gradients */
  .bg-glow-1 {{
    position: absolute;
    top: -80px;
    right: -80px;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(117, 59, 71, 0.45) 0%, rgba(17, 22, 37, 0) 70%);
    filter: blur(30px);
    pointer-events: none;
  }}
  .bg-glow-2 {{
    position: absolute;
    bottom: -60px;
    left: -60px;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(254, 98, 87, 0.25) 0%, rgba(17, 22, 37, 0) 70%);
    filter: blur(40px);
    pointer-events: none;
  }}

  /* Geometric accent grid */
  .bg-grid {{
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.6;
    pointer-events: none;
  }}

  /* Border frame */
  .frame {{
    position: absolute;
    inset: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 20px;
    pointer-events: none;
  }}

  /* Header row */
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
    letter-spacing: 0.5px;
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
    color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.06);
    padding: 4px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }}

  /* Main Content Area: In RTL, right is start (text), left is end (teacher badge) */
  .content-area {
    z-index: 10;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .text-col {
    flex: 1;
    min-width: 0;
  }
  .main-title {
    font-size: 34px;
    font-weight: 900;
    line-height: 1.2;
    color: #ffffff;
    text-shadow: 0 4px 16px rgba(0,0,0,0.6);
    margin-bottom: 6px;
    white-space: nowrap;
  }
  .highlight {{
    background: linear-gradient(135deg, #ffffff 30%, #fe6257 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }}
  .subtitle {{
    font-size: 15px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
  }}

  /* Teacher Badge Card */
  .teacher-card {{
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(24, 26, 36, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 10px 18px 10px 14px;
    border-radius: 20px;
    backdrop-filter: blur(12px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    z-index: 10;
    align-self: flex-start;
  }}
  .avatar-wrap {{
    position: relative;
    width: 64px;
    height: 64px;
  }}
  .avatar-img {{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2.5px solid #753b47;
    box-shadow: 0 0 14px rgba(117, 59, 71, 0.6);
  }}
  .check-badge {{
    position: absolute;
    bottom: -2px;
    left: -2px;
    width: 20px;
    height: 20px;
    background: #0284c7;
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 900;
    border: 2px solid #111625;
    box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  }}
  .teacher-info {{
    display: flex;
    flex-direction: column;
    text-align: right;
  }}
  .teacher-name {{
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.2;
  }}
  .teacher-title {{
    font-size: 12px;
    font-weight: 600;
    color: #fe6257;
    margin-top: 2px;
  }}

  /* Footer bar inside banner */
  .footer-row {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 12px;
    z-index: 10;
  }}
  .features-list {{
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 12px;
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
    letter-spacing: 1px;
  }}
</style>
</head>
<body>
  <div class="bg-glow-1"></div>
  <div class="bg-glow-2"></div>
  <div class="bg-grid"></div>
  <div class="frame"></div>

  <!-- Top row -->
  <div class="header-row">
    <div class="subject-badge">
      <span class="dot"></span>
      <span>اللغة العربية</span>
    </div>
    <div class="stage-tag">الشهادة الإعدادية • 2026</div>
  </div>

  <!-- Main Content -->
  <div class="content-area">
    <div class="text-col">
      <h1 class="main-title">الصف الثالث <span class="highlight">الإعدادي</span></h1>
      <p class="subtitle">شرح المنهج كاملاً • خرائط ذهنية للنحو • نواتج التعلم والامتحانات</p>
    </div>

    <!-- Teacher Badge -->
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

  <!-- Footer Row -->
  <div class="footer-row">
    <div class="features-list">
      <div class="feature-item">
        <span class="feature-dot"></span>
        <span>نحو وبلاغة</span>
      </div>
      <div class="feature-item">
        <span class="feature-dot"></span>
        <span>نصوص متحررة وقراءة</span>
      </div>
      <div class="feature-item">
        <span class="feature-dot"></span>
        <span>امتحانات إلكترونية تفاعلية</span>
      </div>
    </div>
    <div class="brand-logo">منصة مستر عمرو عارف</div>
  </div>
</body>
</html>
"""

test_html_path = os.path.join(output_dir, "test_thumbnail.html")
with open(test_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

test_png_path = os.path.join(output_dir, "test_thumbnail.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 720, "height": 405}, device_scale_factor=2)
    page.goto(f"file:///{test_html_path.replace(os.sep, '/')}")
    page.wait_for_load_state("networkidle")
    page.screenshot(path=test_png_path)
    browser.close()

print(f"Generated test thumbnail at: {test_png_path}")
