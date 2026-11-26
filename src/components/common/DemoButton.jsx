export default function DemoButton({
    children,
    on_click,
    disabled = false,
    secondary = false,
    type = 'button'
}) {
    return (
        <button
            type={type}
            className={[
                'demo_button',
                secondary
                    ? 'demo_button_secondary'
                    : ''
            ].filter(Boolean).join(' ')}
            disabled={disabled}
            onClick={on_click}
        >
            {children}
        </button>
    );
}