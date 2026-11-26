import {
    get_test_stamps
} from '../../services/gps_test_storage.js';

import {
    gps_test_config,
    test_stations
} from '../../data/gps_test.js';

import { useState } from 'react';

import AssetImage from './AssetImage.jsx';
import Modal from './Modal.jsx';

import {
    stamp_list,
    get_stamp_count
} from '../../data/stamps.js';

export default function StampCollection({
    collected_stamps: original_stamps = [],
    data_mode = 'normal',
    disabled = false
}) {
    const [modal_open, set_modal_open] = useState(false);

    const collected_stamps = gps_test_config.enabled
        ? get_test_stamps()
        : original_stamps;

    function get_station_name(stamp, index) {
        if (gps_test_config.enabled) {
            return test_stations[index]?.name || stamp.name;
        }

        return stamp.name;
    }

    const collected_count = get_stamp_count(
        collected_stamps
    );

    const classes = [
        'stamp_collection',
        data_mode === 'low'
            ? 'motion_disabled'
            : 'motion_enabled'
    ].join(' ');

    return (
        <section
            className={classes}
            aria-label="단추 수집 현황"
        >
            <button
                type="button"
                className="collection_case"
                aria-label="단추 수집 상세 현황 열기"
                aria-haspopup="dialog"
                disabled={disabled}
                onClick={() => {
                    set_modal_open(true);
                }}
            >
                <AssetImage
                    name="button_case.webp"
                    class_name="collection_background"
                    animate={false}
                    data_mode={data_mode}
                />

                <span
                    className="collection_reflection"
                    aria-hidden="true"
                />

                {stamp_list.map((stamp, index) => {
                    const collected = collected_stamps.includes(
                        stamp.id
                    );

                    const slot_classes = [
                        'stamp_slot',
                        `stamp_slot_${index + 1}`,
                        collected
                            ? 'stamp_slot_collected'
                            : ''
                    ].filter(Boolean).join(' ');

                    return (
                        <span
                            className={slot_classes}
                            key={stamp.id}
                        >
                            {collected && (
                                <AssetImage
                                    name={stamp.image}
                                    class_name="stamp_image"
                                    alt=""
                                    animate={false}
                                    data_mode={data_mode}
                                />
                            )}
                        </span>
                    );
                })}
            </button>

            <div className="collection_summary">
                <div className="collection_status">
                    <span>단추 수집</span>

                    <strong aria-live="polite">
                        {collected_count} / {stamp_list.length}
                    </strong>
                </div>

                <div
                    className="collection_steps"
                    aria-hidden="true"
                >
                    {stamp_list.map((stamp) => (
                        <span
                            className={
                                collected_stamps.includes(stamp.id)
                                    ? 'collection_step collected'
                                    : 'collection_step'
                            }
                            key={stamp.id}
                        />
                    ))}
                </div>
            </div>

            <Modal
                open={modal_open}
                on_close={() => {
                    set_modal_open(false);
                }}
                title="잃어버린 단추"
                subtitle="BUTTON COLLECTION"
                variant="collection"
                data_mode={data_mode}
            >
                {modal_open && (
                    <div className="collection_detail">
                        <p className="collection_description">
                            세 개의 단추를 모두 찾아주세요.
                        </p>

                        <div className="collection_divider">
                            <span />
                        </div>

                        <div className="stamp_card_list">
                            {stamp_list.map((stamp, index) => {
                                const collected = collected_stamps.includes(
                                    stamp.id
                                );

                                const card_classes = [
                                    'stamp_card',
                                    collected
                                        ? 'stamp_card_collected'
                                        : 'stamp_card_empty'
                                ].join(' ');

                                return (
                                    <article
                                        className={card_classes}
                                        key={stamp.id}
                                    >
                                        <span className="stamp_card_number">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        <div className="stamp_card_slot">
                                            <AssetImage
                                                name={
                                                    collected
                                                        ? stamp.image
                                                        : 'button_empty.webp'
                                                }
                                                class_name="stamp_card_image"
                                                alt=""
                                                animate={false}
                                                data_mode={data_mode}
                                            />

                                            {collected && (
                                                <span
                                                    className="stamp_card_check"
                                                    aria-hidden="true"
                                                >
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

                                        <h3 className="stamp_card_name">
                                            {get_station_name(stamp, index)}
                                        </h3>

                                        <span className="stamp_card_state">
                                            {collected
                                                ? '발견 완료'
                                                : '미발견'}
                                        </span>
                                    </article>
                                );
                            })}
                        </div>

                        <div className="collection_detail_progress">
                            <div className="collection_detail_count">
                                <span>수집 현황</span>

                                <strong>
                                    {collected_count}
                                    <small>
                                        / {stamp_list.length}
                                    </small>
                                </strong>
                            </div>

                            <div
                                className="collection_progress_track"
                                role="progressbar"
                                aria-label="단추 수집 진행률"
                                aria-valuemin={0}
                                aria-valuemax={stamp_list.length}
                                aria-valuenow={collected_count}
                            >
                                {stamp_list.map((stamp) => (
                                    <span
                                        className={
                                            collected_stamps.includes(stamp.id)
                                                ? 'collection_progress_segment collected'
                                                : 'collection_progress_segment'
                                        }
                                        key={stamp.id}
                                    />
                                ))}
                            </div>
                        </div>

                        <div
                            className="collection_footer"
                            aria-hidden="true"
                        >
                            <span />
                            <i />
                            <span />
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
}