import React, { forwardRef } from 'react';
import { DesignState } from '../types';

interface DesignCanvasProps {
  state: DesignState;
}

export const DesignCanvas = forwardRef<HTMLDivElement, DesignCanvasProps>(({ state }, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-full aspect-[4/5] bg-white overflow-hidden transition-all duration-300 select-none flex flex-col"
      style={{ minWidth: '400px' }}
    >
      {state.customCss && <style>{state.customCss}</style>}

      {/* Top Brand Bar */}
      <div className="relative py-6 flex items-center justify-between px-10 z-20 bg-white border-b border-gray-100 shrink-0">
        <div style={{ color: state.secondaryColor }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </div>

        <div className="flex items-center justify-center">
          {/* Brand Logo */}
          <div className="h-12 w-auto flex items-center justify-center">
            {state.logoUrl ? (
              <img src={state.logoUrl} className="h-9 w-auto object-contain max-w-[120px]" alt="Logo" />
            ) : (
              <svg viewBox="0 0 45 50" className="h-9 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left Outer */}
                <path d="M0 12.5L7 8.5V41.5L0 37.5V12.5Z" fill={state.secondaryColor} />
                {/* Left Inner */}
                <path d="M9.5 7L16.5 3V47L9.5 43V7Z" fill={state.secondaryColor} />

                {/* Center Split Bar */}
                <rect x="19" y="0" width="7" height="23" fill={state.accentColor} />
                <rect x="19" y="27" width="7" height="23" fill={state.accentColor} />

                {/* Right Inner */}
                <path d="M28.5 3L35.5 7V43L28.5 47V3Z" fill={state.secondaryColor} />
                {/* Right Outer */}
                <path d="M38 8.5L45 12.5V37.5L38 41.5V8.5Z" fill={state.secondaryColor} />
              </svg>
            )}
          </div>
        </div>

        <div className="opacity-80" style={{ color: state.secondaryColor }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col bg-white overflow-hidden">
        {/* Modern Geometric Accent */}
        <div
          className="absolute top-0 left-0 w-3 h-40 z-20"
          style={{ backgroundColor: state.accentColor }}
        ></div>

        {/* Main Image Container */}
        <div className="relative w-full px-10 pt-8 z-10 shrink-0">
          <div className="relative w-full aspect-[16/9] overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-gray-100">
            <img
              src={state.imageUrl}
              alt="Brand Visual"
              crossOrigin="anonymous"
              className={`w-full h-full object-cover transition-all duration-1000 ${state.isGrayscale ? 'grayscale contrast-[1.15]' : ''}`}
            />
            {state.isGrayscale && (
              <div
                className="absolute inset-0 mix-blend-multiply opacity-10"
                style={{ backgroundColor: state.secondaryColor }}
              ></div>
            )}
          </div>

          {/* Secondary Accent Box */}
          <div
            className="absolute -bottom-5 -right-2 w-28 h-10 z-0 flex items-center justify-center shadow-lg"
            style={{ backgroundColor: state.accentColor }}
          >
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: state.secondaryColor }}></div>
              <div className="w-2 h-2 rounded-full bg-white/60"></div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col justify-center px-10 gap-6 z-10 py-6">
          {state.showCircle && (
            <div
              className="absolute right-[-40px] bottom-[10%] w-64 h-64 rounded-full opacity-[0.15] -z-10 blur-3xl"
              style={{ backgroundColor: state.accentColor }}
            ></div>
          )}

          {/* Headline - Typography: Black (900), 36px, LH 1.2 */}
          <div className="text-right w-full relative">
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-100 rounded-full"></div>
            <h2
              className="pr-6"
              style={{
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                fontSize: '36px',
                fontWeight: '900',
                lineHeight: '1.2',
                color: state.secondaryColor
              }}
            >
              {state.headline}
            </h2>
          </div>

          {/* Subline - Typography: Regular (400), 18px, LH 1.6 */}
          {state.subline && (
            <div className="w-full pl-4">
              <p
                className="text-brand-slate text-right pr-6"
                style={{
                  fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                  fontSize: '18px',
                  fontWeight: '400',
                  lineHeight: '1.6'
                }}
              >
                {state.subline}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="w-full h-16 flex items-center justify-between px-10 mt-auto z-20 shrink-0"
          style={{ backgroundColor: state.secondaryColor }}
        >
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-sm rotate-45" style={{ backgroundColor: state.accentColor }}></div>
            <span className="text-white text-xs font-bold tracking-[0.2em] uppercase opacity-90">{state.footerText}</span>
          </div>
          <div className="text-white/40 text-[10px] font-mono tracking-widest">EDITION 2025</div>
        </div>
      </div>
    </div>
  );
});

DesignCanvas.displayName = 'DesignCanvas';