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
 * 2. Moving Exchange Packets: Luminous light beads gliding across global arcs,
 *    simulating real-time mutual contact exchanges and batch releases.
 * 3. Contact Handshake Ripples: Concentric sonar pings emit from hubs when a
 *    contact packet arrives at its destination.
 * 4. Dual-Theme Elegance:
 *    - In Dark Mode: Deep obsidian and charcoal base with radiant warm gold
 *      and antique bronze light pulses.
 *    - In White/Light Mode: Warm ivory, vellum, and stone base with burnished
 *      bronze arcs, deep amber pulses, and warm graphite coordinates.
 * 5. Interactive Magnetic Resonance: Follows cursor/touch with smooth easing,
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
      {/* 1. Deep Atmospheric Gradient Lights (Illuminating the canvas depth) */}
      <div
        className="absolute -top-[10%] -right-[5%] w-[600px] sm:w-[900px] lg:w-[1200px] h-[600px] sm:h-[900px] lg:h-[1200px] rounded-full blur-[110px] sm:blur-[160px] transition-all duration-700 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 65% 35%, rgba(197, 161, 91, 0.16) 0%, rgba(157, 123, 67, 0.08) 45%, transparent 70%)'
            : 'radial-gradient(circle at 65% 35%, rgba(197, 161, 91, 0.18) 0%, rgba(157, 123, 67, 0.08) 45%, transparent 70%)',
        }}
      />

      <div
        className="absolute -bottom-[15%] -left-[10%] w-[500px] sm:w-[850px] lg:w-[1100px] h-[500px] sm:h-[850px] lg:h-[1100px] rounded-full blur-[120px] sm:blur-[170px] transition-all duration-700 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 35% 65%, rgba(157, 123, 67, 0.14) 0%, rgba(21, 19, 15, 0.7) 50%, transparent 75%)'
            : 'radial-gradient(circle at 35% 65%, rgba(212, 175, 102, 0.16) 0%, rgba(238, 232, 222, 0.6) 50%, transparent 75%)',
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
