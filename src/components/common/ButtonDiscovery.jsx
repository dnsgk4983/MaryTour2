import {
    useLayoutEffect,
    useRef,
    useState
} from 'react';

import gsap from 'gsap';

import AssetImage from './AssetImage.jsx';

const image_files = import.meta.glob(
    '/src/assets/images/**/*.{webp,png}',
    {
        eager: true,
        query: '?url',
        import: 'default'
    }
);

function find_image(names) {
    for (const name of names) {
        for (const extension of ['webp', 'png']) {
            const entry = Object.entries(image_files).find(
                ([path]) => path.endsWith(
                    `/${name}.${extension}`
                )
            );

            if (entry) {
                return entry[1];
            }
        }
    }

    return null;
}

const scene_images = {
    background: find_image([
        'check_background',
        'atelier_background_00',
        'atelier_background'
    ]),
    sealed: find_image([
        'check_sealed_box',
        'sealed_box'
    ]),
    opened: find_image([
        'check_opened_box',
        'opened_box'
    ])
};

const sparkle_list = [
    [-120, -160, 18],
    [110, -180, 14],
    [-180, -50, 12],
    [170, -65, 20],
    [-95, 100, 16],
    [125, 90, 12],
    [0, -230, 20],
    [200, 20, 14]
];

export default function ButtonDiscovery({
    reward,
    collected_count = 0,
    total_count = 3,
    data_mode = 'normal',
    preview = false,
    on_complete
}) {
    const scene_ref = useRef(null);
    const timeline_ref = useRef(null);
    const opened_ref = useRef(false);

    const [phase, set_phase] = useState('sealed');

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
            gsap.from('.discovery_heading', {
                opacity: 0,
                y: 14,
                duration: 0.6,
                ease: 'power2.out'
            });

            gsap.from('.discovery_box', {
                opacity: 0,
                scale: 0.9,
                y: 20,
                duration: 0.8,
                ease: 'power2.out'
            });

            gsap.from('.discovery_footer', {
                opacity: 0,
                y: 10,
                delay: 0.4,
                duration: 0.5
            });
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
            set_phase('complete');

            return;
        }

        const context = gsap.context(() => {
            const timeline = gsap.timeline({
                onComplete: () => {
                    set_phase('complete');
                }
            });

            timeline_ref.current = timeline;

            timeline.to('.discovery_box', {
                rotation: -4,
                duration: 0.09,
                repeat: 5,
                yoyo: true
            });

            timeline.to('.discovery_box', {
                rotation: 0,
                scale: 0.92,
                duration: 0.2
            });

            timeline.fromTo(
                '.discovery_flash',
                {
                    opacity: 0
                },
                {
                    opacity: 0.95,
                    duration: 0.25
                }
            );

            timeline.set('.discovery_sealed', {
                opacity: 0
            });

            timeline.set('.discovery_opened', {
                opacity: 1
            });

            timeline.fromTo(
                '.discovery_glow',
                {
                    opacity: 0,
                    scale: 0.3
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power2.out'
                },
                '<'
            );

            timeline.to('.discovery_flash', {
                opacity: 0,
                duration: 0.55
            }, '<');

            timeline.fromTo(
                '.discovery_item',
                {
                    opacity: 0,
                    scale: 0.3,
                    y: 40,
                    rotation: -25
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotation: 0,
                    duration: 0.9,
                    ease: 'back.out(1.4)'
                },
                '-=0.3'
            );

            timeline.fromTo(
                '.discovery_sparkle',
                {
                    opacity: 0,
                    scale: 0
                },
                {
                    opacity: 1,
                    scale: 1,
                    stagger: 0.06,
                    duration: 0.4,
                    ease: 'power2.out'
                },
                '<'
            );
        }, scene_ref);

        return () => {
            timeline_ref.current?.kill();

            context.revert();
        };
    }, [phase, use_motion]);

    useLayoutEffect(() => {
        if (
            phase !== 'complete' ||
            !use_motion
        ) {
            return;
        }

        const context = gsap.context(() => {
            gsap.from('.discovery_result', {
                opacity: 0,
                y: 12,
                duration: 0.55,
                ease: 'power2.out'
            });

            gsap.to('.discovery_item', {
                y: -6,
                duration: 2.4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            gsap.to('.discovery_sparkle', {
                opacity: 0.3,
                scale: 0.65,
                duration: 1.5,
                stagger: 0.12,
                repeat: -1,
                yoyo: true
            });
        }, scene_ref);

        return () => {
            context.revert();
        };
    }, [phase, use_motion]);

    function open_box() {
        if (opened_ref.current) {
            return;
        }

        opened_ref.current = true;

        set_phase(
            use_motion
                ? 'opening'
                : 'complete'
        );
    }

    const complete = phase === 'complete';

    const classes = [
        'discovery_scene',
        `discovery_${phase}`,
        use_motion
            ? 'motion_enabled'
            : 'motion_disabled'
    ].join(' ');

    return (
        <section
            className={classes}
            ref={scene_ref}
            aria-label="단추 획득"
        >
            {scene_images.background && (
                <img
                    src={scene_images.background}
                    className="discovery_background"
                    alt=""
                    draggable="false"
                />
            )}

            <div
                className="discovery_shade"
                aria-hidden="true"
            />

            <header className="discovery_heading">
                <p className="discovery_eyebrow">
                    {complete
                        ? 'BUTTON FOUND'
                        : 'A HIDDEN TREASURE'}
                </p>

                <h1>
                    {complete
                        ? '단추를 찾았어요!'
                        : '작은 상자를 발견했어요'}
                </h1>

                <p className="discovery_location">
                    {reward.name}
                </p>
            </header>

            <div className="discovery_stage">
                <div
                    className="discovery_glow"
                    aria-hidden="true"
                />

                {use_motion && sparkle_list.map(
                    ([x, y, size], index) => (
                        <span
                            className="discovery_sparkle"
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

                <div className="discovery_item">
                    <AssetImage
                        name={reward.image}
                        class_name="discovery_item_image"
                        alt="발견한 단추"
                        animate={false}
                        data_mode={data_mode}
                    />
                </div>

                <button
                    type="button"
                    className="discovery_box"
                    disabled={phase !== 'sealed'}
                    onClick={open_box}
                    aria-label="봉인된 상자 열기"
                >
                    <span className="discovery_sealed">
                        {scene_images.sealed ? (
                            <img
                                src={scene_images.sealed}
                                alt=""
                                draggable="false"
                            />
                        ) : (
                            <span className="discovery_box_fallback">
                                <i />
                            </span>
                        )}
                    </span>

                    <span className="discovery_opened">
                        {scene_images.opened ? (
                            <img
                                src={scene_images.opened}
                                alt=""
                                draggable="false"
                            />
                        ) : (
                            <span className="discovery_box_fallback discovery_box_fallback_open">
                                <i />
                            </span>
                        )}
                    </span>
                </button>
            </div>

            <footer
                className="discovery_footer"
                aria-live="polite"
            >
                {complete ? (
                    <div className="discovery_result">
                        <p className="discovery_result_text">
                            잃어버린 단추 하나를 발견했어요.
                        </p>

                        <div className="discovery_count">
                            <strong>
                                {collected_count}
                            </strong>

                            <span>
                                / {total_count}
                            </span>
                        </div>

                        <div className="collection_progress_track">
                            {Array.from(
                                {
                                    length: total_count
                                },
                                (_, index) => (
                                    <span
                                        className={
                                            index < collected_count
                                                ? 'collection_progress_segment collected'
                                                : 'collection_progress_segment'
                                        }
                                        key={index}
                                    />
                                )
                            )}
                        </div>

                        <button
                            type="button"
                            className="discovery_action"
                            onClick={on_complete}
                        >
                            {preview
                                ? '미리보기 종료'
                                : '인형공방으로 돌아가기'}
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="discovery_hint">
                            {phase === 'sealed'
                                ? '상자를 터치해 열어보세요.'
                                : '상자가 열리고 있어요...'}
                        </p>

                        <button
                            type="button"
                            className="discovery_action"
                            disabled={phase !== 'sealed'}
                            onClick={open_box}
                        >
                            상자 열기
                        </button>
                    </>
                )}

                {preview && (
                    <small className="discovery_preview_label">
                        DEVELOPMENT PREVIEW
                    </small>
                )}
            </footer>

            <div
                className="discovery_flash"
                aria-hidden="true"
            />
        </section>
    );
}