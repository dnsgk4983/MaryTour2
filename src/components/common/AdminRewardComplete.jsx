import AdminIcon from './AdminIcon.jsx';

export default function AdminRewardComplete({
    participant_id,
    remaining,
    on_next
}) {
    return (
        <section
            className="admin_card admin_complete"
            role="status"
        >
            <div className="admin_complete_icon">
                <AdminIcon name="check" />
            </div>

            <p className="admin_complete_eyebrow">
                REWARD DISTRIBUTED
            </p>

            <h2>특전 지급 완료</h2>

            <p className="admin_complete_description">
                테스트 지급 기록이 정상적으로 반영되었습니다.
            </p>

            <dl className="admin_record">
                <div>
                    <dt>참여자</dt>

                    <dd>
                        {participant_id}
                    </dd>
                </div>

                <div>
                    <dt>지급 수량</dt>

                    <dd>1개</dd>
                </div>

                <div>
                    <dt>남은 재고</dt>

                    <dd>
                        {remaining}개
                    </dd>
                </div>
            </dl>

            <button
                type="button"
                className="admin_button admin_button_primary"
                onClick={on_next}
            >
                다음 참여자 조회
            </button>
        </section>
    );
}