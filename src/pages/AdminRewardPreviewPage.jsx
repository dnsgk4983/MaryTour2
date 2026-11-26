import AdminNavigation from '../components/common/AdminNavigation.jsx';
import AdminDashboard from '../components/common/AdminDashboard.jsx';

import {
    useReducer,
    useRef,
    useState
} from 'react';

import AssetImage from '../components/common/AssetImage.jsx';
import AdminIcon from '../components/common/AdminIcon.jsx';
import AdminStock from '../components/common/AdminStock.jsx';
import AdminParticipant from '../components/common/AdminParticipant.jsx';
import AdminConfirmDialog from '../components/common/AdminConfirmDialog.jsx';
import AdminRewardComplete from '../components/common/AdminRewardComplete.jsx';

import {
    admin_reward_config
} from '../data/admin_reward.js';

import {
    create_reward_preview,
    get_remaining_stock,
    find_preview_participant,
    get_reward_status,
    issue_preview_reward
} from '../services/admin_reward.js';

function create_preview_state() {
    return {
        inventory: create_reward_preview(),
        selected_id: '',
        completed_id: '',
        message: '',
        searched: false
    };
}

function reward_reducer(state, action) {
    switch (action.type) {
        case 'search': {
            const participant = find_preview_participant(
                state.inventory,
                action.participant_id
            );

            return {
                ...state,
                selected_id: participant
                    ? participant.id
                    : '',
                completed_id: '',
                searched: true,
                message: participant
                    ? ''
                    : '일치하는 참여자 정보가 없습니다.'
            };
        }

        case 'issue': {
            if (state.completed_id) {
                return state;
            }

            const result = issue_preview_reward(
                state.inventory,
                state.selected_id
            );

            return {
                ...state,
                inventory: result.state,
                completed_id: result.success
                    ? state.selected_id
                    : '',
                message: result.success
                    ? ''
                    : result.message
            };
        }

        case 'next':
            return {
                ...state,
                selected_id: '',
                completed_id: '',
                message: '',
                searched: false
            };

        case 'stock_empty':
            return {
                ...state,
                inventory: {
                    ...state.inventory,
                    issued: state.inventory.total_stock
                },
                completed_id: '',
                message: ''
            };

        case 'reset':
            return create_preview_state();

        default:
            return state;
    }
}

