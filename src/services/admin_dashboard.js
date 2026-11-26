import {
    admin_reward_config
} from '../data/admin_reward.js';

import {
    admin_test_anomalies,
    admin_anomaly_types
} from '../data/admin_dashboard.js';

export function calculate_rate(
    value,
    total
) {
    if (total <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(
                value / total * 1000
            ) / 10
        )
    );
}

export function get_dashboard_summary(inventory) {
    const participants = inventory.participants;

    const total_participants = participants.length;

    const completed_participants = participants.filter(
        (participant) => (
            admin_reward_config.stations.every(
                (station) => (
                    participant.stamps.includes(
                        station.id
                    )
                )
            )
        )
    );

    const completed_count = completed_participants.length;

    const claimed_count = participants.filter(
        (participant) => participant.claimed
    ).length;

    const completed_claimed_count = completed_participants.filter(
        (participant) => participant.claimed
    ).length;

    const waiting_count = completed_count -
        completed_claimed_count;

    const remaining_stock = Math.max(
        0,
        inventory.total_stock - inventory.issued
    );

    const station_stats = admin_reward_config.stations.map(
        (station) => {
            const count = participants.filter(
                (participant) => (
                    participant.stamps.includes(
                        station.id
                    )
                )
            ).length;

            return {
                ...station,
                count,
                rate: calculate_rate(
                    count,
                    total_participants
                )
            };
        }
    );

    const reward_records = participants
        .filter(
            (participant) => participant.claimed
        )
        .map(
            (participant) => ({
                id: participant.id,
                claimed_at: participant.claimed_at,
                quantity: 1
            })
        )
        .sort(
            (first, second) => {
                const first_time = first.claimed_at
                    ? new Date(first.claimed_at).getTime()
                    : 0;

                const second_time = second.claimed_at
                    ? new Date(second.claimed_at).getTime()
                    : 0;

                return second_time - first_time;
            }
        );

    const anomaly_stats = admin_anomaly_types.map(
        (type) => ({
            ...type,
            count: admin_test_anomalies.filter(
                (record) => record.type === type.id
            ).length
        })
    );

    return {
        total_participants,
        completed_count,
        claimed_count,
        completed_claimed_count,
        waiting_count,
        remaining_stock,
        total_stock: inventory.total_stock,
        issued_stock: inventory.issued,
        completion_rate: calculate_rate(
            completed_count,
            total_participants
        ),
        reward_rate: calculate_rate(
            completed_claimed_count,
            completed_count
        ),
        stock_rate: calculate_rate(
            inventory.issued,
            inventory.total_stock
        ),
        station_stats,
        reward_records,
        anomaly_stats,
        anomalies: admin_test_anomalies
    };
}