import {
    useLayoutEffect,
    useRef
} from 'react';

import gsap from 'gsap';

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

const images = {
    background: find_image([
        'complete_background',
        'atelier_background_03',
        'atelier_background_00',
        'atelier_background'
    ]),
    mary: find_image([
        'complete_mary',
        'atelier_mary',
        'splash_mary'
    ]),
    ribbon: find_image([
        'ui_ribbon',
        'ribbon_decoration'
    ]),
    frame: find_image([
        'ui_modal_frame',
        'check_frame'
    ]),
    buttons: [
        find_image(['button_01', 'golden_button']),
        find_image(['button_02', 'golden_button']),
        find_image(['button_03', 'golden_button'])
    ]
};

const sparkle_list = [
    [-380, -280, 18],
    [340, -250, 22],
    [-220, -340, 12],
    [180, -360, 16],
    [-420, -30, 20],
    [400, 20, 14],
    [-310, 210, 16],
    [290, 230, 22],
    [-120, 300, 12],
    [140, 320, 18]
];

export default function JourneyComplete({
    data_mode = 'normal',
    preview = false,
    on_reward,
    on_home
}) {
    const scene_ref = useRef(null);

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

            timeline.from('.journey_complete_heading', {
                opacity: 0,
                y: 18,
                duration: 0.7
            });

            timeline.from('.journey_complete_mary', {
                opacity: 0,
                y: 24,
                duration: 0.9
            }, '-=0.4');

            timeline.from('.journey_complete_glow', {
                opacity: 0,
                scale: 0.4,
                duration: 1.1
            }, '-=0.6');

            timeline.from('.journey_complete_button', {
                opacity: 0,
                scale: 0.4,
                rotation: -20,
                y: 30,
                duration: 0.65,
                stagger: 0.22,
                ease: 'back.out(1.4)'
            }, '-=0.6');

            timeline.from('.journey_complete_sparkle', {
                opacity: 0,
                scale: 0,
                stagger: 0.06,
                duration: 0.4
            }, '-=0.3');

            timeline.from('.journey_complete_panel', {
                opacity: 0,
                y: 22,
                duration: 0.7
            }, '-=0.2');

            timeline.from('.journey_complete_action', {
                opacity: 0,
                y: 8,
                stagger: 0.1,
                duration: 0.35
            }, '-=0.3');

            timeline.call(() => {
                gsap.to('.journey_complete_button', {
                    y: -6,
                    duration: 2.2,
                    stagger: 0.3,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });

                gsap.to('.journey_complete_sparkle', {
                    opacity: 0.25,
                    scale: 0.65,
                    duration: 1.5,
                    stagger: 0.13,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            });
        }, scene_ref);

        return () => {
            context.revert();
        };
    }, [use_motion]);

    return (
        <section
            className="journey_complete"
            ref={scene_ref}
            aria-label="전체 단추 수집 완료"
        >
            {images.background && (
                <img
                    className="journey_complete_background"
                    src={images.background}
                    alt=""
                    draggable="false"
                />
            )}

            <div
                className="journey_complete_shade"
                aria-hidden="true"
            />

            <div
                className="journey_complete_border"
                aria-hidden="true"
            />

            <header className="journey_complete_heading">
                {images.ribbon && (
                    <img
                        className="journey_complete_ribbon"
                        src={images.ribbon}
                        alt=""
                        draggable="false"
                    />
                )}

                <p className="journey_complete_eyebrow">
                    JOURNEY COMPLETE
                </p>

                <h1>
                    모든 단추를 찾았어요!
                </h1>

                <p className="journey_complete_subtitle">
                    메리의 잃어버린 단추
                </p>
            </header>

            <div className="journey_complete_stage">
                <div
                    className="journey_complete_glow"
                    aria-hidden="true"
                />

                {images.mary && (
                    <img
                        className="journey_complete_mary"
                        src={images.mary}
                        alt=""
                        draggable="false"
                    />
                )}

                <div className="journey_complete_buttons">
                    {images.buttons.map((image, index) => (
                        <div
                            className="journey_complete_button_slot"
                            key={index}
                        >
                            <div className="journey_complete_button">
                                {image ? (
                                    <img
                                        src={image}
                                        alt={`${index + 1}번째 단추`}
                                        draggable="false"
                                    />
                                ) : (
                                    <span
                                        className="journey_complete_button_fallback"
                                        role="img"
                                        aria-label={`${index + 1}번째 단추`}
                                    >
                                        <i />
                                        <i />
                                        <i />
                                        <i />
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {use_motion && sparkle_list.map(
                    ([x, y, size], index) => (
                        <span
                            className="journey_complete_sparkle"
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

            <footer className="journey_complete_panel">
                {images.frame && (
                    <img
                        className="journey_complete_frame"
                        src={images.frame}
                        alt=""
                        draggable="false"
                    />
                )}

                <div className="journey_complete_summary">
                    <p>
                        단추 수집 완료
                    </p>

                    <div className="journey_complete_count">
                        <strong>3</strong>
                        <span>/ 3</span>
                    </div>

                    <div
                        className="journey_complete_progress"
                        role="progressbar"
                        aria-label="단추 수집 현황"
                        aria-valuemin={0}
                        aria-valuemax={3}
                        aria-valuenow={3}
                    >
                        <span />
                        <span />
                        <span />
                    </div>
                </div>

                <p className="journey_complete_message">
                    잃어버린 단추를 모두 찾아주셔서 감사해요.
                </p>

                <div className="journey_complete_actions">
                    <button
                        type="button"
                        className="journey_complete_action journey_complete_primary"
                        onClick={on_reward}
                    >
                        특전 확인하기
                    </button>

                    <button
                        type="button"
                        className="journey_complete_action journey_complete_secondary"
                        onClick={on_home}
                    >
                        {preview
                            ? '미리보기 종료'
                            : '인형공방으로 돌아가기'}
                    </button>
                </div>

                {preview && (
                    <small className="journey_complete_preview">
                        DEVELOPMENT PREVIEW
                    </small>
                )}
            </footer>
        </section>
    );
}