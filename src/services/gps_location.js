import {
    gps_test_config
} from '../data/gps_test.js';

const earth_radius = 6371000;

function to_radian(value) {
    return value * Math.PI / 180;
}

export function calculate_distance(
    latitude_1,
    longitude_1,
    latitude_2,
    longitude_2
) {
    const delta_latitude = to_radian(
        latitude_2 - latitude_1
    );

    const delta_longitude = to_radian(
        longitude_2 - longitude_1
    );

    const a = (
        Math.sin(delta_latitude / 2) ** 2 +
        Math.cos(to_radian(latitude_1)) *
        Math.cos(to_radian(latitude_2)) *
        Math.sin(delta_longitude / 2) ** 2
    );

    const safe_a = Math.min(
        1,
        Math.max(0, a)
    );

    return (
        earth_radius *
        2 *
        Math.atan2(
            Math.sqrt(safe_a),
            Math.sqrt(1 - safe_a)
        )
    );
}

export function verify_station_location(station) {
    return new Promise((resolve, reject) => {
        if (!gps_test_config.enabled) {
            reject(new Error('TEST_DISABLED'));

            return;
        }

        if (!window.isSecureContext) {
            reject(new Error('INSECURE_CONTEXT'));

            return;
        }

        if (!navigator.geolocation) {
            reject(new Error('GPS_UNSUPPORTED'));

            return;
        }

        let watch_id = null;
        let timeout_id = null;
        let settled = false;
        let best_result = null;

        function finish(result, error = null) {
            if (settled) {
                return;
            }

            settled = true;

            if (watch_id !== null) {
                navigator.geolocation.clearWatch(
                    watch_id
                );
            }

            window.clearTimeout(timeout_id);

            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        }

        function handle_position(position) {
            const {
                latitude,
                longitude,
                accuracy
            } = position.coords;

            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude) ||
                !Number.isFinite(accuracy) ||
                accuracy < 0
            ) {
                return;
            }

            const distance = calculate_distance(
                latitude,
                longitude,
                station.latitude,
                station.longitude
            );

            const accurate = (
                accuracy <= gps_test_config.maximum_accuracy
            );

            const result = {
                distance,
                accuracy,
                accurate,
                success: (
                    accurate &&
                    distance <= gps_test_config.radius
                )
            };

            if (
                !best_result ||
                result.accuracy < best_result.accuracy
            ) {
                best_result = result;
            }

            if (accurate) {
                finish(result);
            }
        }

        timeout_id = window.setTimeout(() => {
            if (best_result) {
                finish(best_result);
            } else {
                finish(
                    null,
                    new Error('GPS_TIMEOUT')
                );
            }
        }, gps_test_config.timeout);

        try {
            watch_id = navigator.geolocation.watchPosition(
                handle_position,
                (error) => {
                    if (error.code === 1) {
                        finish(null, error);
                    }
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: gps_test_config.timeout
                }
            );
        } catch (error) {
            finish(null, error);
        }
    });
}

export function get_gps_error(error) {
    if (error?.code === 1) {
        return '위치 권한을 허용한 후 다시 시도해주세요.';
    }

    if (error?.code === 2) {
        return '현재 위치를 확인하지 못했어요.';
    }

    if (
        error?.code === 3 ||
        error?.message === 'GPS_TIMEOUT'
    ) {
        return '위치 확인 시간이 초과되었어요. 지상에서 다시 시도해주세요.';
    }

    if (error?.message === 'INSECURE_CONTEXT') {
        return 'HTTPS 보안 연결이 필요해요.';
    }

    if (error?.message === 'GPS_UNSUPPORTED') {
        return '위치 인증을 지원하지 않는 브라우저예요.';
    }

    return '위치 인증 또는 기록 저장에 실패했어요.';
}