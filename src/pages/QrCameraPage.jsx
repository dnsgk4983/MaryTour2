import {
    useEffect,
    useId,
    useRef,
    useState
} from 'react';

import { useNavigate } from 'react-router-dom';

import Screen from '../components/layout/Screen.jsx';
import AssetImage from '../components/common/AssetImage.jsx';
import ImageButton from '../components/common/ImageButton.jsx';

import { story } from '../data/story.js';
import { routes } from '../data/routes.js';

import { get_data_mode } from '../services/data_mode.js';

import {
    create_qr_scanner,
    get_camera_error
} from '../services/qr_scanner.js';

import {
    validate_qr_url
} from '../utils/qr_validator.js';

const scanner_text = {
    title: '단추 찾기',
    subtitle: 'QR SCANNER',
    description: '광고 속 QR 코드를 찾아주세요.',
    idle: '카메라 대기 중',
    starting: '카메라를 준비하고 있어요.',
    scanning: 'QR 코드를 화면 안에 맞춰주세요.',
    success: 'QR 코드를 발견했어요!',
    invalid: '메리투어 전용 QR 코드가 아니에요.',
    start: '카메라 시작하기',
    stop: '카메라 종료하기',
    retry: '다시 시도하기',
    stopping: '카메라를 종료하고 있어요.'
};

