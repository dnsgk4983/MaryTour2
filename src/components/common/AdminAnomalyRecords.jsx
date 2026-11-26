import {
    useState
} from 'react';

import AdminIcon from './AdminIcon.jsx';

export default function AdminAnomalyRecords({
    records,
    statistics
}) {
    const [filter, set_filter] = useState('all');

    const filtered_records = filter === 'all'
        ? records
        : records.filter(
            (record) => record.type === filter
        );

    return (
        <section className="admin_card admin_anomaly_records">
            <header className="admin_card_heading">
                <h2>이상 인증 현황</h2>

                <span>VERIFICATION LOGS</span>
            </header>

            <p className="admin_dashboard_note">
                아래 기록은 실제 탐지 결과가 아닌 테스트 예시입니다.
            </p>

            <div className="admin_anomaly_summary">
                {statistics.map(
                    (item) => (
                        <button
                            type="button"
                            key={item.id}
                            className={[
                                'admin_anomaly_metric',
                                filter === item.id
                                    ? 'admin_anomaly_selected'
                                    : ''
                            ].filter(Boolean).join(' ')}
                            aria-pressed={filter === item.id}
                            onClick={() => {
                                set_filter(
                                    filter === item.id
                                        ? 'all'
                                        : item.id
                                );
                            }}
                        >
                            <span>
                                {item.label}
                            </span>

                            <strong>
                                {item.count}
                            </strong>

                            <small>건</small>
                        </button>
                    )
                )}
            </div>

            <div className="admin_log_heading">
                <strong>
                    인증 기록 {filtered_records.length}건
                </strong>

                <button
                    type="button"
                    className="admin_filter_button"
                    onClick={() => {
                        set_filter('all');
                    }}
                >
                    전체 보기
                </button>
            </div>

            {filtered_records.length ? (
                <div className="admin_log_list">
                    {filtered_records.map(
                        (record) => (
                            <article
                                key={record.id}
                                className="admin_log_item admin_anomaly_item"
                            >
                                <div className="admin_log_icon admin_log_warning">
                                    <AdminIcon name="alert" />
                                </div>

                                <div className="admin_log_content">
                                    <strong>
                                        {record.label}
                                    </strong>

                                    <small>
                                        {record.participant_id}
                                        {' · '}
                                        {record.station}
                                    </small>

                                    <small>
                                        {record.detail}
                                    </small>
                                </div>

                                <div className="admin_log_result">
                                    <strong className="admin_log_blocked">
                                        인증 차단
                                    </strong>

                                    <small>
                                        {record.time}
                                    </small>
                                </div>
                            </article>
                        )
                    )}
                </div>
            ) : (
                <div className="admin_dashboard_empty">
                    해당 유형의 인증 기록이 없습니다.
                </div>
            )}
        </section>
    );
}