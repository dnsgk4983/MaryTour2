import {
    useLayoutEffect,
    useRef
} from 'react';

import gsap from 'gsap';

import {
    ending_story
} from '../../data/ending_story.js';

const image_files = import.meta.glob(
    '/src/assets/images/**/*.{webp,png}',
    {
        eager: true,
        query: '?url',
        import: 'default'
    }
);

function find_image(names, data_mode) {
    const extensions = data_mode === 'low'
        ? ['_low.webp', '.webp', '.png']
        : ['.webp', '.png'];

    for (const name of names) {
        for (const extension of extensions) {
            const entry = Object.entries(image_files).find(
                ([path]) => path.endsWith(
                    `/${name}${extension}`
                )
            );

            if (entry) {
                return entry[1];
            }
        }
    }

    return null;
}

function get_images(data_mode) {
    return {
        background: find_image([
            'ending_background',
            'complete_background',
            'reward_background',
            'atelier_background_03',
            'atelier_background_00'
        ], data_mode),

        mary: find_image([
            'ending_mary',
            'complete_mary',
            'atelier_mary',
            'splash_mary'
        ], data_mode),

        ribbon: find_image([
            'ui_ribbon',
            'ribbon_decoration'
        ], data_mode),

        buttons: [
            find_image(['button_01'], data_mode),
            find_image(['button_02'], data_mode),
            find_image(['button_03'], data_mode)
        ]
    };
}

const sparkle_list = [
    [-360, -240, 16],
    [340, -220, 20],
    [-210, -320, 12],
    [200, -340, 18],
    [-380, 20, 22],
    [370, 40, 14],
    [-290, 210, 16],
    [280, 230, 20],
    [-130, 280, 12],
    [140, 300, 16]
];

export default function JourneyEnding({
    data_mode = 'normal',
    preview = false,
    on_home
}) {
    const scene_ref = useRef(null);

    const images = get_images(data_mode);

    const use_motion = (
        data_mode !== 'low' &&
        !window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
    );

    useLayoutEffect(() => {
        if (!use_motion) {
            return;
        }

        const context = gsap.context(() => {
            const timeline = gsap.timeline({
                defaults: {
                    ease: 'power2.out'
                }
            });

            timeline.from('.ending_background', {
                opacity: 0.45,
                duration: 1.1
            });

            timeline.from('.ending_heading', {
                opacity: 0,
                y: 12,
                duration: 0.7
            }, '-=0.7');

            timeline.from('.ending_glow', {
                opacity: 0,
                duration: 1.2
            }, '-=0.4');

            timeline.from('.ending_mary', {
                opacity: 0,
                y: 18,
                duration: 1.1
            }, '-=0.8');

            timeline.from('.ending_stamp', {
                opacity: 0,
                y: 10,
                duration: 0.6,
                stagger: 0.18
            }, '-=0.5');

            timeline.from('.ending_panel', {
                opacity: 0,
                duration: 0.65
            }, '-=0.2');

            timeline.from('.ending_message_line', {
                opacity: 0,
                y: 4,
                duration: 0.45,
                stagger: 0.18
            }, '-=0.2');

            timeline.from('.ending_signature', {
                opacity: 0,
                duration: 0.5
            });

            timeline.from('.ending_action', {
                opacity: 0,
                duration: 0.5
            }, '-=0.25');

            timeline.from('.ending_sparkle', {
                opacity: 0,
                duration: 0.5,
                stagger: 0.06
            }, '-=0.6');

            gsap.to('.ending_sparkle', {
                opacity: 0.25,
                duration: 1.8,
                stagger: 0.14,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: timeline.duration()
            });
        }, scene_ref);

        return () => {
            context.revert();
        };
    }, [use_motion]);

    return (
        <section
            className="ending_scene"
            ref={scene_ref}
            aria-label="여정 종료"
        >
            {images.background && (
                <img
                    className="ending_background"
                    src={images.background}
                    alt=""
                    draggable="false"
                />
            )}

            <div
                className="ending_shade"
                aria-hidden="true"
            />

            <div
                className="ending_border"
                aria-hidden="true"
            />

            <header className="ending_heading">
                {images.ribbon && (
                    <img
                        className="ending_ribbon"
                        src={images.ribbon}
                        alt=""
                        draggable="false"
                    />
                )}

                <p className="ending_eyebrow">
                    {ending_story.eyebrow}
                </p>

                <h1>
                    {ending_story.title}
                </h1>

                <p className="ending_subtitle">
                    {ending_story.subtitle}
                </p>
            </header>

            <div className="ending_stage">
                <div
                    className="ending_glow"
                    aria-hidden="true"
                />

                {images.mary && (
                    <img
                        className="ending_mary"
                        src={images.mary}
                        alt="감사 인사를 전하는 메리"
                        draggable="false"
                    />
                )}

                <div
                    className="ending_collection"
                    aria-label={ending_story.collection_title}
                >
                    {images.buttons.map((image, index) => (
                        <span
                            className="ending_stamp"
                            key={index}
                        >
                            {image ? (
                                <img
                                    src={image}
                                    alt={`${index + 1}번째 단추`}
                                    draggable="false"
                                />
                            ) : (
                                <span
                                    className="ending_stamp_fallback"
                                    aria-label={`${index + 1}번째 단추`}
                                >
                                    ✦
                                </span>
                            )}
                        </span>
                    ))}
                </div>

                {use_motion && sparkle_list.map(
                    ([x, y, size], index) => (
                        <span
                            className="ending_sparkle"
                            key={index}
                            style={{
                                '--sparkle_x': x,
                                '--sparkle_y': y,
                                '--sparkle_size': size
                            }}
                            aria-hidden="true"
                        />
                    )
                )}
            </div>

            <footer className="ending_panel">
                <div className="ending_status">
                    <span
                        className="ending_status_icon"
                        aria-hidden="true"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />

                            <path d="M7.5 12l3 3 6-6" />
                        </svg>
                    </span>

                    <span>
                        {preview
                            ? ending_story.preview_title
                            : '여정 종료'}
                    </span>
                </div>

                <h2 className="ending_message_title">
                    {ending_story.message_title}
                </h2>

                <div
                    className="ending_divider"
                    aria-hidden="true"
                >
                    <span />
                    <i />
                    <span />
                </div>

                <div className="ending_message">
                    {ending_story.message_lines.map(
                        (line, index) => (
                            <p
                                className="ending_message_line"
                                key={index}
                            >
                                {line}
                            </p>
                        )
                    )}
                </div>

                <p className="ending_signature">
                    {ending_story.signature}
                </p>

                <button
                    type="button"
                    className="ending_action"
                    onClick={on_home}
                >
                    {preview
                        ? ending_story.preview_button
                        : ending_story.home_button}
                </button>

                {preview && (
                    <small className="ending_preview_label">
                        DEVELOPMENT PREVIEW
                    </small>
                )}
            </footer>
        </section>
    );
}