export default function QrScannerPage() {
    const navigate = useNavigate();

    const instance_id = useId();

    const scanner_id = (
        `qr_scanner_${instance_id.replace(/[^a-zA-Z0-9_-]/g, '')}`
    );

    const scanner_ref = useRef(null);
    const mounted_ref = useRef(false);
    const locked_ref = useRef(false);
    const busy_ref = useRef(false);
    const invalid_time_ref = useRef(0);

    const [status, set_status] = useState('idle');
    const [message, set_message] = useState('');

    const data_mode = get_data_mode();

    const camera_visible = (
        status === 'scanning' ||
        status === 'success' ||
        status === 'stopping'
    );

    const busy = (
        status === 'starting' ||
        status === 'stopping' ||
        status === 'success'
    );

    useEffect(() => {
        mounted_ref.current = true;

        return () => {
            mounted_ref.current = false;
            locked_ref.current = true;

            scanner_ref.current?.stop().catch((error) => {
                console.error(
                    'Camera cleanup failed:',
                    error
                );
            });
        };
    }, []);

    async function stop_camera() {
        const scanner = scanner_ref.current;

        if (!scanner) {
            return;
        }

        await scanner.stop();

        if (scanner_ref.current === scanner) {
            scanner_ref.current = null;
        }
    }

    async function handle_scan(decoded_text) {
        if (
            !mounted_ref.current ||
            locked_ref.current
        ) {
            return;
        }

        const result = validate_qr_url(
            decoded_text
        );

        if (!result) {
            const now = Date.now();

            if (
                now - invalid_time_ref.current >= 1500
            ) {
                invalid_time_ref.current = now;

                set_message(
                    scanner_text.invalid
                );
            }

            return;
        }

        locked_ref.current = true;
        busy_ref.current = true;

        set_status('success');
        set_message(scanner_text.success);

        try {
            await stop_camera();

            if (mounted_ref.current) {
                navigate(result.route, {
                    replace: true
                });
            }
        } catch (error) {
            if (mounted_ref.current) {
                busy_ref.current = false;

                set_status('error');

                set_message(
                    '카메라 종료에 실패했어요. 다시 시도해주세요.'
                );
            }
        }
    }

    async function start_camera() {
        if (
            busy_ref.current ||
            !mounted_ref.current
        ) {
            return;
        }

        busy_ref.current = true;
        locked_ref.current = true;

        set_status('starting');
        set_message('');

        try {
            await stop_camera();

            if (!mounted_ref.current) {
                return;
            }

            const scanner = create_qr_scanner({
                element_id: scanner_id,
                on_scan: handle_scan
            });

            scanner_ref.current = scanner;

            const started = await scanner.start();

            if (
                !mounted_ref.current ||
                scanner_ref.current !== scanner
            ) {
                await scanner.stop();

                return;
            }

            if (!started) {
                set_status('idle');

                return;
            }

            invalid_time_ref.current = 0;
            locked_ref.current = false;

            set_status('scanning');
        } catch (error) {
            if (mounted_ref.current) {
                set_status('error');

                set_message(
                    get_camera_error(error)
                );
            }
        } finally {
            busy_ref.current = false;
        }
    }

    async function end_camera() {
        if (busy_ref.current) {
            return;
        }

        busy_ref.current = true;
        locked_ref.current = true;

        set_status('stopping');
        set_message('');

        try {
            await stop_camera();

            if (mounted_ref.current) {
                set_status('idle');
            }
        } catch {
            if (mounted_ref.current) {
                set_status('error');

                set_message(
                    '카메라를 종료하지 못했어요. 다시 시도해주세요.'
                );
            }
        } finally {
            busy_ref.current = false;
        }
    }

    async function go_back() {
        if (busy_ref.current) {
            return;
        }

        busy_ref.current = true;
        locked_ref.current = true;

        set_status('stopping');

        try {
            await stop_camera();

            if (mounted_ref.current) {
                navigate(routes.home);
            }
        } catch {
            if (mounted_ref.current) {
                set_status('error');

                set_message(
                    '카메라를 종료하지 못했어요. 다시 시도해주세요.'
                );
            }

            busy_ref.current = false;
        }
    }

    const frame_classes = [
        'scanner_frame',
        camera_visible
            ? 'scanner_frame_active'
            : '',
        status === 'success'
            ? 'scanner_frame_success'
            : '',
        data_mode === 'low'
            ? 'motion_disabled'
            : 'motion_enabled'
    ].filter(Boolean).join(' ');

    return (
        <Screen class_name="scanner">
            <div className="scanner_scene">
                <AssetImage
                    name="atelier_background_00.webp"
                    class_name="scanner_background"
                    alt=""
                    animate={false}
                    data_mode={data_mode}
                />

                <div
                    className="scanner_overlay"
                    aria-hidden="true"
                />

                <header className="scanner_heading">
                    <button
                        type="button"
                        className="btn_icon_round"
                        aria-label="인형공방으로 돌아가기"
                        disabled={busy}
                        onClick={go_back}
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

                    <p className="scene_subtitle">
                        {story.subtitle}
                    </p>

                    <h1 className="scene_title">
                        {scanner_text.title}
                    </h1>
                </header>

                <div className="scanner_content">
                    <section className="ornament_panel">
                        <AssetImage
                            name="ui_ribbon.webp"
                            class_name="ornament_ribbon"
                            alt=""
                            animate={false}
                            data_mode={data_mode}
                        />

                        <header className="ornament_heading">
                            <p className="ornament_subtitle">
                                {scanner_text.subtitle}
                            </p>

                            <h2 className="ornament_title">
                                {scanner_text.description}
                            </h2>
                        </header>

                        <div className={frame_classes}>
                            <div
                                id={scanner_id}
                                className="scanner_camera"
                            />

                            {!camera_visible && (
                                <div className="scanner_placeholder">
                                    <svg
                                        viewBox="0 0 48 48"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="7"
                                            y="15"
                                            width="34"
                                            height="25"
                                            rx="5"
                                        />

                                        <path d="M15 15l4-6h10l4 6" />

                                        <circle
                                            cx="24"
                                            cy="27"
                                            r="8"
                                        />
                                    </svg>

                                    <p>
                                        {status === 'starting'
                                            ? scanner_text.starting
                                            : scanner_text.idle}
                                    </p>
                                </div>
                            )}

                            <div
                                className="scanner_guide"
                                aria-hidden="true"
                            >
                                <span className="scanner_corner scanner_corner_tl" />
                                <span className="scanner_corner scanner_corner_tr" />
                                <span className="scanner_corner scanner_corner_bl" />
                                <span className="scanner_corner scanner_corner_br" />

                                {status === 'scanning' && (
                                    <span className="scanner_line" />
                                )}

                                {status === 'success' && (
                                    <span className="scanner_success">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M5 12l4 4L19 6" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        </div>

                        <div
                            className={
                                status === 'error'
                                    ? 'scanner_message scanner_message_error'
                                    : 'scanner_message'
                            }
                            role="status"
                            aria-live="polite"
                        >
                            {message || (
                                status === 'stopping'
                                    ? scanner_text.stopping
                                    : scanner_text.scanning
                            )}
                        </div>

                        <div className="scanner_actions">
                            {status === 'scanning' ? (
                                <ImageButton
                                    variant="secondary"
                                    data_mode={data_mode}
                                    onClick={end_camera}
                                >
                                    {scanner_text.stop}
                                </ImageButton>
                            ) : (
                                <ImageButton
                                    data_mode={data_mode}
                                    disabled={busy}
                                    onClick={start_camera}
                                >
                                    {status === 'error'
                                        ? scanner_text.retry
                                        : status === 'starting'
                                            ? '카메라 준비 중'
                                            : status === 'success'
                                                ? '인증 화면으로 이동 중'
                                                : scanner_text.start}
                                </ImageButton>
                            )}
                        </div>
                    </section>

                    <footer className="scanner_footer">
                        <p>
                            부평구청역 · 대림역 · 구로디지털단지역
                        </p>

                        <div
                            className="scanner_footer_line"
                            aria-hidden="true"
                        />
                    </footer>
                </div>
            </div>
        </Screen>
    );
}