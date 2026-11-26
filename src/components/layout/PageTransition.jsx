import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { settings } from '../../data/settings.js';

gsap.registerPlugin(useGSAP);

export default function PageTransition({
    children,
    data_mode = 'normal'
}) {
    const transition_ref = useRef(null);

    useGSAP(() => {
        const reduced_motion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (reduced_motion || data_mode === 'low') {
            return;
        }

        gsap.fromTo(
            transition_ref.current,
            {
                opacity: 0
            },
            {
                opacity: 1,
                duration: settings.animation.duration,
                ease: settings.animation.ease,
                clearProps: 'opacity'
            }
        );
    }, {
        scope: transition_ref,
        dependencies: [data_mode],
        revertOnUpdate: true
    });

    return (
        <div
            className="page_transition"
            ref={transition_ref}
        >
            {children}
        </div>
    );
}