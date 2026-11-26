export default function Title({
    children,
    subtitle,
    class_name = ''
}) {
    return (
        <header className={`title_group ${class_name}`.trim()}>
            {subtitle && (
                <p className="subtitle">
                    {subtitle}
                </p>
            )}

            <h1 className="title">
                {children}
            </h1>
        </header>
    );
}