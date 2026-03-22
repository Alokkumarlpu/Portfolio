import { useMemo, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const GlobalParticles = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(() => ({
    fullScreen: { enable: true, zIndex: -1 },
    background: { color: { value: "transparent" } },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "bubble" },
      },
      modes: {
        bubble: { distance: 200, size: 4, duration: 2, opacity: 0.8, speed: 3 },
      },
    },
    particles: {
      color: { value: ["#7c3aed", "#06b6d4", "#ffffff"] },
      links: {
        color: "#ffffff",
        distance: 200,
        enable: false,
        opacity: 0.1,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "out" },
        random: true,
        speed: 0.5,
        straight: false,
      },
      number: {
        density: { enable: true, area: 800 },
        value: 40,
      },
      opacity: {
        value: { min: 0.1, max: 0.3 },
        animation: { enable: true, speed: 0.5, sync: false }
      },
      shape: { type: "circle" },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    detectRetina: true,
  }), []);

  if (init) {
    return <Particles id="global-particles" options={options} />;
  }

  return null;
};

export default GlobalParticles;