function RewardWorkspace({
    on_logout
}) {
    const search_ref = useRef(null);

    const [active_menu, set_active_menu] = useState('dashboard');

    const [query, set_query] = useState('');

    const [dialog, set_dialog] = useState('');

    const [state, dispatch] = useReducer(
        reward_reducer,
        null,
        create_preview_state
    );

    const participant = find_preview_participant(
        state.inventory,
        state.selected_id
    );

    const status = get_reward_status(
        state.inventory,
        participant
    );

    const remaining = get_remaining_stock(
        state.inventory
    );

    function search_participant(event) {
        event.preventDefault();

        if (!query.trim()) {
            search_ref.current?.focus();
            return;
        }

        dispatch({
            type: 'search',
            participant_id: query
        });
    }

    function select_test_participant(participant_id) {
        set_query(participant_id);

        dispatch({
            type: 'search',
            participant_id
        });
    }

    function next_participant() {
        set_query('');

        dispatch({
            type: 'next'
        });

        window.requestAnimationFrame(() => {
            search_ref.current?.focus();
        });
    }

    function confirm_action() {
        const action = dialog;

        set_dialog('');

        if (action === 'issue') {
            dispatch({
                type: 'issue'
            });
        }

        if (action === 'reset') {
            set_query('');

            dispatch({
                type: 'reset'
            });
        }

        if (action === 'logout') {
            on_logout();
        }
    }

    const dialog_title = {
        issue: '특전을 지급하시겠습니까?',
        reset: '테스트 기록을 초기화할까요?',
        logout: '로그아웃하시겠습니까?'
    };

    const dialog_description = {
        issue: '참여자에게 특전을 전달한 후 지급을 확정해 주세요.',
        reset: '현재 테스트 지급 기록과 재고가 초기 상태로 돌아갑니다.',
        logout: '로그인 화면으로 돌아갑니다. 임시 테스트 기록은 사라집니다.'
    };

    const dialog_confirm_label = {
        issue: '지급 확정',
        reset: '초기화',
        logout: '로그아웃'
    };

    return (
        <section className="admin_shell admin_workspace">
            <AssetImage
                name="atelier_background_00.webp"
                class_name="admin_background"
                alt=""
                animate={false}
                data_mode="normal"
            />

            <div
                className="admin_overlay"
                aria-hidden="true"
            />

            <div className="admin_workspace_container">
                <header className="admin_workspace_header">
                    <div>
                        <p>MARY’S BUTTON TOUR</p>

                        <h1>
                            {active_menu === 'dashboard'
                                ? '운영 대시보드'
                                : '특전 지급 관리'}
                        </h1>
                    </div>

                    <button
                        type="button"
                        className="admin_button admin_logout"
                        onClick={() => {
                            set_dialog('logout');
                        }}
                    >
                        로그아웃
                    </button>
                </header>

                <div className="admin_preview_notice">
                    <AdminIcon name="shield" />

                    <span>
                        개발용 테스트 환경 · 실제 지급 및 DB 변경 없음
                    </span>
                </div>

                <AdminNavigation
                    active={active_menu}
                    on_change={(menu) => {
                        set_dialog('');
                        set_active_menu(menu);
                    }}
                />

                {active_menu === 'dashboard' ? (
                    <AdminDashboard
                        inventory={state.inventory}
                        on_open_reward={() => {
                            set_active_menu('reward');
                        }}
                    />
                ) : (
                <main className="admin_workspace_grid">
                    <AdminStock
                        state={state.inventory}
                    />

                    <section className="admin_card admin_test_panel">
                        <header className="admin_card_heading">
                            <h2>테스트 참여자</h2>

                            <span>TEST DATA</span>
                        </header>

                        <div className="admin_test_list">
                            {[
                                ['MARY-0001', '완주 / 미수령'],
                                ['MARY-0002', '수집 미완료'],
                                ['MARY-0003', '수령 완료'],
                                ['MARY-0004', '미참여']
                            ].map(([id, label]) => (
                                <button
                                    type="button"
                                    className="admin_test_item"
                                    key={id}
                                    onClick={() => {
                                        select_test_participant(id);
                                    }}
                                >
                                    <strong>
                                        {id}
                                    </strong>

                                    <span>
                                        {state.inventory.participants.find(
                                            (item) => item.id === id
                                        )?.claimed
                                            ? '수령 완료'
                                            : label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="admin_test_actions">
                            <button
                                type="button"
                                className="admin_button admin_button_outline"
                                onClick={() => {
                                    dispatch({
                                        type: 'stock_empty'
                                    });
                                }}
                            >
                                재고 소진 테스트
                            </button>

                            <button
                                type="button"
                                className="admin_button admin_button_outline"
                                onClick={() => {
                                    set_dialog('reset');
                                }}
                            >
                                테스트 초기화
                            </button>
                        </div>
                    </section>

                    {state.completed_id ? (
                        <AdminRewardComplete
                            participant_id={state.completed_id}
                            remaining={remaining}
                            on_next={next_participant}
                        />
                    ) : (
                        <section className="admin_card admin_lookup">
                            <header className="admin_card_heading">
                                <h2>참여자 조회</h2>

                                <span>PARTICIPANT CHECK</span>
                            </header>

                            <form
                                className="admin_search"
                                onSubmit={search_participant}
                            >
                                <input
                                    ref={search_ref}
                                    type="text"
                                    value={query}
                                    aria-label="참여자 식별번호"
                                    placeholder="참여자 식별번호 입력"
                                    autoComplete="off"
                                    spellCheck={false}
                                    onChange={(event) => {
                                        set_query(
                                            event.target.value
                                        );

                                        dispatch({
                                            type: 'next'
                                        });
                                    }}
                                />

                                <button
                                    type="submit"
                                    className="admin_button admin_button_primary"
                                >
                                    조회
                                </button>
                            </form>

                            {state.message && (
                                <div
                                    className="admin_feedback admin_feedback_error"
                                    role="alert"
                                >
                                    <AdminIcon name="alert" />

                                    <p>
                                        {state.message}
                                    </p>
                                </div>
                            )}

                            {participant ? (
                                <AdminParticipant
                                    participant={participant}
                                    status={status}
                                    on_issue={() => {
                                        set_dialog('issue');
                                    }}
                                />
                            ) : (
                                !state.searched && (
                                    <div className="admin_empty">
                                        <AdminIcon name="shield" />

                                        <h3>참여자 확인 대기 중</h3>

                                        <p>
                                            식별번호를 입력하거나 테스트 참여자를 선택해 주세요.
                                        </p>
                                    </div>
                                )
                            )}
                        </section>
                    )}
                </main>
                )}

                <footer className="admin_footer">
                    <p>MARYTOUR · EVENT OPERATIONS</p>
                </footer>
            </div>

            <AdminConfirmDialog
                open={Boolean(dialog)}
                title={dialog_title[dialog] || ''}
                description={dialog_description[dialog] || ''}
                confirm_label={dialog_confirm_label[dialog]}
                on_confirm={confirm_action}
                on_close={() => {
                    set_dialog('');
                }}
            >
                {dialog === 'issue' && participant && (
                    <dl className="admin_record">
                        <div>
                            <dt>참여자</dt>

                            <dd>
                                {participant.id}
                            </dd>
                        </div>

                        <div>
                            <dt>지급 특전</dt>

                            <dd>
                                {admin_reward_config.reward_name}
                            </dd>
                        </div>

                        <div>
                            <dt>지급 수량</dt>

                            <dd>1개</dd>
                        </div>

                        <div>
                            <dt>지급 후 재고</dt>

                            <dd>
                                {Math.max(0, remaining - 1)}개
                            </dd>
                        </div>
                    </dl>
                )}
            </AdminConfirmDialog>
        </section>
    );
}

export default function AdminRewardPreviewPage({
    preview_verified = false,
    on_logout
}) {
    if (
        !import.meta.env.DEV ||
        !preview_verified
    ) {
        return null;
    }

    return (
        <RewardWorkspace
            on_logout={on_logout}
        />
    );
}