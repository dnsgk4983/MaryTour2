import {
    get_remaining_stock
} from '../../services/admin_reward.js';

export default function AdminStock({
    state
}) {
    const remaining = get_remaining_stock(state);

    return (
        <section className="admin_card">
            <header className="admin_card_heading">
                <h2>특전 재고 현황</h2>

                <span>REWARD INVENTORY</span>
            </header>

            <div className="admin_stock_grid">
                <div className="admin_metric">
                    <span>전체 수량</span>

                    <strong>
                        {state.total_stock}
                    </strong>

                    <small>개</small>
                </div>

                <div className="admin_metric">
                    <span>지급 완료</span>

                    <strong>
                        {state.issued}
                    </strong>

                    <small>개</small>
                </div>

                <div className="admin_metric admin_metric_remaining">
                    <span>남은 수량</span>

                    <strong>
                        {remaining}
                    </strong>

                    <small>개</small>
                </div>
            </div>

            <progress
                className="admin_stock_progress"
                max={state.total_stock}
                value={state.issued}
                aria-label="특전 지급 진행률"
            />

            <p className="admin_stock_caption">
                전체 특전 중 {state.issued}개 지급 완료
            </p>
        </section>
    );
}