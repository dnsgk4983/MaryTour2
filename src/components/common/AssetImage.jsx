import { useState } from 'react';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { useRef } from 'react';

import { get_mode_asset } from '../../data/assets.js';
import { get_data_mode } from '../../services/data_mode.js';

gsap.registerPlugin(useGSAP);

export default function AssetImage({
    name,
    class_name = '',
    alt = '',
    animate = true,
    priority = 'auto',
    data_mode = get_data_mode()
}) {
    const image_ref = useRef(null);

    const src = get_mode_asset(
        name,
        data_mode
    );

    const [loaded_src, set_loaded_src] = useState(null);
    const [failed_src, set_failed_src] = useState(null);

    const loaded = loaded_src === src;

    const reduced_motion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    const use_animation = (
        animate &&
        !reduced_motion &&
        data_mode !== 'low'
    );

    useGSAP(() => {
        if (
            !loaded ||
            !image_ref.current ||
            !use_animation
        ) {
            return;
        }

        gsap.fromTo(
            image_ref.current,
            {
                opacity: 0
            },
            {
                opacity: 1,
                duration: 0.65,
                ease: 'power2.out',
                clearProps: 'opacity'
            }
        );
    }, {
        scope: image_ref,
        dependencies: [
            loaded,
            use_animation,
            src
        ],
        revertOnUpdate: true
    });

    if (!src || failed_src === src) {
        return null;
    }

    return (
        <img
            key={src}
            ref={image_ref}
            className={class_name}
            src={src}
            alt={alt}
            decoding="async"
            fetchPriority={priority}
            onLoad={() => set_loaded_src(src)}
            onError={() => set_failed_src(src)}
            style={{
                visibility: loaded
                    ? 'visible'
                    : 'hidden'
            }}
        />
    );
}