export default function AdminRate({
    title,
    rate,
    description
}) {
    const radius = 44;

    const circumference = 2 *
        Math.PI *
        radius;

    const offset = circumference *
        (1 - rate / 100);

    return (
        <article className="admin_card admin_rate_card">
            <h2>
                {title}
            </h2>

            <div
                className="admin_rate_chart"
                role="img"
                aria-label={`${title} ${rate}%`}
            >
                <svg
                    viewBox="0 0 108 108"
                    aria-hidden="true"
                >
                    <circle
                        className="admin_rate_track"
                        cx="54"
                        cy="54"
                        r={radius}
                    />

                    <circle
                        className="admin_rate_fill"
                        cx="54"
                        cy="54"
                        r={radius}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90 54 54)"
                    />
                </svg>

                <div className="admin_rate_value">
                    <strong>
                        {rate}
                    </strong>

                    <span>%</span>
                </div>
            </div>

            <p>
                {description}
            </p>
        </article>
    );
}