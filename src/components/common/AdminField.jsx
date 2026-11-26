import {
    useId,
    useState
} from 'react';

import AdminIcon from './AdminIcon.jsx';

export default function AdminField({
    label,
    name,
    type = 'text',
    value,
    placeholder,
    auto_complete,
    error,
    disabled = false,
    on_change
}) {
    const field_id = useId();

    const [visible, set_visible] = useState(false);

    const is_password = type === 'password';

    const input_type = (
        is_password &&
        visible
    ) ? 'text' : type;

    const classes = [
        'admin_field_control',
        error ? 'admin_field_invalid' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className="admin_field">
            <label
                className="admin_field_label"
                htmlFor={field_id}
            >
                {label}
            </label>

            <div className={classes}>
                {is_password ? (
                    <AdminIcon
                        name="lock"
                        class_name="admin_field_icon"
                    />
                ) : (
                    <svg
                        className="admin_field_icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <circle
                            cx="12"
                            cy="8"
                            r="4"
                        />

                        <path d="M4 21v-2a8 8 0 0116 0v2" />
                    </svg>
                )}

                <input
                    id={field_id}
                    name={name}
                    type={input_type}
                    value={value}
                    placeholder={placeholder}
                    autoComplete={auto_complete}
                    autoCapitalize="none"
                    spellCheck={false}
                    disabled={disabled}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                        error
                            ? `${field_id}_error`
                            : undefined
                    }
                    onChange={(event) => {
                        on_change(event.target.value);
                    }}
                />

                {is_password && (
                    <button
                        type="button"
                        className="admin_field_toggle"
                        aria-label={
                            visible
                                ? '비밀번호 숨기기'
                                : '비밀번호 표시'
                        }
                        aria-pressed={visible}
                        disabled={disabled}
                        onClick={() => {
                            set_visible((previous) => !previous);
                        }}
                    >
                        <AdminIcon
                            name={
                                visible
                                    ? 'eye_off'
                                    : 'eye'
                            }
                        />
                    </button>
                )}
            </div>

            {error && (
                <p
                    id={`${field_id}_error`}
                    className="admin_field_error"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
}