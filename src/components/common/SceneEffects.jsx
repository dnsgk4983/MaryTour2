import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export default function SceneEffects({
    enabled = true
}) {
    const effects_ref = useRef(null);
    const sunlight_ref = useRef(null);
    const dust_ref = useRef(null);

    useGSAP(() => {
        if (!enabled) {
            return;
        }

        const sunlight = sunlight_ref.current;
        const dust = dust_ref.current;

        gsap.fromTo(
            sunlight,
            {
                opacity: 0.2
            },
            {
                opacity: 0.65,
                duration: 6,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            }
        );

        gsap.fromTo(
            dust,
            {
                opacity: 0.25
            },
            {
                opacity: 0.7,
                duration: 4,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            }
        );
    }, {
        scope: effects_ref,
        dependencies: [enabled],
        revertOnUpdate: true
    });

    if (!enabled) {
        return null;
    }

    return (
        <div
            className="scene_effects"
            ref={effects_ref}
            aria-hidden="true"
        >
            <div
                className="effect_sunlight"
                ref={sunlight_ref}
            />

            <div
                className="effect_dust_light"
                ref={dust_ref}
            />
        </div>
    );
}