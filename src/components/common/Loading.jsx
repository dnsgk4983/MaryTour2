import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import Button from './Button.jsx';

import { get_mode_asset } from '../../data/assets.js';

gsap.registerPlugin(useGSAP);

export default function Loading({
    progress = 0,
    status = 'loading',
    data_mode = 'normal',
    on_retry,
    on_skip
}) {
    const loading_ref = useRef(null);
    const button_ref = useRef(null);
    const thread_ref = useRef(null);

    const is_error = status === 'error';

    const background = get_mode_asset(
        'loading_background.webp',
        'low'
    );

    const button = get_mode_asset(
        'loading_button.webp',
        'low'
    );

    const thread = get_mode_asset(
        'loading_thread.webp',
        'low'
    );

    useGSAP(() => {
        const reduced_motion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (
            reduced_motion ||
            data_mode === 'low' ||
            is_error
        ) {
            return;
        }

        if (button_ref.current) {
            gsap.to(button_ref.current, {
                rotation: 360,
                duration: 9,
                ease: 'none',
                repeat: -1
            });
        }

        if (thread_ref.current) {
            gsap.to(thread_ref.current, {
                yPercent: -4,
                rotation: 2,
                duration: 2.4,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        }
    }, {
        scope: loading_ref,
        dependencies: [data_mode, is_error],
        revertOnUpdate: true
    });

    return (
        <section
            className="loading"
            ref={loading_ref}
            aria-busy={!is_error}
        >
            {background && (
                <img
                    className="loading_background"
                    src={background}
                    fetchPriority="high"
                    alt=""
                    aria-hidden="true"
                />
            )}

            <div className="loading_content">
                <div
                    className="loading_object"
                    aria-hidden="true"
                >
                    {thread && (
                        <img
                            className="loading_thread"
                            ref={thread_ref}
                            src={thread}
                            decoding="async"
                            fetchPriority="low"
                            alt=""
                        />
                    )}

                    {button && (
                        <img
                            className="loading_button"
                            ref={button_ref}
                            src={button}
                            decoding="async"
                            alt=""
                        />
                    )}
                </div>

                <div
                    className="loading_status"
                    role="status"
                >
                    <p className="loading_text">
                        {is_error
                            ? '일부 리소스를 불러오지 못했습니다.'
                            : '화면 로드 중'}
                    </p>

                    <progress
                        className="loading_progress"
                        value={progress}
                        max={100}
                        aria-label="리소스 로딩 진행률"
                    />

                    <span className="loading_value">
                        {progress}%
                    </span>
                </div>

                {is_error && (
                    <div className="loading_actions">
                        <Button onClick={on_retry}>
                            다시 시도
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={on_skip}
                        >
                            이미지 없이 계속하기
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}