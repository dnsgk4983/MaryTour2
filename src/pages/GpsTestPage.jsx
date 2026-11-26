import JourneyComplete from '../components/common/JourneyComplete.jsx';
import ButtonDiscovery from '../components/common/ButtonDiscovery.jsx';
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import gsap from 'gsap';

import Screen from '../components/layout/Screen.jsx';
import AssetImage from '../components/common/AssetImage.jsx';

import {
    story
} from '../data/story.js';

import {
    routes
} from '../data/routes.js';

import {
    gps_test_config,
    test_stations
} from '../data/gps_test.js';

import {
    get_data_mode
} from '../services/data_mode.js';

import {
    get_test_records,
    save_test_stamp,
    reset_test_stamps
} from '../services/gps_test_storage.js';

import {
    verify_station_location,
    get_gps_error
} from '../services/gps_location.js';

export default function GpsTestPage() {
    const navigate = useNavigate();

    const page_ref = useRef(null);
    const mounted_ref = useRef(false);
    const busy_ref = useRef(false);

    const [records, set_records] = useState(
        get_test_records
    );

    const [pending_slot, set_pending_slot] = useState(
        null
    );

    const [result, set_result] = useState(null);
    const [reward, set_reward] = useState(null);
    const [journey_complete, set_journey_complete] = useState(false);

    const data_mode = get_data_mode();

    const use_motion = (
        data_mode !== 'low' &&
        !window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
    );

    const collected_count = new Set(
        records.map((record) => record.slot)
    ).size;

    const busy = pending_slot !== null;

    useEffect(() => {
        mounted_ref.current = true;

        return () => {
            mounted_ref.current = false;
        };
    }, []);

    useLayoutEffect(() => {
        if (!use_motion) {
            return;
        }

        const context = gsap.context(() => {
            gsap.from(
                '.gps_test_heading, .gps_test_panel',
                {
                    opacity: 0,
                    y: 14,
                    stagger: 0.1,
                    duration: 0.55,
                    ease: 'power2.out'
                }
            );
        }, page_ref);

        return () => {
            context.revert();
        };
    }, [use_motion]);



    async function collect_station(station) {
        if (
            busy_ref.current ||
            reward ||
            records.some(
                (record) => record.slot === station.slot
            )
        ) {
            return;
        }

        busy_ref.current = true;

        set_pending_slot(station.slot);
        set_result(null);

        try {
            const verification = await verify_station_location(
                station
            );

            if (!mounted_ref.current) {
                return;
            }

            const distance = Math.round(
                verification.distance
            );

            const accuracy = Math.round(
                verification.accuracy
            );

            const details = (
                `현재 거리 ${distance.toLocaleString()}m · 오차 ${accuracy}m`
            );

            if (!verification.accurate) {
                set_result({
                    type: 'error',
                    message: '위치 정확도가 낮아요. 지상에서 다시 시도해주세요.',
                    details
                });

                return;
            }

            if (!verification.success) {
                set_result({
                    type: 'error',
                    message: '역에서 500m 이내로 이동해주세요.',
                    details
                });

                return;
            }

            const next_records = save_test_stamp(
                station.slot
            );

            set_records(next_records);

            set_reward({
                ...station,
                details
            });
        } catch (error) {
            if (mounted_ref.current) {
                set_result({
                    type: 'error',
                    message: get_gps_error(error)
                });
            }
        } finally {
            busy_ref.current = false;

            if (mounted_ref.current) {
                set_pending_slot(null);
            }
        }
    }

    function handle_reset() {
        if (busy_ref.current || reward) {
            return;
        }

        const confirmed = window.confirm(
            '테스트용 단추 수집 기록을 초기화할까요?'
        );

        if (!confirmed) {
            return;
        }

        try {
            reset_test_stamps();

            set_records([]);
            set_reward(null);

            set_result({
                type: 'normal',
                message: '테스트 기록을 초기화했어요.'
            });
        } catch {
            set_result({
                type: 'error',
                message: '기록을 초기화하지 못했어요.'
            });
        }
    }

    function go_home() {
        if (!busy_ref.current) {
            navigate(routes.home);
        }
    }

    return (
        <Screen class_name="gps_test">
            <div
                className="gps_test_scene"
                ref={page_ref}
            >
                <AssetImage
                    name="atelier_background_00.webp"
                    class_name="gps_test_background"
                    alt=""
                    animate={false}
                    data_mode={data_mode}
                />

                <div
                    className="gps_test_overlay"
                    aria-hidden="true"
                />

                <header className="gps_test_heading">
                    <button
                        type="button"
                        className="btn_icon_round"
                        aria-label="인형공방으로 돌아가기"
                        disabled={busy}
                        onClick={go_home}
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

                    <p className="gps_test_subtitle">
                        {story.subtitle}
                    </p>

                    <h1 className="gps_test_title">
                        단추 찾기
                    </h1>
                </header>

                <section className="ornament_panel gps_test_panel">
                    <AssetImage
                        name="ui_ribbon.webp"
                        class_name="ornament_ribbon"
                        alt=""
                        animate={false}
                        data_mode={data_mode}
                    />

                    <header className="ornament_heading">
                        <p className="ornament_subtitle">
                            BUTTON JOURNEY
                        </p>

                        <h2 className="ornament_title">
                            잃어버린 단추 찾기
                        </h2>
                    </header>

                    <p className="gps_test_description">
                        방문한 장소를 선택해주세요.
                    </p>

                    <div className="gps_station_list">
                        {test_stations.map((station) => {
                            const collected = records.some(
                                (record) => record.slot === station.slot
                            );

                            const pending = (
                                pending_slot === station.slot
                            );

                            const classes = [
                                'gps_station',
                                collected
                                    ? 'gps_station_collected'
                                    : '',
                                pending
                                    ? 'gps_station_pending'
                                    : ''
                            ].filter(Boolean).join(' ');

                            return (
                                <button
                                    type="button"
                                    className={classes}
                                    key={station.slot}
                                    disabled={
                                        busy ||
                                        Boolean(reward) ||
                                        collected
                                    }
                                    onClick={() => {
                                        collect_station(station);
                                    }}
                                >
                                    <AssetImage
                                        name={
                                            collected
                                                ? station.image
                                                : 'button_empty.webp'
                                        }
                                        class_name="gps_station_image"
                                        alt=""
                                        animate={false}
                                        data_mode={data_mode}
                                    />

                                    <span className="gps_station_info">
                                        <strong>
                                            {station.name}
                                        </strong>

                                        <small>
                                            {collected
                                                ? '발견 완료'
                                                : pending
                                                    ? '현재 위치 확인 중...'
                                                    : '미발견 · 반경 500m'}
                                        </small>
                                    </span>

                                    <span
                                        className="gps_station_indicator"
                                        aria-hidden="true"
                                    >
                                        {pending ? (
                                            <span
                                                className={
                                                    use_motion
                                                        ? 'gps_spinner'
                                                        : 'gps_spinner motion_disabled'
                                                }
                                            />
                                        ) : (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                {collected ? (
                                                    <path d="M5 12l4 4L19 6" />
                                                ) : (
                                                    <path d="M9 5l7 7-7 7" />
                                                )}
                                            </svg>
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div
                        className="gps_test_message"
                        role="status"
                        aria-live="polite"
                    >
                        {busy ? (
                            <p>
                                현재 위치를 확인하고 있어요.
                            </p>
                        ) : result ? (
                            <>
                                <p
                                    className={
                                        result.type === 'error'
                                            ? 'gps_message_error'
                                            : ''
                                    }
                                >
                                    {result.message}
                                </p>

                                {result.details && (
                                    <small>
                                        {result.details}
                                    </small>
                                )}
                            </>
                        ) : (
                            <p>
                                역 주변 500m 이내에서 인증해주세요.
                            </p>
                        )}
                    </div>

                    <div className="collection_detail_progress">
                        <div className="collection_detail_count">
                            <span>수집 현황</span>

                            <strong>
                                {collected_count}

                                <small>
                                    / {test_stations.length}
                                </small>
                            </strong>
                        </div>

                        <div
                            className="collection_progress_track"
                            role="progressbar"
                            aria-label="단추 수집 현황"
                            aria-valuemin={0}
                            aria-valuemax={test_stations.length}
                            aria-valuenow={collected_count}
                        >
                            {test_stations.map((station) => (
                                <span
                                    key={station.slot}
                                    className={
                                        records.some(
                                            (record) => record.slot === station.slot
                                        )
                                            ? 'collection_progress_segment collected'
                                            : 'collection_progress_segment'
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    <footer className="gps_test_footer">
                        <p>GPS FIELD TEST</p>

                        <button
                            type="button"
                            disabled={busy}
                            onClick={handle_reset}
                        >
                            테스트 기록 초기화
                        </button>
                    </footer>
                </section>

                {reward && !journey_complete && (
                    <ButtonDiscovery
                        reward={reward}
                        collected_count={collected_count}
                        total_count={test_stations.length}
                        data_mode={data_mode}
                        on_complete={() => {
                            if (collected_count === test_stations.length) {
                                set_journey_complete(true);
                            } else {
                                go_home();
                            }
                        }}
                    />
                )}

                {journey_complete && (
                    <JourneyComplete
                        data_mode={data_mode}
                        on_reward={() => {
                            navigate(routes.reward);
                        }}
                        on_home={go_home}
                    />
                )}
            </div>
        </Screen>
    );
}