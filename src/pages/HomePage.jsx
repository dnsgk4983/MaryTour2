import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import Screen from '../components/layout/Screen.jsx';
import ImageButton from '../components/common/ImageButton.jsx';
import AssetImage from '../components/common/AssetImage.jsx';
import AmbientParticles from '../components/common/AmbientParticles.jsx';
import SceneEffects from '../components/common/SceneEffects.jsx';
import StampCollection from '../components/common/StampCollection.jsx';

import { story } from '../data/story.js';
import { routes } from '../data/routes.js';

import {
    get_stamp_count,
    is_stamp_complete
} from '../data/stamps.js';

import { get_data_mode } from '../services/data_mode.js';

gsap.registerPlugin(useGSAP);

export default function HomePage() {
    const navigate = useNavigate();

    const scene_ref = useRef(null);
    const heading_ref = useRef(null);
    const character_ref = useRef(null);
    const dialogue_ref = useRef(null);
    const collection_ref = useRef(null);
    const actions_ref = useRef(null);
    const curtain_ref = useRef(null);
    const entrance_ref = useRef(null);
    const leaving_ref = useRef(false);

    const [leaving, set_leaving] = useState(false);

    const collected_stamps = [];

    const collected_count = get_stamp_count(
        collected_stamps
    );

    const complete = is_stamp_complete(
        collected_stamps
    );

    const background_stage = String(
        collected_count
    ).padStart(2, '0');

    const background_name = (
        `atelier_background_${background_stage}.webp`
    );

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
            heading_ref.current,
            {
                opacity: 0,
                y: -8
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.65
            }
        );

        timeline.fromTo(
            character_ref.current,
            {
                opacity: 0,
                y: 14
            },
            {
                opacity: 1,
                y: 0,
                duration: 1
            },
            '-=0.35'
        );

        timeline.fromTo(
            dialogue_ref.current,
            {
                opacity: 0,
                y: 8
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.65
            },
            '-=0.4'
        );

        timeline.fromTo(
            collection_ref.current,
            {
                opacity: 0,
                y: 12
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.75
            },
            '-=0.35'
        );

        timeline.fromTo(
            actions_ref.current,
            {
                opacity: 0,
                y: 8
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6
            },
            '-=0.4'
        );

        const breathing = gsap.to(
            character_ref.current,
            {
                scaleX: 1.003,
                scaleY: 1.005,
                transformOrigin: 'center bottom',
                duration: 3.8,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                paused: true
            }
        );

        timeline.call(() => {
            breathing.play();
        });
    }, {
        scope: scene_ref
    });

    const move_page = contextSafe((destination) => {
        if (leaving_ref.current) {
            return;
        }

        leaving_ref.current = true;

        set_leaving(true);

        if (!use_animation) {
            navigate(destination);
            return;
        }

        entrance_ref.current?.pause();

        gsap.to(curtain_ref.current, {
            opacity: 1,
            duration: 0.55,
            ease: 'power2.inOut',
            onComplete: () => {
                navigate(destination);
            }
        });
    });

    return (
        <Screen class_name="home">
            <div
                className="atelier_scene"
                ref={scene_ref}
            >
                <AssetImage
                    name={background_name}
                    class_name="scene_background"
                    animate={false}
                    priority="high"
                    data_mode={data_mode}
                />

                <div
                    className="atelier_overlay"
                    aria-hidden="true"
                />

                <div
                    className="atelier_light"
                    aria-hidden="true"
                />

                <SceneEffects enabled={use_animation} />

                {use_animation && (
                    <AmbientParticles count={10} />
                )}

                <header
                    className="atelier_heading"
                    ref={heading_ref}
                >
                    <button
                        type="button"
                        className="atelier_back"
                        aria-label="처음으로"
                        disabled={leaving}
                        onClick={() => {
                            move_page(routes.splash);
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M15 5l-7 7 7 7" />
                        </svg>
                    </button>

                    <AssetImage
                        name="ui_ribbon.webp"
                        class_name="atelier_ribbon"
                        animate={false}
                        data_mode={data_mode}
                    />

                    <p className="scene_subtitle">
                        {story.subtitle}
                    </p>

                    <h1 className="scene_title">
                        인형공방
                    </h1>

                    <div
                        className="atelier_heading_line"
                        aria-hidden="true"
                    />
                </header>

                <div className="atelier_stage">
                    <div
                        className="atelier_character"
                        ref={character_ref}
                    >
                        <AssetImage
                            name="atelier_mary.webp"
                            class_name="object_image"
                            alt="토키노 메리"
                            animate={false}
                            data_mode={data_mode}
                        />
                    </div>
                </div>

                <div className="atelier_interface">
                    <div
                        className="atelier_dialogue"
                        ref={dialogue_ref}
                    >
                        <div className="dialogue_panel dialogue_ornament">
                            <AssetImage
                                name="ui_modal_frame.webp"
                                class_name="dialogue_background"
                                animate={false}
                                data_mode={data_mode}
                            />

                            <span className="dialogue_name">
                                메리
                            </span>

                            <p className="dialogue_text">
                                {story.home.description}
                            </p>
                        </div>
                    </div>

                    <div
                        className="atelier_collection"
                        ref={collection_ref}
                    >
                        <StampCollection
                            collected_stamps={collected_stamps}
                            data_mode={data_mode}
                            disabled={leaving}
                        />
                    </div>

                    <div
                        className="atelier_actions"
                        ref={actions_ref}
                    >
                        <ImageButton
                            data_mode={data_mode}
                            disabled={leaving}
                            onClick={() => {
                                move_page(routes.scanner);
                            }}
                        >
                            <svg
                                className="btn_icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                aria-hidden="true"
                            >
                                <path d="M8 3H3v5" />
                                <path d="M16 3h5v5" />
                                <path d="M3 16v5h5" />
                                <path d="M21 16v5h-5" />
                                <path d="M5 12h14" />
                            </svg>

                            {story.home.scan_button}
                        </ImageButton>

                        <ImageButton
                            variant="secondary"
                            data_mode={data_mode}
                            disabled={!complete || leaving}
                            onClick={() => {
                                move_page(routes.reward);
                            }}
                        >
                            {!complete && (
                                <svg
                                    className="btn_icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="5"
                                        y="10"
                                        width="14"
                                        height="11"
                                        rx="2"
                                    />

                                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                </svg>
                            )}

                            {story.home.reward_button}
                        </ImageButton>
                    </div>
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