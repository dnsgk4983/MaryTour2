export default function DemoPanel({
    title,
    subtitle,
    children
}) {
    return (
        <section className="demo_panel">
            {subtitle && (
                <p className="demo_subtitle">
                    {subtitle}
                </p>
            )}

            <h2 className="demo_panel_title">
                {title}
            </h2>

            {children}
        </section>
    );
}