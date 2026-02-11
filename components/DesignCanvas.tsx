import React, { forwardRef } from 'react';
import { DesignState } from '../types';

interface DesignCanvasProps {
  state: DesignState;
}

export const DesignCanvas = forwardRef<HTMLDivElement, DesignCanvasProps>(({ state }, ref) => {
  return (
    <div
      ref={ref}
      className="design-canvas"
      style={{ minWidth: '400px' }}
    >
      {state.customCss && <style>{state.customCss}</style>}

      {/* Top Brand Bar */}
      <div className="canvas-brand-bar">
        <div className="canvas-menu-icon" style={{ color: state.secondaryColor }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </div>

        <div className="canvas-logo-container">
          {/* Brand Logo */}
          <div className="canvas-logo-wrapper">
            {state.logoUrl ? (
              <img src={state.logoUrl} className="canvas-logo-img" alt="Logo" />
            ) : (
              <svg viewBox="0 0 45 50" className="canvas-logo-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
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

      <div className="canvas-content">
        {/* Modern Geometric Accent */}
        <div
          className="canvas-accent-strip"
          style={{ backgroundColor: state.accentColor }}
        ></div>

        {/* Main Image Container */}
        <div className="canvas-image-container">
          <div className="canvas-image-frame">
            <img
              src={state.imageUrl}
              alt="Brand Visual"
              crossOrigin="anonymous"
              className={`canvas-image ${state.isGrayscale ? 'canvas-image-grayscale' : ''}`}
            />
            {state.isGrayscale && (
              <div
                className="canvas-color-overlay"
                style={{ backgroundColor: state.secondaryColor }}
              ></div>
            )}
          </div>

          {/* Secondary Accent Box */}
          <div
            className="canvas-dots-decoration"
            style={{ backgroundColor: state.accentColor }}
          >
            <div className="canvas-dots-group">
              <div className="canvas-dot canvas-dot-white"></div>
              <div className="canvas-dot" style={{ backgroundColor: state.secondaryColor }}></div>
              <div className="canvas-dot canvas-dot-white"></div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="canvas-text-section">
          {state.showCircle && (
            <div
              className="canvas-blur-circle"
              style={{ backgroundColor: state.accentColor }}
            ></div>
          )}

          {/* Headline */}
          <div className="canvas-headline-box">
            <div className="canvas-headline-bar"></div>
            <h2
              className="canvas-headline"
              style={{ color: state.secondaryColor }}
            >
              {state.headline}
            </h2>
          </div>

          {/* Subline */}
          {state.subline && (
            <div className="canvas-subline-box">
              <p className="canvas-subline">
                {state.subline}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="canvas-footer"
          style={{ backgroundColor: state.secondaryColor }}
        >
          <div className="canvas-footer-content">
            <div className="canvas-footer-icon" style={{ backgroundColor: state.accentColor }}></div>
            <span className="canvas-footer-text">{state.footerText}</span>
          </div>
          <div className="canvas-edition-text">EDITION 2025</div>
        </div>
      </div>
    </div>
  );
});

DesignCanvas.displayName = 'DesignCanvas';