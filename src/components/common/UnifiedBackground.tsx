/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { GlobalExchangeCanvas } from './GlobalExchangeCanvas';

/**
 * UnifiedAtmosphericBackground
 * 
 * A living, creative, realistic background engineered specifically for
 * the Contact Gaining International WhatsApp Contact Exchange Platform.
 * 
 * Features:
 * 1. Living Geodesic Exchange Network: Real international community hubs
 *    (Lagos +234, London +44, Nairobi +254, Toronto +1, Dubai +971, Paris +33, etc.)
 *    connected by great-circle arcs.
 * 2. Subtle, Slow-Moving Ambient Light Blobs: GPU-accelerated CSS keyframe animations
 *    that adapt color, radiance, and opacity dynamically to light and dark themes.
 * 3. Moving Exchange Packets: Luminous light beads gliding across global arcs,
 *    simulating real-time mutual contact exchanges and batch releases.
 * 4. Contact Handshake Ripples: Concentric sonar pings emit from hubs when a
 *    contact packet arrives at its destination.
 * 5. Dual-Theme Elegance:
 *    - In Dark Mode: Deep obsidian and charcoal base with radiant warm gold
 *      and antique bronze light pulses.
 *    - In White/Light Mode: Warm ivory, vellum, and stone base with burnished
 *      bronze arcs, deep amber pulses, and warm graphite coordinates.
 * 6. Interactive Magnetic Resonance: Follows cursor/touch with smooth easing,
 *    illuminating nearby connection pathways and nodes.
 */
export const UnifiedAtmosphericBackground: React.FC = () => {
  const { resolvedTheme } = useApp();
  const isDark = resolvedTheme === 'dark';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none transition-colors duration-700"
      style={{
        backgroundColor: isDark ? '#090807' : '#F7F4EE',
      }}
    >
      {/* 1. Subtle, slow-moving ambient light blobs using CSS keyframes (GPU-accelerated) */}
      {/* Blob 1: Top-Right primary aura */}
      <div
        className="absolute -top-[10%] -right-[5%] w-[550px] sm:w-[850px] lg:w-[1100px] h-[550px] sm:h-[850px] lg:h-[1100px] rounded-full blur-[100px] sm:blur-[150px] animate-ambient-blob-1 pointer-events-none transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 60% 40%, rgba(197, 161, 91, 0.17) 0%, rgba(157, 123, 67, 0.08) 50%, transparent 72%)'
            : 'radial-gradient(circle at 60% 40%, rgba(212, 175, 103, 0.20) 0%, rgba(184, 144, 71, 0.09) 50%, transparent 72%)',
        }}
      />

      {/* Blob 2: Bottom-Left counter-balance aura */}
      <div
        className="absolute -bottom-[15%] -left-[10%] w-[500px] sm:w-[800px] lg:w-[1000px] h-[500px] sm:h-[800px] lg:h-[1000px] rounded-full blur-[110px] sm:blur-[160px] animate-ambient-blob-2 pointer-events-none transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 40% 60%, rgba(157, 123, 67, 0.14) 0%, rgba(21, 19, 15, 0.7) 50%, transparent 75%)'
            : 'radial-gradient(circle at 40% 60%, rgba(197, 161, 91, 0.18) 0%, rgba(238, 232, 222, 0.6) 50%, transparent 75%)',
        }}
      />

      {/* Blob 3: Center-Floating atmospheric depth aura */}
      <div
        className="absolute top-[30%] left-[25%] w-[400px] sm:w-[650px] lg:w-[850px] h-[400px] sm:h-[650px] lg:h-[850px] rounded-full blur-[120px] sm:blur-[170px] animate-ambient-blob-3 pointer-events-none transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(229, 192, 123, 0.07) 0%, rgba(157, 123, 67, 0.03) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(212, 175, 103, 0.11) 0%, rgba(197, 161, 91, 0.04) 45%, transparent 70%)',
        }}
      />

      {/* 2. Living Global Exchange Canvas (Great-circle arcs, moving pulses & ripples) */}
      <GlobalExchangeCanvas isDark={isDark} />

      {/* 3. Subtle Astrolabe / Celestial Coordinates Overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08] transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${isDark ? '#C5A15B' : '#9D7B43'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 4. Fine Analog Grain Texture (Physical stone & paper feel) */}
      <div className="absolute inset-0 bg-grain-texture opacity-30 dark:opacity-40 mix-blend-overlay pointer-events-none" />
    </div>
  );
};
