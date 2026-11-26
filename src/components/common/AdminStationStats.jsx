export default function AdminStationStats({
    stations,
    total
}) {
    return (
        <section className="admin_card admin_station_stats">
            <header className="admin_card_heading">
                <h2>역별 인증 현황</h2>

                <span>STATION VERIFICATION</span>
            </header>

            <div className="admin_station_stats_list">
                {stations.map(
                    (station) => (
                        <article
                            key={station.id}
                            className="admin_station_stat"
                        >
                            <div className="admin_station_stat_heading">
                                <strong>
                                    {station.name}
                                </strong>

                                <span>
                                    {station.count} / {total}명
                                </span>
                            </div>

                            <progress
                                className="admin_stock_progress"
                                max={100}
                                value={station.rate}
                                aria-label={`${station.name} 인증률`}
                            />

                            <div className="admin_station_stat_caption">
                                <span>인증 완료</span>

                                <strong>
                                    {station.rate}%
                                </strong>
                            </div>
                        </article>
                    )
                )}
            </div>
        </section>
    );
}