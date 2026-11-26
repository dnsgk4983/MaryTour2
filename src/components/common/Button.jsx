export default function Button({
    children,
    variant = 'primary',
    class_name = '',
    type = 'button',
    ...props
}) {
    const classes = [
        'btn',
        `btn_${variant}`,
        class_name
    ].filter(Boolean).join(' ');

    return (
        <button
            {...props}
            className={classes}
            type={type}
        >
            {children}
        </button>
    );
}