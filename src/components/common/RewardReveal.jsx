import {
    useLayoutEffect,
    useRef,
    useState
} from 'react';

import gsap from 'gsap';

import {
    reward_story
} from '../../data/reward_story.js';

const image_files = import.meta.glob(
    '/src/assets/images/**/*.{webp,png}',
    {
        eager: true,
        query: '?url',
        import: 'default'
    }
);

function find_image(names, data_mode) {
    const suffixes = data_mode === 'low'
        ? ['_low.webp', '.webp', '.png']
        : ['.webp', '.png'];

    for (const name of names) {
        for (const suffix of suffixes) {
            const entry = Object.entries(image_files).find(
                ([path]) => path.endsWith(
                    `/${name}${suffix}`
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
            'reward_background',
            'complete_background',
            'atelier_background_03',
            'atelier_background_00'
        ], data_mode),

        envelope: find_image([
            'reward_envelope',
            'reward_envelope_sealed',
            'envelope_closed'
        ], data_mode),

        opened_envelope: find_image([
            'reward_envelope_opened',
            'reward_envelope_open',
            'envelope_opened'
        ], data_mode),

        card: find_image([
            'reward_card',
            'reward_ticket',
            'reward_invitation'
        ], data_mode),

        ribbon: find_image([
            'ui_ribbon',
            'ribbon_decoration'
        ], data_mode),

        frame: find_image([
            'ui_modal_frame',
            'check_frame'
        ], data_mode)
    };
}

const sparkle_list = [
    [-340, -210, 22],
    [330, -240, 16],
    [-210, -320, 12],
    [190, -340, 18],
    [-380, 20, 16],
    [370, 30, 22],
    [-250, 220, 14],
    [260, 230, 18]
];

export default function RewardReveal({
    data_mode = 'normal',
    preview = false,
    eligible = false,
    on_home
}) {
    const scene_ref = useRef(null);
    const timeline_ref = useRef(null);
    const opening_ref = useRef(false);

    const [phase, set_phase] = useState('sealed');

    const images = get_images(data_mode);

    const use_motion = (
        data_mode !== 'low' &&
        !window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
    );

    const can_open = preview || eligible;
    const opened = phase === 'opened';

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

            timeline.from('.reward_heading', {
                opacity: 0,
                y: 18,
                duration: 0.65
            });

            timeline.from('.reward_envelope_button', {
                opacity: 0,
                scale: 0.88,
                y: 24,
                duration: 0.8
            }, '-=0.35');

            timeline.from('.reward_panel', {
                opacity: 0,
                y: 18,
                duration: 0.6
            }, '-=0.35');
        }, scene_ref);

        return () => {
            context.revert();
        };
    }, [use_motion]);

    useLayoutEffect(() => {
        if (phase !== 'opening') {
            return;
        }

        if (!use_motion) {
            set_phase('opened');

            return;
        }

        const context = gsap.context(() => {
            const timeline = gsap.timeline({
                defaults: {
                    ease: 'power2.out'
                },
                onComplete: () => {
                    set_phase('opened');
                }
            });

            timeline_ref.current = timeline;

            timeline.to('.reward_envelope_button', {
                rotation: -3,
                duration: 0.1,
                repeat: 3,
                yoyo: true
            });

            timeline.to('.reward_envelope_button', {
                rotation: 0,
                scale: 0.96,
                duration: 0.25
            });

            timeline.fromTo(
                '.reward_glow',
                {
                    opacity: 0,
                    scale: 0.4
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.9
                }
            );

            timeline.to('.reward_sealed_layer', {
                opacity: 0,
                y: 12,
                duration: 0.4
            }, '-=0.6');

            timeline.to('.reward_opened_layer', {
                opacity: 1,
                duration: 0.4
            }, '<');

            timeline.to('.reward_envelope_button', {
                y: 24,
                scale: 0.85,
                duration: 0.6
            }, '<');

            timeline.fromTo(
                '.reward_card',
                {
                    opacity: 0,
                    scale: 1,
                    y: 24,
                    rotation: 0
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotation: 0,
                    duration: 1.2,
                    ease: 'power2.out'
                },
                '-=0.35'
            );

            timeline.fromTo(
                '.reward_sparkle',
                {
                    opacity: 0,
                    scale: 0
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.07
                },
                '-=0.45'
            );
        }, scene_ref);

        return () => {
            timeline_ref.current?.kill();

            context.revert();
        };
    }, [phase, use_motion]);

    useLayoutEffect(() => {
        if (
            phase !== 'opened' ||
            !use_motion
        ) {
            return;
        }

        const context = gsap.context(() => {
            gsap.from('.reward_waiting', {
                opacity: 0,
                y: 10,
                duration: 0.5,
                ease: 'power2.out'
            });

            gsap.to('.reward_card', {
                y: -3,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            gsap.to('.reward_sparkle', {
                opacity: 0.25,
                scale: 0.65,
                duration: 1.6,
                stagger: 0.12,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }, scene_ref);

        return () => {
            context.revert();
        };
    }, [phase, use_motion]);

    function open_envelope() {
        if (
            !can_open ||
            opening_ref.current
        ) {
            return;
        }

        opening_ref.current = true;

        set_phase(
            use_motion
                ? 'opening'
                : 'opened'
        );
    }

    const classes = [
        'reward_scene',
        `reward_${phase}`,
        use_motion
            ? 'motion_enabled'
            : 'motion_disabled'
    ].join(' ');

    return (
        <section
            className={classes}
            ref={scene_ref}
            aria-label="특전 확인"
        >
            {images.background && (
                <img
                    className="reward_background"
                    src={images.background}
                    alt=""
                    draggable="false"
                />
            )}

            <div
                className="reward_shade"
                aria-hidden="true"
            />

            <div
                className="reward_border"
                aria-hidden="true"
            />

            <header className="reward_heading">
                {images.ribbon && (
                    <img
                        className="reward_ribbon"
                        src={images.ribbon}
                        alt=""
                        draggable="false"
                    />
                )}

                <p className="reward_eyebrow">
                    {reward_story.eyebrow}
                </p>

                <h1>
                    {opened
                        ? reward_story.opened_title
                        : reward_story.title}
                </h1>

                <p className="reward_subtitle">
                    {reward_story.subtitle}
                </p>
            </header>

            <div className="reward_stage">
                <div
                    className="reward_glow"
                    aria-hidden="true"
                />

                <button
                    type="button"
                    className="reward_envelope_button"
                    disabled={
                        !can_open ||
                        phase !== 'sealed'
                    }
                    aria-label="선물 봉투 열기"
                    onClick={open_envelope}
                >
                    <span className="reward_sealed_layer">
                        {images.envelope ? (
                            <img
                                src={images.envelope}
                                alt=""
                                draggable="false"
                            />
                        ) : (
                            <span className="reward_envelope_fallback">
                                <i className="reward_seal" />
                            </span>
                        )}
                    </span>

                    <span className="reward_opened_layer">
                        {images.opened_envelope ? (
                            <img
                                src={images.opened_envelope}
                                alt=""
                                draggable="false"
                            />
                        ) : (
                            <span className="reward_envelope_fallback reward_envelope_fallback_open">
                                <i />
                            </span>
                        )}
                    </span>
                </button>

                <div
                    className="reward_card"
                    aria-hidden={!opened}
                >
                    {images.card && (
                        <img
                            className="reward_card_artwork"
                            src={images.card}
                            alt=""
                            draggable="false"
                        />
                    )}

                    <div className="reward_card_content">
                        <p className="reward_card_eyebrow">
                            {reward_story.card_eyebrow}
                        </p>

                        <div className="reward_card_divider">
                            <span />
                            <i />
                            <span />
                        </div>

                        <h2 className="reward_card_title">
                            {reward_story.card_title}
                        </h2>

                        <p className="reward_card_subtitle">
                            {reward_story.card_subtitle}
                        </p>

                        <p className="reward_card_message">
                            {reward_story.card_message}
                        </p>

                        <div className="reward_card_collection">
                            <strong>
                                {reward_story.card_count}
                            </strong>

                            <span>
                                {reward_story.card_complete}
                            </span>
                        </div>

                        <p className="reward_card_signature">
                            {reward_story.card_footer}
                        </p>
                    </div>
                </div>

                {use_motion && sparkle_list.map(
                    ([x, y, size], index) => (
                        <span
                            className="reward_sparkle"
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

            <footer
                className="reward_panel"
                aria-live="polite"
            >
                {images.frame && (
                    <img
                        className="reward_frame"
                        src={images.frame}
                        alt=""
                        draggable="false"
                    />
                )}

                {!can_open ? (
                    <>
                        <strong className="reward_status_title">
                            단추 수집이 필요해요.
                        </strong>

                        <p className="reward_message">
                            세 개의 단추를 모두 찾아주세요.
                        </p>
                    </>
                ) : opened ? (
                    <div className="reward_waiting">
                        <p className="reward_message">
                            {reward_story.opened_message}
                        </p>

                        <div className="reward_status">
                            <span
                                className="reward_status_icon"
                                aria-hidden="true"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    />

                                    <path d="M12 7v5l3 2" />
                                </svg>
                            </span>

                            <strong className="reward_status_title">
                                {reward_story.waiting_title}
                            </strong>

                            <small>
                                {reward_story.waiting_message}
                            </small>
                        </div>

                        <p className="reward_notice">
                            ※ 실제 특전 수령은 현장 확인 후 진행됩니다.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="reward_message">
                            {phase === 'opening'
                                ? reward_story.opening_message
                                : reward_story.sealed_message}
                        </p>

                        <button
                            type="button"
                            className="reward_action reward_primary"
                            disabled={phase !== 'sealed'}
                            onClick={open_envelope}
                        >
                            {reward_story.open_button}
                        </button>
                    </>
                )}

                <button
                    type="button"
                    className={
                        opened || !can_open
                            ? 'reward_action reward_primary'
                            : 'reward_action reward_secondary'
                    }
                    disabled={phase === 'opening'}
                    onClick={on_home}
                >
                    {preview
                        ? '미리보기 종료'
                        : reward_story.home_button}
                </button>

                {preview && (
                    <small className="reward_preview_label">
                        DEVELOPMENT PREVIEW
                    </small>
                )}
            </footer>
        </section>
    );
}