export default function AdminMetric({
    label,
    value,
    unit = '명',
    description,
    highlight = false
}) {
    return (
        <article
            className={[
                'admin_card',
                'admin_dashboard_metric',
                highlight
                    ? 'admin_dashboard_metric_highlight'
                    : ''
            ].filter(Boolean).join(' ')}
        >
            <p className="admin_dashboard_metric_label">
                {label}
            </p>

            <div className="admin_dashboard_metric_value">
                <strong>
                    {value.toLocaleString('ko-KR')}
                </strong>

                <span>
                    {unit}
                </span>
            </div>

            {description && (
                <small>
                    {description}
                </small>
            )}
        </article>
    );
}