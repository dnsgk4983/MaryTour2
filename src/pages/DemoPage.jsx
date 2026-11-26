import {
    useState
} from 'react';

import {
    useNavigate,
    useParams
} from 'react-router-dom';

import Screen from '../components/layout/Screen.jsx';
import AssetImage from '../components/common/AssetImage.jsx';
import DemoPanel from '../components/common/DemoPanel.jsx';
import DemoButton from '../components/common/DemoButton.jsx';
import ButtonDiscovery from '../components/common/ButtonDiscovery.jsx';
import JourneyComplete from '../components/common/JourneyComplete.jsx';
import RewardReveal from '../components/common/RewardReveal.jsx';
import JourneyEnding from '../components/common/JourneyEnding.jsx';
import AdminDashboard from '../components/common/AdminDashboard.jsx';

import {
    demo_groups,
    demo_status
} from '../data/demo.js';

import {
    test_stations
} from '../data/gps_test.js';

import {
    admin_reward_config,
    admin_test_participants
} from '../data/admin_reward.js';

function create_demo_inventory() {
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

export default function DemoPage() {
    const navigate = useNavigate();

    const {
        page = ''
    } = useParams();

    const [slot, set_slot] = useState(0);
    const [stamps, set_stamps] = useState([]);
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const [login_error, set_login_error] = useState('');
    const [inventory, set_inventory] = useState(
        create_demo_inventory
    );

    const [participant_id, set_participant_id] = useState(
        admin_test_participants[0]?.id || ''
    );

    const [confirm_open, set_confirm_open] = useState(false);

    const station = test_stations.find(
        (item) => item.slot === slot
    ) || test_stations[0];

    const participant = inventory.participants.find(
        (item) => item.id === participant_id
    );

    const remaining_stock = Math.max(
        0,
        inventory.total_stock - inventory.issued
    );

    const completed = Boolean(
        participant &&
        admin_reward_config.stations.every(
            (item) => participant.stamps.includes(item.id)
        )
    );

    const eligible = Boolean(
        participant &&
        completed &&
        !participant.claimed &&
        remaining_stock > 0
    );

    function open_page(next_page = '') {
        set_confirm_open(false);

        navigate(
            next_page
                ? `/demo/${next_page}`
                : '/demo'
        );
    }

    function collect_stamp() {
        const next_stamps = [
            ...new Set([
                ...stamps,
                station.slot
            ])
        ];

        set_stamps(next_stamps);

        open_page(
            next_stamps.length === test_stations.length
                ? 'complete'
                : 'home'
        );
    }

    function handle_login(event) {
        event.preventDefault();

        if (
            username.trim() === 'admin' &&
            password === 'test'
        ) {
            set_login_error('');
            set_password('');
            open_page('dashboard');
            return;
        }

        set_login_error(
            '테스트 계정 정보를 확인해 주세요.'
        );
    }

    function issue_reward() {
        if (!eligible) {
            set_confirm_open(false);
            return;
        }

        set_inventory((previous) => {
            const current = previous.participants.find(
                (item) => item.id === participant_id
            );

            const current_eligible = Boolean(
                current &&
                !current.claimed &&
                previous.issued < previous.total_stock &&
                admin_reward_config.stations.every(
                    (item) => current.stamps.includes(item.id)
                )
            );

            if (!current_eligible) {
                return previous;
            }

            return {
                ...previous,
                issued: previous.issued + 1,
                participants: previous.participants.map(
                    (item) => (
                        item.id === participant_id
                            ? {
                                ...item,
                                claimed: true,
                                claimed_at: new Date().toISOString()
                            }
                            : item
                    )
                )
            };
        });

        open_page('issued');
    }

    function reset_demo() {
        set_stamps([]);
        set_slot(0);
        set_inventory(create_demo_inventory());
        set_username('');
        set_password('');
        set_login_error('');
        set_participant_id(
            admin_test_participants[0]?.id || ''
        );

        open_page();
    }

    function render_scene() {
        if (page === 'discovery') {
            return (
                <Screen class_name="discovery_preview">
                    <ButtonDiscovery
                        key={station.slot}
                        reward={station}
                        collected_count={new Set([
                            ...stamps,
                            station.slot
                        ]).size}
                        total_count={test_stations.length}
                        data_mode="normal"
                        preview={true}
                        on_complete={collect_stamp}
                    />
                </Screen>
            );
        }

        if (page === 'complete') {
            return (
                <Screen class_name="journey_complete_preview_screen">
                    <JourneyComplete
                        data_mode="normal"
                        preview={true}
                        on_reward={() => open_page('reward')}
                        on_home={() => open_page('home')}
                    />
                </Screen>
            );
        }

        if (page === 'reward') {
            return (
                <Screen class_name="reward_screen">
                    <RewardReveal
                        data_mode="normal"
                        preview={true}
                        eligible={true}
                        on_home={() => open_page('home')}
                    />
                </Screen>
            );
        }

        if (page === 'ending') {
            return (
                <Screen class_name="ending_screen">
                    <JourneyEnding
                        data_mode="normal"
                        preview={true}
                        on_home={() => open_page('home')}
                    />
                </Screen>
            );
        }

        return null;
    }

    const scene = render_scene();

    function render_content() {
        if (page === 'splash') {
            return (
                <DemoPanel
                    title="메리의 잃어버린 단추"
                    subtitle="BIRTHDAY STAMP JOURNEY"
                >
                    <AssetImage
                        name="splash_mary.webp"
                        class_name="demo_character"
                        alt="토키노 메리"
                        animate={false}
                        data_mode="normal"
                    />

                    <p className="demo_description">
                        잃어버린 단추 3개를 찾아주세요!
                    </p>

                    <DemoButton
                        on_click={() => open_page('home')}
                    >
                        여정 시작하기
                    </DemoButton>
                </DemoPanel>
            );
        }

        if (page === 'home') {
            return (
                <DemoPanel
                    title="오래된 인형공방"
                    subtitle="BUTTON COLLECTION"
                >
                    <AssetImage
                        name="atelier_mary.webp"
                        class_name="demo_character"
                        alt="토키노 메리"
                        animate={false}
                        data_mode="normal"
                    />

                    <p className="demo_description">
                        수집한 단추 {stamps.length} / {test_stations.length}
                    </p>

                    <div className="demo_stamp_grid">
                        {test_stations.map(
                            (item, index) => (
                                <div
                                    key={item.slot}
                                    className="demo_stamp"
                                >
                                    <AssetImage
                                        name={
                                            stamps.includes(item.slot)
                                                ? `button_0${index + 1}.webp`
                                                : 'button_empty.webp'
                                        }
                                        alt=""
                                        animate={false}
                                        data_mode="normal"
                                    />

                                    <span>
                                        {stamps.includes(item.slot)
                                            ? '수집 완료'
                                            : '미수집'}
                                    </span>
                                </div>
                            )
                        )}
                    </div>

                    <DemoButton
                        on_click={() => open_page('scanner')}
                    >
                        QR 스캔 시연
                    </DemoButton>

                    <DemoButton
                        secondary={true}
                        disabled={
                            stamps.length !== test_stations.length
                        }
                        on_click={() => open_page('complete')}
                    >
                        완주 특전 확인
                    </DemoButton>
                </DemoPanel>
            );
        }

        if (page === 'scanner' || page === 'gps') {
            return (
                <DemoPanel
                    title={
                        page === 'scanner'
                            ? 'QR 스캔 시연'
                            : 'GPS 위치 인증 시연'
                    }
                    subtitle="SIMULATION"
                >
                    {page === 'scanner' && (
                        <div className="demo_scanner_frame">
                            <span>QR</span>
                            <small>가상 카메라 영역</small>
                        </div>
                    )}

                    <label className="demo_field">
                        <span>인증할 장소</span>

                        <select
                            value={slot}
                            onChange={(event) => {
                                set_slot(Number(event.target.value));
                            }}
                        >
                            {test_stations.map(
                                (item) => (
                                    <option
                                        key={item.slot}
                                        value={item.slot}
                                    >
                                        {item.name || `장소 ${item.slot + 1}`}
                                    </option>
                                )
                            )}
                        </select>
                    </label>

                    <p className="demo_description">
                        {page === 'scanner'
                            ? '실제 카메라를 사용하지 않습니다.'
                            : '가상 거리 120m · 인증 가능 범위 500m'}
                    </p>

                    <DemoButton
                        on_click={() => {
                            open_page(
                                page === 'scanner'
                                    ? 'gps'
                                    : 'discovery'
                            );
                        }}
                    >
                        {page === 'scanner'
                            ? 'QR 인식 성공'
                            : '위치 인증 성공'}
                    </DemoButton>

                    <DemoButton
                        secondary={true}
                        on_click={() => open_page('failed')}
                    >
                        인증 실패 시연
                    </DemoButton>
                </DemoPanel>
            );
        }

        if (demo_status[page]) {
            const status = demo_status[page];

            return (
                <DemoPanel
                    title={status.title}
                    subtitle="EVENT NOTICE"
                >
                    <div className="demo_status_symbol">
                        !
                    </div>

                    <p className="demo_description">
                        {status.message}
                    </p>

                    <DemoButton
                        on_click={() => {
                            open_page(
                                page === 'failed'
                                    ? 'gps'
                                    : 'home'
                            );
                        }}
                    >
                        {page === 'failed'
                            ? '재시도하기'
                            : '인형공방으로 돌아가기'}
                    </DemoButton>
                </DemoPanel>
            );
        }

        if (page === 'admin') {
            return (
                <DemoPanel
                    title="운영진 로그인"
                    subtitle="ADMIN DEMONSTRATION"
                >
                    <form
                        className="demo_form"
                        onSubmit={handle_login}
                    >
                        <label className="demo_field">
                            <span>아이디</span>

                            <input
                                value={username}
                                autoComplete="off"
                                onChange={(event) => {
                                    set_username(event.target.value);
                                }}
                            />
                        </label>

                        <label className="demo_field">
                            <span>비밀번호</span>

                            <input
                                type="password"
                                value={password}
                                autoComplete="off"
                                onChange={(event) => {
                                    set_password(event.target.value);
                                }}
                            />
                        </label>

                        {login_error && (
                            <p className="demo_error" role="alert">
                                {login_error}
                            </p>
                        )}

                        <DemoButton type="submit">
                            로그인
                        </DemoButton>
                    </form>

                    <p className="demo_description">
                        테스트 계정: admin / test
                    </p>
                </DemoPanel>
            );
        }

        if (page === 'dashboard') {
            return (
                <>
                    <div className="demo_navigation">
                        <DemoButton
                            on_click={() => open_page('dashboard')}
                        >
                            운영 대시보드
                        </DemoButton>

                        <DemoButton
                            secondary={true}
                            on_click={() => open_page('distribution')}
                        >
                            특전 지급 관리
                        </DemoButton>
                    </div>

                    <AdminDashboard
                        inventory={inventory}
                        on_open_reward={() => {
                            open_page('distribution');
                        }}
                    />
                </>
            );
        }

        if (page === 'distribution') {
            return (
                <DemoPanel
                    title="특전 지급 관리"
                    subtitle="REWARD DEMONSTRATION"
                >
                    <div className="demo_navigation">
                        <DemoButton
                            secondary={true}
                            on_click={() => open_page('dashboard')}
                        >
                            대시보드
                        </DemoButton>

                        <DemoButton
                            on_click={() => open_page('distribution')}
                        >
                            지급 관리
                        </DemoButton>
                    </div>

                    <p className="demo_description">
                        남은 특전 재고: {remaining_stock}개
                    </p>

                    <label className="demo_field">
                        <span>테스트 참여자</span>

                        <select
                            value={participant_id}
                            onChange={(event) => {
                                set_confirm_open(false);
                                set_participant_id(event.target.value);
                            }}
                        >
                            {inventory.participants.map(
                                (item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.id}
                                    </option>
                                )
                            )}
                        </select>
                    </label>

                    {participant && (
                        <>
                            <div className="demo_stamp_grid">
                                {admin_reward_config.stations.map(
                                    (item) => (
                                        <div
                                            className="demo_stamp"
                                            key={item.id}
                                        >
                                            <strong>
                                                {item.name}
                                            </strong>

                                            <span>
                                                {participant.stamps.includes(item.id)
                                                    ? '인증 완료'
                                                    : '미인증'}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>

                            <p className="demo_description">
                                {participant.claimed
                                    ? '이미 특전을 수령한 참여자입니다.'
                                    : !completed
                                        ? '단추 수집 미완료'
                                        : remaining_stock <= 0
                                            ? '특전 재고 소진'
                                            : '특전 지급 가능'}
                            </p>
                        </>
                    )}

                    <DemoButton
                        disabled={!eligible}
                        on_click={() => set_confirm_open(true)}
                    >
                        특전 지급 처리
                    </DemoButton>

                    {confirm_open && (
                        <div
                            className="demo_modal_overlay"
                            onClick={() => set_confirm_open(false)}
                        >
                            <section
                                className="demo_panel demo_modal"
                                role="dialog"
                                aria-modal="true"
                                aria-label="특전 지급 확인"
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                            >
                                <h2 className="demo_panel_title">
                                    특전 지급 확인
                                </h2>

                                <p className="demo_description">
                                    {participant_id} 참여자에게
                                    가상 특전 1개를 지급합니다.
                                </p>

                                <DemoButton on_click={issue_reward}>
                                    지급 확정
                                </DemoButton>

                                <DemoButton
                                    secondary={true}
                                    on_click={() => {
                                        set_confirm_open(false);
                                    }}
                                >
                                    취소
                                </DemoButton>
                            </section>
                        </div>
                    )}
                </DemoPanel>
            );
        }

        if (page === 'issued') {
            return (
                <DemoPanel
                    title="특전 지급 완료"
                    subtitle="DISTRIBUTION COMPLETE"
                >
                    <div className="demo_status_symbol">
                        ✓
                    </div>

                    <p className="demo_description">
                        가상 지급 완료 상태입니다.
                    </p>

                    <DemoButton
                        on_click={() => open_page('dashboard')}
                    >
                        운영 대시보드 확인
                    </DemoButton>

                    <DemoButton
                        secondary={true}
                        on_click={() => open_page('distribution')}
                    >
                        다음 참여자 조회
                    </DemoButton>
                </DemoPanel>
            );
        }

        return demo_groups.map(
            (group) => (
                <DemoPanel
                    key={group.title}
                    title={group.title}
                >
                    <div className="demo_menu">
                        {group.pages.map(
                            ([id, title, description]) => (
                                <button
                                    type="button"
                                    className="demo_menu_item"
                                    key={id}
                                    onClick={() => open_page(id)}
                                >
                                    <div>
                                        <strong>{title}</strong>
                                        <small>{description}</small>
                                    </div>

                                    <span aria-hidden="true">
                                        ›
                                    </span>
                                </button>
                            )
                        )}
                    </div>
                </DemoPanel>
            )
        );
    }

    return (
        <div className="demo_shell">
            <div className="demo_toolbar">
                <button
                    type="button"
                    onClick={() => open_page()}
                >
                    ← 시연 목록
                </button>

                <span>DEMO</span>

                <button
                    type="button"
                    onClick={reset_demo}
                >
                    초기화
                </button>
            </div>

            {scene || (
                <div className="demo_workspace">
                    <AssetImage
                        name="atelier_background_00.webp"
                        class_name="demo_background"
                        alt=""
                        animate={false}
                        data_mode="normal"
                    />

                    <header className="demo_heading">
                        <p>MARY’S BUTTON TOUR</p>

                        <h1>메리의 잃어버린 단추</h1>

                        <small>프로젝트 시연 및 검수</small>
                    </header>

                    {render_content()}

                    <footer className="demo_footer">
                        실제 행사 데이터와 연결되지 않는 시연 환경입니다.
                    </footer>
                </div>
            )}
        </div>
    );
}