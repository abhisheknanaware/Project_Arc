import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import './Intro3D.css';

export default function Intro3D({ onComplete }) {
  const mountRef   = useRef(null);   // Three.js canvas mount
  const overlayRef = useRef(null);   // full overlay div
  const doneRef    = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    const el = overlayRef.current;
    if (!el) { onComplete?.(); return; }
    el.classList.add('arc-intro--exit');
    setTimeout(() => onComplete?.(), 900);
  }, [onComplete]);

  /* ── Three.js particle field ── */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth, H = mount.clientHeight;
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* particles */
    const COUNT = 1800;
    const pos   = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x00d4ff, size: 0.12, sizeAttenuation: true, transparent: true, opacity: 0.55,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* second layer — gold */
    const pos2 = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      pos2[i * 3]     = (Math.random() - 0.5) * 100;
      pos2[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos2[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    const geo2 = new THREE.BufferGeometry();
    geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
    const mat2 = new THREE.PointsMaterial({
      color: 0xc9a84c, size: 0.08, sizeAttenuation: true, transparent: true, opacity: 0.3,
    });
    scene.add(new THREE.Points(geo2, mat2));

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      points.rotation.y += 0.00035;
      points.rotation.x += 0.00015;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  /* ── Auto-finish timer ── */
  useEffect(() => {
    const t = setTimeout(finish, 4200);
    return () => clearTimeout(t);
  }, [finish]);

  return (
    <div className="arc-intro" ref={overlayRef}>
      {/* grain overlay */}
      <div className="arc-intro__grain" />

      {/* Three.js canvas mount */}
      <div className="arc-intro__canvas" ref={mountRef} />

      {/* ── Centre stage ── */}
      <div className="arc-intro__stage">

        {/* SVG arc logo + embedded name */}
        <div className="arc-intro__logo-wrap">
          <svg
            className="arc-intro__svg"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Gradients and Filters */}
            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#E8F4FF" />
                <stop offset="45%"  stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#E8F4FF" />
              </linearGradient>
              <linearGradient id="waveGrad1" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#58a6ff"/>
                <stop offset="100%" stopColor="#00d2ff"/>
              </linearGradient>
              <linearGradient id="waveGrad2" x1="64" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#79c0ff" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="#58a6ff" stopOpacity="0.35"/>
              </linearGradient>
              <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Wave Logo Group scaled and centered */}
            <g transform="translate(120, 25) scale(2.5)">
              {/* Floating particles */}
              <circle className="arc-particle arc-particle--1" cx="12" cy="16" r="2.5" fill="#58a6ff" opacity="0.85" filter="url(#waveGlow)"/>
              <circle className="arc-particle arc-particle--2" cx="52" cy="14" r="1.8" fill="#00d2ff" opacity="0.75"/>
              <circle className="arc-particle arc-particle--3" cx="32" cy="10" r="2.0" fill="#79c0ff" opacity="0.8" filter="url(#waveGlow)"/>
              <circle className="arc-particle arc-particle--4" cx="50" cy="50" r="1.8" fill="#58a6ff" opacity="0.5"/>
              <circle className="arc-particle arc-particle--5" cx="14" cy="48" r="2.2" fill="#00d2ff" opacity="0.6"/>
              <circle className="arc-particle arc-particle--6" cx="38" cy="52" r="1.5" fill="#79c0ff" opacity="0.45"/>

              {/* Air wave arcs (3 layers) */}
              <path
                className="arc-path arc-path--wave1"
                d="M8 40 Q18 22 32 28 Q46 34 56 18"
                stroke="url(#waveGrad1)"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                filter="url(#waveGlow)"
              />
              <path
                className="arc-path arc-path--wave2"
                d="M8 48 Q19 31 33 37 Q47 43 56 28"
                stroke="url(#waveGrad1)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.65"
              />
              <path
                className="arc-path arc-path--wave3"
                d="M8 56 Q20 40 34 46 Q48 52 56 38"
                stroke="url(#waveGrad2)"
                strokeWidth="2.0"
                strokeLinecap="round"
                fill="none"
                opacity="0.45"
              />
            </g>

            {/* ── PROJECT ARC text ── */}
            {/* "PROJECT" — small tracking above */}
            <text
              className="arc-svg-label"
              x="200" y="215"
              textAnchor="middle"
              fill="rgba(232,244,255,0.65)"
              fontSize="12"
              fontFamily="Rajdhani, Segoe UI, sans-serif"
              fontWeight="500"
              letterSpacing="10"
            >
              PROJECT
            </text>
            {/* "ARC" — big, bold, cyan-white gradient */}
            <text
              className="arc-svg-name"
              x="200" y="265"
              textAnchor="middle"
              fill="url(#arcGrad)"
              fontSize="44"
              fontFamily="Bebas Neue, Impact, sans-serif"
              fontWeight="400"
              letterSpacing="18"
            >
              ARC
            </text>
          </svg>

          {/* pulsing glow ring behind logo */}
          <div className="arc-intro__glow-ring" />
        </div>

      </div>

      {/* progress bar */}
      <div className="arc-intro__progress">
        <div className="arc-intro__progress-fill" />
      </div>

      {/* skip button */}
      <button className="arc-intro__skip" onClick={finish}>
        Skip Intro ›
      </button>
    </div>
  );
}
