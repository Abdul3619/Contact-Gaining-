/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface GlobalExchangeCanvasProps {
  isDark: boolean;
}

interface HubNode {
  id: string;
  name: string;
  code: string;
  // Normalized world coordinates (0 to 1 range across canvas)
  nx: number;
  ny: number;
  // Calculated pixel positions
  x: number;
  y: number;
  radius: number;
  pulsePhase: number;
  activeUntil: number;
  ripples: Array<{ radius: number; maxRadius: number; opacity: number }>;
}

interface ArcConnection {
  fromIndex: number;
  toIndex: number;
  curvature: number; // arc bend factor
}

interface ExchangePacket {
  arcIndex: number;
  progress: number; // 0 to 1
  speed: number;
  length: number;
  forward: boolean;
  color: string;
}

interface AmbientNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export const GlobalExchangeCanvas: React.FC<GlobalExchangeCanvasProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking with smooth lerp
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Major International WhatsApp Community Hubs (normalized 0..1)
    // Placed in a stylized world-network projection
    const hubsData: Array<{ id: string; name: string; code: string; nx: number; ny: number }> = [
      { id: 'los', name: 'Lagos', code: '+234', nx: 0.49, ny: 0.54 },
      { id: 'acc', name: 'Accra', code: '+233', nx: 0.46, ny: 0.53 },
      { id: 'nbo', name: 'Nairobi', code: '+254', nx: 0.59, ny: 0.58 },
      { id: 'jnb', name: 'Johannesburg', code: '+27', nx: 0.55, ny: 0.74 },
      { id: 'cai', name: 'Cairo', code: '+20', nx: 0.56, ny: 0.41 },
      { id: 'lon', name: 'London', code: '+44', nx: 0.47, ny: 0.31 },
      { id: 'par', name: 'Paris', code: '+33', nx: 0.49, ny: 0.34 },
      { id: 'ber', name: 'Berlin', code: '+49', nx: 0.52, ny: 0.30 },
      { id: 'dxb', name: 'Dubai', code: '+971', nx: 0.65, ny: 0.45 },
      { id: 'tor', name: 'Toronto', code: '+1', nx: 0.28, ny: 0.32 },
      { id: 'nyc', name: 'New York', code: '+1', nx: 0.31, ny: 0.36 },
      { id: 'sao', name: 'São Paulo', code: '+55', nx: 0.36, ny: 0.71 },
      { id: 'tyo', name: 'Tokyo', code: '+81', nx: 0.85, ny: 0.38 },
      { id: 'sin', name: 'Singapore', code: '+65', nx: 0.76, ny: 0.59 },
      { id: 'syd', name: 'Sydney', code: '+61', nx: 0.88, ny: 0.78 },
    ];

    const hubs: HubNode[] = hubsData.map((h) => ({
      ...h,
      x: h.nx * width,
      y: h.ny * height,
      radius: 4,
      pulsePhase: Math.random() * Math.PI * 2,
      activeUntil: 0,
      ripples: [],
    }));

    // Realistic Exchange Arcs connecting the hubs
    const arcsData: Array<{ from: string; to: string; curvature: number }> = [
      { from: 'los', to: 'lon', curvature: -0.22 },
      { from: 'los', to: 'acc', curvature: 0.15 },
      { from: 'los', to: 'nbo', curvature: 0.18 },
      { from: 'nbo', to: 'jnb', curvature: -0.15 },
      { from: 'los', to: 'cai', curvature: -0.18 },
      { from: 'cai', to: 'dxb', curvature: 0.16 },
      { from: 'lon', to: 'par', curvature: 0.12 },
      { from: 'par', to: 'ber', curvature: -0.14 },
      { from: 'lon', to: 'nyc', curvature: -0.32 },
      { from: 'nyc', to: 'tor', curvature: 0.12 },
      { from: 'nyc', to: 'sao', curvature: 0.25 },
      { from: 'sao', to: 'los', curvature: -0.22 },
      { from: 'lon', to: 'dxb', curvature: -0.25 },
      { from: 'dxb', to: 'sin', curvature: 0.2 },
      { from: 'sin', to: 'tyo', curvature: -0.18 },
      { from: 'tyo', to: 'syd', curvature: 0.22 },
      { from: 'sin', to: 'syd', curvature: -0.16 },
      { from: 'tor', to: 'lon', curvature: -0.35 },
    ];

    const hubIdMap = new Map<string, number>();
    hubs.forEach((h, idx) => hubIdMap.set(h.id, idx));

    const arcs: ArcConnection[] = [];
    arcsData.forEach((ad) => {
      const fromIdx = hubIdMap.get(ad.from);
      const toIdx = hubIdMap.get(ad.to);
      if (fromIdx !== undefined && toIdx !== undefined) {
        arcs.push({
          fromIndex: fromIdx,
          toIndex: toIdx,
          curvature: ad.curvature,
        });
      }
    });

    // Contact Exchange Packets traveling along the arcs
    const packets: ExchangePacket[] = arcs.map((_, i) => ({
      arcIndex: i,
      progress: (i * 0.18) % 1,
      speed: 0.0025 + Math.random() * 0.0035,
      length: 0.12 + Math.random() * 0.08,
      forward: Math.random() > 0.35,
      color: '#C5A15B',
    }));

    // Ambient floating contact dots
    const ambientCount = 35;
    const ambientNodes: AmbientNode[] = [];
    for (let i = 0; i < ambientCount; i++) {
      ambientNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 1 + Math.random() * 1.5,
        alpha: 0.15 + Math.random() * 0.25,
      });
    }

    // Resize Handler
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Re-normalize hubs based on screen size
      // Ensure aspect-ratio preservation so Africa/Europe/Americas/Asia look natural
      const scaleX = width;
      const scaleY = height;
      hubs.forEach((h) => {
        h.x = h.nx * scaleX;
        h.y = h.ny * scaleY;
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Quadratic Bezier Helper
    const getArcControlPoint = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      curvature: number
    ): { x: number; y: number } => {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const normalX = -dy;
      const normalY = dx;
      return {
        x: mx + normalX * curvature,
        y: my + normalY * curvature,
      };
    };

    const getBezierPoint = (
      t: number,
      p0: { x: number; y: number },
      p1: { x: number; y: number },
      p2: { x: number; y: number }
    ) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      return {
        x: uu * p0.x + 2 * u * t * p1.x + tt * p2.x,
        y: uu * p0.y + 2 * u * t * p1.y + tt * p2.y,
      };
    };

    let lastTime = performance.now();

    // Main 60fps Animation Loop
    const render = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      }

      ctx.clearRect(0, 0, width, height);

      // Palette Colors tailored for Light and Dark modes
      const goldColor = isDark ? '#C5A15B' : '#9D7B43';
      const bronzeColor = isDark ? '#9D7B43' : '#B89047';
      const textColor = isDark ? 'rgba(197, 161, 91, 0.55)' : 'rgba(115, 87, 43, 0.65)';
      const lineOpacity = isDark ? 0.16 : 0.22;
      const activeLineOpacity = isDark ? 0.45 : 0.55;

      // 1. Draw subtle global parallels & meridians (Cartographic aesthetic)
      ctx.save();
      ctx.setLineDash([4, 8]);
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = isDark ? 'rgba(197, 161, 91, 0.08)' : 'rgba(157, 123, 67, 0.12)';

      // Equator
      const equatorY = height * 0.55;
      ctx.beginPath();
      ctx.moveTo(0, equatorY);
      ctx.lineTo(width, equatorY);
      ctx.stroke();

      // Northern Latitude (30°N)
      const lat30NY = height * 0.34;
      ctx.beginPath();
      ctx.moveTo(0, lat30NY);
      ctx.lineTo(width, lat30NY);
      ctx.stroke();

      // Southern Latitude (30°S)
      const lat30SY = height * 0.74;
      ctx.beginPath();
      ctx.moveTo(0, lat30SY);
      ctx.lineTo(width, lat30SY);
      ctx.stroke();

      // Prime Meridian (passing near London/Accra)
      const meridianX = width * 0.47;
      ctx.beginPath();
      ctx.moveTo(meridianX, 0);
      ctx.lineTo(meridianX, height);
      ctx.stroke();
      ctx.restore();

      // Latitude Labels (Fine typographic telemetry)
      ctx.font = '9px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
      ctx.fillStyle = isDark ? 'rgba(197, 161, 91, 0.3)' : 'rgba(157, 123, 67, 0.35)';
      ctx.fillText('30°N · NORTHERN HEMISPHERE', 24, lat30NY - 6);
      ctx.fillText('00°EQ · EQUATORIAL EXCHANGE AXIS', 24, equatorY - 6);
      ctx.fillText('30°S · SOUTHERN HEMISPHERE', 24, lat30SY - 6);
      ctx.fillText('00°00\'W · PRIME MERIDIAN', meridianX + 8, 48);

      // 2. Draw Floating Ambient Member Nodes
      ambientNodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(197, 161, 91, ${node.alpha * 0.8})`
          : `rgba(157, 123, 67, ${node.alpha * 0.9})`;
        ctx.fill();
      });

      // 3. Draw Arc Connections between International Hubs
      arcs.forEach((arc) => {
        const fromHub = hubs[arc.fromIndex];
        const toHub = hubs[arc.toIndex];
        const cp = getArcControlPoint(fromHub.x, fromHub.y, toHub.x, toHub.y, arc.curvature);

        // Distance to mouse for interactive highlight
        let isHovered = false;
        if (mouse.active) {
          const mid = getBezierPoint(0.5, fromHub, cp, toHub);
          const distToMouse = Math.hypot(mid.x - mouse.x, mid.y - mouse.y);
          if (distToMouse < 180) {
            isHovered = true;
          }
        }

        ctx.beginPath();
        ctx.moveTo(fromHub.x, fromHub.y);
        ctx.quadraticCurveTo(cp.x, cp.y, toHub.x, toHub.y);
        ctx.strokeStyle = isHovered
          ? (isDark ? 'rgba(229, 192, 123, 0.45)' : 'rgba(157, 123, 67, 0.55)')
          : (isDark ? `rgba(197, 161, 91, ${lineOpacity})` : `rgba(157, 123, 67, ${lineOpacity})`);
        ctx.lineWidth = isHovered ? 1.4 : 0.9;
        ctx.stroke();
      });

      // 4. Update and Render Contact Exchange Packets (Luminous data pulses)
      packets.forEach((p) => {
        p.progress += p.speed;
        const arc = arcs[p.arcIndex];
        const fromHub = p.forward ? hubs[arc.fromIndex] : hubs[arc.toIndex];
        const toHub = p.forward ? hubs[arc.toIndex] : hubs[arc.fromIndex];
        const cp = getArcControlPoint(
          fromHub.x,
          fromHub.y,
          toHub.x,
          toHub.y,
          p.forward ? arc.curvature : -arc.curvature
        );

        // When a packet reaches destination, trigger a contact handshake ripple
        if (p.progress >= 1) {
          p.progress = 0;
          p.forward = !p.forward; // Return packet / reciprocal exchange
          toHub.ripples.push({
            radius: 4,
            maxRadius: 28 + Math.random() * 16,
            opacity: 0.8,
          });
          toHub.activeUntil = currentTime + 1200;
        }

        // Draw packet trail
        const trailSteps = 12;
        for (let s = 0; s < trailSteps; s++) {
          const stepT = Math.max(0, p.progress - (s * p.length) / trailSteps);
          const pos = getBezierPoint(stepT, fromHub, cp, toHub);
          const alpha = (1 - s / trailSteps) * (isDark ? 0.75 : 0.85);
          const radius = (1 - s / trailSteps) * 2.2 + 0.6;

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `rgba(229, 192, 123, ${alpha})`
            : `rgba(157, 123, 67, ${alpha})`;
          ctx.fill();
        }

        // Luminous Head Bead
        const headPos = getBezierPoint(p.progress, fromHub, cp, toHub);
        ctx.beginPath();
        ctx.arc(headPos.x, headPos.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#FFEBB7' : '#9D7B43';
        ctx.shadowColor = isDark ? '#E5C07B' : '#C5A15B';
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 5. Draw Hub Ripples (Contact sync wave)
      hubs.forEach((hub) => {
        for (let i = hub.ripples.length - 1; i >= 0; i--) {
          const rip = hub.ripples[i];
          rip.radius += 0.8;
          rip.opacity -= 0.015;

          if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
            hub.ripples.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(hub.x, hub.y, rip.radius, 0, Math.PI * 2);
          ctx.strokeStyle = isDark
            ? `rgba(229, 192, 123, ${rip.opacity * 0.7})`
            : `rgba(157, 123, 67, ${rip.opacity * 0.75})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // 6. Draw International Member Hubs
      hubs.forEach((hub) => {
        hub.pulsePhase += dt * 2.2;
        const breath = Math.sin(hub.pulsePhase) * 1.2;
        const isActive = currentTime < hub.activeUntil;

        // Interactive mouse proximity check
        let isNearMouse = false;
        if (mouse.active) {
          const dist = Math.hypot(hub.x - mouse.x, hub.y - mouse.y);
          if (dist < 120) isNearMouse = true;
        }

        // Outer Glow Ring
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, hub.radius + 3 + breath, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? (isActive || isNearMouse ? 'rgba(229, 192, 123, 0.8)' : 'rgba(197, 161, 91, 0.25)')
          : (isActive || isNearMouse ? 'rgba(157, 123, 67, 0.85)' : 'rgba(157, 123, 67, 0.3)');
        ctx.lineWidth = 1;
        ctx.stroke();

        // Core Node
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, hub.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? (isActive || isNearMouse ? '#FFF1C5' : goldColor)
          : (isActive || isNearMouse ? '#7B5E2C' : bronzeColor);
        ctx.fill();

        // Country Calling Code & City Label
        ctx.font = '600 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = isDark ? '#E5DFD5' : '#2D2821';
        ctx.fillText(hub.name, hub.x + 8, hub.y - 4);

        ctx.font = '500 9px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
        ctx.fillStyle = textColor;
        ctx.fillText(hub.code, hub.x + 8, hub.y + 7);
      });

      // 7. Mouse Ambient Flare (Realistic subtle resonance)
      if (mouse.active) {
        const mouseGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          160
        );
        mouseGrad.addColorStop(
          0,
          isDark ? 'rgba(197, 161, 91, 0.12)' : 'rgba(157, 123, 67, 0.14)'
        );
        mouseGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 160, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: 'block' }}
    />
  );
};
