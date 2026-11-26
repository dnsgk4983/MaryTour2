import {
    admin_reward_config,
    admin_test_participants
} from '../data/admin_reward.js';

function assert_preview() {
    if (!import.meta.env.DEV) {
        throw new Error('PREVIEW_DISABLED');
    }
}

export function create_reward_preview() {
    assert_preview();

    return {
        total_stock: admin_reward_config.total_stock,
        issued: admin_reward_config.initial_issued,
        participants: admin_test_participants.map(
            (participant) => ({
                ...participant,
                stamps: [...participant.stamps]
            })
        )
    };
}

export function get_remaining_stock(state) {
    return Math.max(
        0,
        state.total_stock - state.issued
    );
}

export function find_preview_participant(
    state,
    participant_id
) {
    assert_preview();

    const normalized_id = String(
        participant_id || ''
    ).trim().toUpperCase();

    return state.participants.find(
        (participant) => (
            participant.id === normalized_id
        )
    ) || null;
}

export function get_reward_status(
    state,
    participant
) {
    if (!participant) {
        return {
            code: 'not_found',
            label: '조회 결과 없음',
            eligible: false
        };
    }

    if (participant.claimed) {
        return {
            code: 'already_received',
            label: '이미 수령 완료',
            eligible: false
        };
    }

    const completed = admin_reward_config.stations.every(
        (station) => (
            participant.stamps.includes(station.id)
        )
    );

    if (!completed) {
        return {
            code: 'incomplete',
            label: '단추 수집 미완료',
            eligible: false
        };
    }

    if (get_remaining_stock(state) <= 0) {
        return {
            code: 'out_of_stock',
            label: '특전 재고 소진',
            eligible: false
        };
    }

    return {
        code: 'available',
        label: '지급 가능',
        eligible: true
    };
}

export function issue_preview_reward(
    state,
    participant_id
) {
    assert_preview();

    const participant = find_preview_participant(
        state,
        participant_id
    );

    const status = get_reward_status(
        state,
        participant
    );

    if (!status.eligible) {
        return {
            success: false,
            state,
            message: status.label
        };
    }

    const claimed_at = new Date().toISOString();

    return {
        success: true,
        message: '테스트 특전 지급이 완료되었습니다.',
        state: {
            ...state,
            issued: state.issued + 1,
            participants: state.participants.map(
                (item) => (
                    item.id === participant_id
                        ? {
                            ...item,
                            claimed: true,
                            claimed_at
                        }
                        : item
                )
            )
        }
    };
}