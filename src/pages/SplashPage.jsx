import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import Screen from '../components/layout/Screen.jsx';
import Button from '../components/common/Button.jsx';
import AssetImage from '../components/common/AssetImage.jsx';
import AmbientParticles from '../components/common/AmbientParticles.jsx';

import { story } from '../data/story.js';
import { routes } from '../data/routes.js';
import { get_data_mode } from '../services/data_mode.js';

gsap.registerPlugin(useGSAP);

export default function SplashPage() {
    const navigate = useNavigate();

    const screen_ref = useRef(null);
    const title_ref = useRef(null);
    const mary_ref = useRef(null);
    const book_ref = useRef(null);
    const actions_ref = useRef(null);
    const curtain_ref = useRef(null);
    const entrance_ref = useRef(null);
    const exit_ref = useRef(null);

    const [leaving, set_leaving] = useState(false);

    const data_mode = get_data_mode();

    const reduced_motion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    const use_animation = (
        data_mode !== 'low' &&
        !reduced_motion
    );

    const { contextSafe } = useGSAP(() => {
        if (!use_animation) {
            return;
        }

        const timeline = gsap.timeline({
            defaults: {
                ease: 'power2.out'
            }
        });

        entrance_ref.current = timeline;

        timeline.fromTo(
            title_ref.current,
            {
                opacity: 0,
                y: -14
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.85
            }
        );

        timeline.fromTo(
            mary_ref.current,
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 1.1
            },
            '-=0.45'
        );

        timeline.fromTo(
            book_ref.current,
            {
                opacity: 0,
                y: 10
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.7
            },
            '-=0.55'
        );

        timeline.fromTo(
            actions_ref.current,
            {
                opacity: 0,
                y: 10
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.65
            },
            '-=0.35'
        );

        timeline.add(() => {
            gsap.to(mary_ref.current, {
                scaleX: 1.004,
                scaleY: 1.008,
                transformOrigin: 'center bottom',
                duration: 3.2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        });
    }, {
        scope: screen_ref
    });

    const react_book = contextSafe(() => {
        if (
            leaving ||
            exit_ref.current ||
            !use_animation
        ) {
            return;
        }

        if (entrance_ref.current?.isActive()) {
            return;
        }

        gsap.fromTo(
            book_ref.current,
            {
                rotation: 0,
                scale: 1
            },
            {
                rotation: -3,
                scale: 1.045,
                duration: 0.22,
                ease: 'sine.inOut',
                repeat: 1,
                yoyo: true,
                overwrite: 'auto',
                clearProps: 'transform'
            }
        );
    });

    const start_story = contextSafe(() => {
        if (exit_ref.current || leaving) {
            return;
        }

        set_leaving(true);

        if (!use_animation) {
            navigate(routes.home);
            return;
        }

        entrance_ref.current?.pause();

        exit_ref.current = gsap.to(
            curtain_ref.current,
            {
                opacity: 1,
                duration: 0.65,
                ease: 'power2.inOut',
                onComplete: () => {
                    navigate(routes.home);
                }
            }
        );
    });

    return (
        <Screen class_name="splash">
            <div
                className="splash_scene"
                ref={screen_ref}
            >
                <AssetImage
                    name="splash_background.webp"
                    class_name="scene_background"
                    animate={false}
                    priority="high"
                    data_mode={data_mode}
                />

                <div
                    className="scene_overlay"
                    aria-hidden="true"
                />

                {use_animation && (
                    <AmbientParticles count={14} />
                )}

                <header
                    className="splash_heading"
                    ref={title_ref}
                >
                    <AssetImage
                        name="splash_title_frame.webp"
                        class_name="frame_image"
                        animate={false}
                        priority="high"
                        data_mode={data_mode}
                    />

                    <div className="frame_content">
                        <p className="splash_subtitle">
                            {story.subtitle}
                        </p>

                        <h1 className="splash_title">
                            {story.title}
                        </h1>
                    </div>
                </header>

                <div
                    className="splash_character"
                    ref={mary_ref}
                >
                    <AssetImage
                        name="splash_mary.webp"
                        class_name="object_image"
                        alt="토키노 메리"
                        priority="auto"
                        data_mode={data_mode}
                    />
                </div>

                <button
                    type="button"
                    className="splash_book object_interactive"
                    ref={book_ref}
                    onClick={react_book}
                    disabled={leaving}
                    aria-label="동화책"
                >
                    <AssetImage
                        name="splash_book.webp"
                        class_name="object_image"
                        priority="low"
                        data_mode={data_mode}
                    />
                </button>

                <div
                    className="splash_actions"
                    ref={actions_ref}
                >
                    <Button
                        class_name={
                            use_animation
                                ? 'btn_ornament btn_shimmer'
                                : 'btn_ornament'
                        }
                        disabled={leaving}
                        onClick={start_story}
                    >
                        {story.splash.start_button}
                    </Button>
                </div>

                <div
                    className="scene_curtain"
                    ref={curtain_ref}
                    aria-hidden="true"
                />
            </div>
        </Screen>
    );
}