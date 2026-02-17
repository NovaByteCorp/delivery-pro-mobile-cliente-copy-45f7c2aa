import React, { useEffect, useState } from 'react';

/**
 * SplashScreen — React Web (sem react-native)
 * @param {object}   props
 * @param {string}   props.logo              - URL ou import da imagem do logo
 * @param {string}   [props.backgroundColor] - cor de fundo (padrão: '#F97316')
 * @param {number}   [props.duration]        - duração total em ms (padrão: 2800)
 * @param {Function} props.onFinish          - callback ao terminar
 */
export default function SplashScreen({
  logo,
  backgroundColor = '#F97316',
  duration = 2800,
  onFinish,
}) {
  const [phase, setPhase] = useState('enter'); // 'enter' | 'exit'

  useEffect(() => {
    const exitAt = duration - 600;
    const exitTimer = setTimeout(() => setPhase('exit'), exitAt);
    const doneTimer = setTimeout(() => onFinish(), duration);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onFinish]);

  return (
    <>
      <style>{`
        @keyframes splash-logo-in {
          0%   { opacity: 0; transform: scale(0.3); }
          60%  { opacity: 1; transform: scale(1.08); }
          80%  { transform: scale(0.97); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes splash-glow-in {
          0%   { opacity: 0; transform: scale(0.5); }
          100% { opacity: 0.35; transform: scale(1); }
        }

        @keyframes splash-ring {
          0%   { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 0;   transform: scale(2.4); }
        }

        @keyframes splash-bounce {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.07); }
        }

        @keyframes splash-fade-out {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }

        .splash-root {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
        }

        .splash-root.exit {
          animation: splash-fade-out 0.6s ease-in-out forwards;
        }

        .splash-glow {
          position: absolute;
          width: 80vmin;
          height: 80vmin;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          filter: blur(70px);
          animation: splash-glow-in 0.8s 0.2s ease-out forwards;
          opacity: 0;
        }

        .splash-ring {
          position: absolute;
          width: 60vmin;
          height: 60vmin;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.7);
          animation: splash-ring 0.9s 0.4s ease-out forwards;
          opacity: 0;
        }

        .splash-logo {
          position: relative;
          z-index: 2;
          width: min(50vw, 50vh);
          height: min(50vw, 50vh);
          object-fit: contain;
          animation:
            splash-logo-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards,
            splash-bounce 0.35s 1.1s ease-in-out forwards;
          opacity: 0;
        }
      `}</style>

      <div
        className={`splash-root ${phase === 'exit' ? 'exit' : ''}`}
        style={{ backgroundColor }}
      >
        <div className="splash-glow" />
        <div className="splash-ring" />
        <img
          className="splash-logo"
          src={logo}
          alt="Logo"
          draggable={false}
        />
      </div>
    </>
  );
}