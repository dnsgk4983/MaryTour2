import {
    useEffect,
    useRef,
    useState
} from 'react';

import AssetImage from './AssetImage.jsx';
import AdminField from './AdminField.jsx';
import AdminIcon from './AdminIcon.jsx';

import {
    admin_config
} from '../../data/admin_config.js';

import {
    sign_in_admin,
    validate_admin_credentials
} from '../../services/admin_auth.js';

export default function AdminLogin({
    preview = false,
    on_back,
    on_preview_success
}) {
    const mounted_ref = useRef(false);

    const busy_ref = useRef(false);

    const [username, set_username] = useState('');

    const [password, set_password] = useState('');

    const [errors, set_errors] = useState({});

    const [loading, set_loading] = useState(false);

    const [result, set_result] = useState(null);

    useEffect(() => {
        mounted_ref.current = true;

        return () => {
            mounted_ref.current = false;
        };
    }, []);

    function update_username(value) {
        set_username(value);

        set_errors((previous) => ({
            ...previous,
            username: undefined
        }));

        set_result(null);
    }

    function update_password(value) {
        set_password(value);

        set_errors((previous) => ({
            ...previous,
            password: undefined
        }));

        set_result(null);
    }

    async function handle_submit(event) {
        event.preventDefault();

        if (busy_ref.current) {
            return;
        }

        const validation = validate_admin_credentials({
            username,
            password
        });

        set_errors(validation.errors);

        set_result(null);

        if (!validation.valid) {
            return;
        }

        busy_ref.current = true;

        set_loading(true);

        try {
            const response = await sign_in_admin({
                username: username.trim(),
                password,
                preview
            });

            if (!mounted_ref.current) {
                return;
            }

            set_result(response);

            set_password('');

            if (
                import.meta.env.DEV &&
                preview &&
                response.success &&
                response.preview &&
                response.code === 'PREVIEW_SUCCESS'
            ) {
                on_preview_success?.(response);
            }
        } catch {
            if (!mounted_ref.current) {
                return;
            }

            set_result({
                success: false,
                message: '요청을 처리하지 못했습니다. 다시 시도해 주세요.'
            });
        } finally {
            busy_ref.current = false;

            if (mounted_ref.current) {
                set_loading(false);
            }
        }
    }

    return (
        <section className="admin_shell">
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

            <div className="admin_login_container">
                <header className="admin_brand">
                    <div className="admin_brand_icon">
                        <AdminIcon name="shield" />
                    </div>

                    <h1>
                        {admin_config.project_name}
                    </h1>

                    <p>
                        {admin_config.project_description}
                    </p>
                </header>

                <main className="admin_login_panel">
                    <AssetImage
                        name="ui_ribbon.webp"
                        class_name="admin_ribbon"
                        alt=""
                        animate={false}
                        data_mode="normal"
                    />

                    <header className="admin_login_heading">
                        <p className="admin_eyebrow">
                            ADMINISTRATOR
                        </p>

                        <h2>
                            {admin_config.login_title}
                        </h2>

                        <p>
                            {admin_config.login_description}
                        </p>
                    </header>

                    <div
                        className="admin_divider"
                        aria-hidden="true"
                    >
                        <span />
                        <i />
                        <span />
                    </div>

                    <form
                        className="admin_login_form"
                        onSubmit={handle_submit}
                        noValidate
                        aria-busy={loading}
                    >
                        <AdminField
                            label="아이디"
                            name="username"
                            value={username}
                            placeholder="아이디를 입력해 주세요."
                            auto_complete={
                                preview
                                    ? 'off'
                                    : 'username'
                            }
                            error={errors.username}
                            disabled={loading}
                            on_change={update_username}
                        />

                        <AdminField
                            label="비밀번호"
                            name="password"
                            type="password"
                            value={password}
                            placeholder="비밀번호를 입력해 주세요."
                            auto_complete={
                                preview
                                    ? 'off'
                                    : 'current-password'
                            }
                            error={errors.password}
                            disabled={loading}
                            on_change={update_password}
                        />

                        <div
                            className="admin_feedback_slot"
                            aria-live="polite"
                        >
                            {result && (
                                <div
                                    className={[
                                        'admin_feedback',
                                        result.success
                                            ? 'admin_feedback_success'
                                            : 'admin_feedback_error'
                                    ].join(' ')}
                                    role={
                                        result.success
                                            ? 'status'
                                            : 'alert'
                                    }
                                >
                                    <AdminIcon
                                        name={
                                            result.success
                                                ? 'check'
                                                : 'alert'
                                        }
                                    />

                                    <p>
                                        {result.message}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="admin_button admin_button_primary"
                            disabled={loading}
                        >
                            {loading && (
                                <span
                                    className="admin_spinner"
                                    aria-hidden="true"
                                />
                            )}

                            {loading
                                ? '확인 중...'
                                : '로그인'}
                        </button>
                    </form>

                    <div className="admin_security_notice">
                        <AdminIcon name="shield" />

                        <span>
                            운영진 전용 시스템입니다.
                        </span>
                    </div>
                </main>

                {preview && (
                    <button
                        type="button"
                        className="admin_button admin_button_text"
                        onClick={on_back}
                    >
                        <AdminIcon name="arrow_left" />

                        미리보기 종료
                    </button>
                )}

                <footer className="admin_footer">
                    <p>
                        MARYTOUR · EVENT OPERATIONS
                    </p>

                    {preview && (
                        <span>
                            DEVELOPMENT PREVIEW
                        </span>
                    )}
                </footer>
            </div>
        </section>
    );
}