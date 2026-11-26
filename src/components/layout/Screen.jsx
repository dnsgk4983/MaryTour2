export default function Screen({
    children,
    class_name = ''
}) {
    return (
        <section className={`screen ${class_name}`.trim()}>
            {children}
        </section>
    );
}