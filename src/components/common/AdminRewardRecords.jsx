import AdminIcon from './AdminIcon.jsx';

function format_claimed_at(value) {
    if (!value) {
        return '기존 테스트 기록';
    }

    return new Intl.DateTimeFormat(
        'ko-KR',
        {
            timeZone: 'Asia/Seoul',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }
    ).format(
        new Date(value)
    );
}

export default function AdminRewardRecords({
    records,
    on_open_reward
}) {
    return (
        <section className="admin_card admin_reward_records">
            <header className="admin_card_heading">
                <h2>최근 특전 지급 기록</h2>

                <span>RECENT DISTRIBUTION</span>
            </header>

            {records.length ? (
                <div className="admin_log_list">
                    {records.slice(0, 10).map(
                        (record) => (
                            <article
                                key={record.id}
                                className="admin_log_item"
                            >
                                <div className="admin_log_icon admin_log_success">
                                    <AdminIcon name="check" />
                                </div>

                                <div className="admin_log_content">
                                    <strong>
                                        {record.id}
                                    </strong>

                                    <small>
                                        {format_claimed_at(
                                            record.claimed_at
                                        )}
                                    </small>
                                </div>

                                <div className="admin_log_result">
                                    <strong>
                                        지급 완료
                                    </strong>

                                    <small>
                                        {record.quantity}개
                                    </small>
                                </div>
                            </article>
                        )
                    )}
                </div>
            ) : (
                <div className="admin_dashboard_empty">
                    지급 기록이 없습니다.
                </div>
            )}

            <button
                type="button"
                className="admin_button admin_button_outline"
                onClick={on_open_reward}
            >
                특전 지급 관리로 이동
            </button>
        </section>
    );
}