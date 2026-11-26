import {
    useMemo
} from 'react';

import AdminMetric from './AdminMetric.jsx';
import AdminRate from './AdminRate.jsx';
import AdminStock from './AdminStock.jsx';
import AdminStationStats from './AdminStationStats.jsx';
import AdminRewardRecords from './AdminRewardRecords.jsx';
import AdminAnomalyRecords from './AdminAnomalyRecords.jsx';

import {
    get_dashboard_summary
} from '../../services/admin_dashboard.js';

export default function AdminDashboard({
    inventory,
    on_open_reward
}) {
    const summary = useMemo(
        () => get_dashboard_summary(inventory),
        [inventory]
    );

    return (
        <section className="admin_dashboard">
            <header className="admin_dashboard_heading">
                <div>
                    <h2>행사 운영 현황</h2>

                    <p>
                        EVENT OVERVIEW
                    </p>
                </div>

                <span className="admin_dashboard_live">
                    TEST DATA
                </span>
            </header>

            <div className="admin_dashboard_metrics">
                <AdminMetric
                    label="전체 등록 참여자"
                    value={summary.total_participants}
                    description="테스트 등록 인원"
                />

                <AdminMetric
                    label="완주 참여자"
                    value={summary.completed_count}
                    description="단추 3개 수집 완료"
                />

                <AdminMetric
                    label="특전 수령 참여자"
                    value={summary.claimed_count}
                    description="테스트 참여자 기준"
                />

                <AdminMetric
                    label="남은 특전 재고"
                    value={summary.remaining_stock}
                    unit="개"
                    description={`전체 ${summary.total_stock}개`}
                    highlight={true}
                />
            </div>

            <div className="admin_dashboard_overview">
                <AdminStationStats
                    stations={summary.station_stats}
                    total={summary.total_participants}
                />

                <AdminStock
                    state={inventory}
                />
            </div>

            <div className="admin_dashboard_rates">
                <AdminRate
                    title="완주율"
                    rate={summary.completion_rate}
                    description={`${summary.completed_count} / ${summary.total_participants}명`}
                />

                <AdminRate
                    title="완주자 특전 수령률"
                    rate={summary.reward_rate}
                    description={`${summary.completed_claimed_count} / ${summary.completed_count}명`}
                />

                <AdminRate
                    title="특전 재고 소진율"
                    rate={summary.stock_rate}
                    description={`${summary.issued_stock} / ${summary.total_stock}개`}
                />
            </div>

            <section className="admin_card admin_waiting_summary">
                <div>
                    <h2>특전 수령 대기</h2>

                    <p>
                        단추 수집을 완료했으나 아직 특전을 받지 않은 참여자
                    </p>
                </div>

                <div className="admin_waiting_value">
                    <strong>
                        {summary.waiting_count}
                    </strong>

                    <span>명</span>
                </div>
            </section>

            <div className="admin_dashboard_logs">
                <AdminRewardRecords
                    records={summary.reward_records}
                    on_open_reward={on_open_reward}
                />

                <AdminAnomalyRecords
                    records={summary.anomalies}
                    statistics={summary.anomaly_stats}
                />
            </div>

            <p className="admin_dashboard_disclaimer">
                참여자 통계는 테스트 등록 인원 기준이며,
                재고 통계에는 기존 가상 지급 수량이 포함됩니다.
            </p>
        </section>
    );
}