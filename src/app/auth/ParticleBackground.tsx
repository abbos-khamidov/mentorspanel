'use client';

import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { type Container, type ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

export default function ParticleBackground({ isSad }: { isSad: boolean }) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: 'push',
          },
          onHover: {
            enable: true,
            mode: 'repulse',
            parallax: {
              enable: false,
              force: 60,
              smooth: 10,
            },
          },
        },
        modes: {
          push: {
            quantity: 2,
          },
          repulse: {
            distance: 120,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: isSad ? '#ff6b6b' : '#ffffff',
        },
        links: {
          enable: true,
          color: isSad ? '#ff6b6b' : '#ffffff',
          distance: 120,
          opacity: isSad ? 0.2 : 0.15,
          width: 0.8,
        },
        move: {
          enable: true,
          direction: 'none',
          outModes: {
            default: 'out',
          },
          random: false,
          speed: isSad ? 0.3 : 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: isSad ? 30 : 50,
        },
        opacity: {
          value: isSad ? 0.3 : 0.2,
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
            destroy: 'none',
            startValue: 'random',
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 2.5 },
          animation: {
            enable: true,
            speed: 2,
            size_min: 0.5,
            sync: false,
          },
        },
      },
      detectRetina: true,
      smooth: true,
    }),
    [isSad]
  );

  if (!init) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Particles id="tsparticles" options={options} />
    </div>
  );
}
