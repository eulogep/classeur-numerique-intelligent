import React, { useEffect, useState } from 'react';
import './ParticleEffects.css';

const ParticleEffects = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Créer des particules aléatoires
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 10 + 5,
          delay: Math.random() * 5
        });
      }
      setParticles(newParticles);
    };

    createParticles();

    // Recréer les particules périodiquement
    const interval = setInterval(createParticles, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="particles-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffects; 