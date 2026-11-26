import AdminIcon from './AdminIcon.jsx';

import {
    admin_reward_config
} from '../../data/admin_reward.js';

export default function AdminParticipant({
    participant,
    status,
    on_issue
}) {
    const collected_count = admin_reward_config.stations.filter(
        (station) => (
            participant.stamps.includes(station.id)
        )
    ).length;

    return (
        <div className="admin_participant">
            <header className="admin_participant_heading">
                <div>
                    <p>참여자 식별번호</p>

                    <h3>
                        {participant.id}
                    </h3>
                </div>

                <span
                    className={[
                        'admin_status',
                        status.eligible
                            ? 'admin_status_available'
                            : 'admin_status_blocked'
                    ].join(' ')}
                >
                    {status.label}
                </span>
            </header>

            <div className="admin_section_label">
                <h3>단추 수집 현황</h3>

                <strong>
                    {collected_count} / 3
                </strong>
            </div>

            <div className="admin_station_grid">
                {admin_reward_config.stations.map(
                    (station) => {
                        const collected = participant.stamps.includes(
                            station.id
                        );

                        return (
                            <article
                                key={station.id}
                                className={[
                                    'admin_station',
                                    collected
                                        ? 'admin_station_collected'
                                        : 'admin_station_empty'
                                ].join(' ')}
                            >
                                <AdminIcon
                                    name={
                                        collected
                                            ? 'check'
                                            : 'lock'
                                    }
                                />

                                <strong>
                                    {station.name}
                                </strong>

                                <small>
                                    {collected
                                        ? '인증 완료'
                                        : '미인증'}
                                </small>
                            </article>
                        );
                    }
                )}
            </div>

            <dl className="admin_record">
                <div>
                    <dt>완주 여부</dt>

                    <dd>
                        {collected_count === 3
                            ? '완주 완료'
                            : '미완주'}
                    </dd>
                </div>

                <div>
                    <dt>특전 수령 이력</dt>

                    <dd>
                        {participant.claimed
                            ? '수령 완료'
                            : '미수령'}
                    </dd>
                </div>

                {participant.claimed_at && (
                    <div>
                        <dt>지급 시간</dt>

                        <dd>
                            {new Date(
                                participant.claimed_at
                            ).toLocaleString('ko-KR')}
                        </dd>
                    </div>
                )}
            </dl>

            {!status.eligible && (
                <div
                    className="admin_feedback admin_feedback_error"
                    role="status"
                >
                    <AdminIcon name="alert" />

                    <p>
                        {status.label} 상태로 지급할 수 없습니다.
                    </p>
                </div>
            )}

            <button
                type="button"
                className="admin_button admin_button_primary"
                disabled={!status.eligible}
                onClick={on_issue}
            >
                특전 지급 처리
            </button>
        </div>
    );
}