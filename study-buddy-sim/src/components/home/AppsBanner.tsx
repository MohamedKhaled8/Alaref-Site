import React from "react";

export const AppsBanner: React.FC = () => {
  return (
    <section className="apps-section py-8 sm:py-12 select-none">
      <div className="container-elameed text-center space-y-6">
        
        {/* Headings matching desktop_1440.png */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            متوفرة على الأنظمة التالية
          </h2>
          <p className="text-xs sm:text-sm text-white/60 font-medium">
            حمل التطبيق على ايفون - اندرويد - ويندوز
          </p>
        </div>

        {/* 3 Store Download Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          
          {/* 1. App Store Button (iPhone) */}
          <a
            href="#ios-app"
            onClick={(e) => e.preventDefault()}
            className="h-14 px-6 rounded-16 bg-[#151a28] hover:bg-[#1c2235] border border-white/10 text-white flex items-center gap-3.5 transition-all shadow-md group"
          >
            <div className="text-right">
              <div className="text-[10px] text-white/60 leading-tight">حمل لنسخة الايفون</div>
              <div className="text-sm font-extrabold tracking-wide">App Store</div>
            </div>
            <div className="w-6 h-6 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.36-.56.65-.96 1.72-.83 2.74 1.01.08 2.04-.54 2.56-1.25z"/>
              </svg>
            </div>
          </a>

          {/* 2. Google Play Button (Android) */}
          <a
            href="#android-app"
            onClick={(e) => e.preventDefault()}
            className="h-14 px-6 rounded-16 bg-[#151a28] hover:bg-[#1c2235] border border-white/10 text-white flex items-center gap-3.5 transition-all shadow-md group"
          >
            <div className="text-right">
              <div className="text-[10px] text-white/60 leading-tight">حمل نسخة الاندرويد</div>
              <div className="text-sm font-extrabold tracking-wide">Google Play</div>
            </div>
            <div className="w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#3DDC84]">
                <path d="M3.609 1.814L13.793 12 3.61 22.186a1.94 1.94 0 0 1-.22-.924V2.738a1.94 1.94 0 0 1 .22-.924zM15.207 13.414l2.586 2.586-11.45 6.44 8.864-9.026zm0-2.828L6.343 1.56l11.45 6.44-2.586 2.586zm1.414 1.414l3.535-1.99a1.5 1.5 0 0 1 0 2.628l-3.535 1.99-1.343-1.314 1.343-1.314z"/>
              </svg>
            </div>
          </a>

          {/* 3. Microsoft Windows Client Button */}
          <a
            href="#windows-app"
            onClick={(e) => e.preventDefault()}
            className="h-14 px-6 rounded-16 bg-[#151a28] hover:bg-[#1c2235] border border-white/10 text-white flex items-center gap-3.5 transition-all shadow-md group"
          >
            <div className="text-right">
              <div className="text-[10px] text-white/60 leading-tight">حمل نسخة الويندوز</div>
              <div className="text-sm font-extrabold tracking-wide">Microsoft</div>
            </div>
            <div className="w-6 h-6 flex items-center justify-center text-[#00A4EF] group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.551H10.949M0 12.6h9.75V22.05L0 20.701M10.949 12.6H24V24l-12.949-1.8"/>
              </svg>
            </div>
          </a>

        </div>

      </div>
    </section>
  );
};
