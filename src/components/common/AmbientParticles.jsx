import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export default function AmbientParticles({
    count = 14
}) {
    const container_ref = useRef(null);

    useGSAP(() => {
        const particles = gsap.utils.toArray(
            '.ambient_particle',
            container_ref.current
        );

        particles.forEach((particle) => {
            const x = gsap.utils.random(20, 980);
            const y = gsap.utils.random(120, 1250);
            const distance = gsap.utils.random(25, 85);
            const duration = gsap.utils.random(4, 8);

            gsap.set(particle, {
                left: `calc(var(--scene_unit) * ${x})`,
                top: `calc(var(--scene_unit) * ${y})`,
                opacity: 0,
                scale: gsap.utils.random(0.5, 1.2)
            });

            gsap.to(particle, {
                y: -distance,
                duration,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });

            gsap.to(particle, {
                opacity: gsap.utils.random(0.25, 0.65),
                duration: duration / 2,
                delay: gsap.utils.random(0, 3),
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        });
    }, {
        scope: container_ref,
        dependencies: [count],
        revertOnUpdate: true
    });

    return (
        <div
            className="ambient_particles"
            ref={container_ref}
            aria-hidden="true"
        >
            {Array.from({
                length: count
            }, (_, index) => (
                <span
                    className="ambient_particle"
                    key={index}
                />
            ))}
        </div>
    );
}