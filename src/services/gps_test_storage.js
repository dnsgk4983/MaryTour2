import {
    gps_test_config,
    test_stations
} from '../data/gps_test.js';

import {
    stamp_list
} from '../data/stamps.js';

export function get_test_records() {
    if (!gps_test_config.enabled) {
        return [];
    }

    try {
        const value = localStorage.getItem(
            gps_test_config.storage_key
        );

        const records = JSON.parse(
            value || '[]'
        );

        if (!Array.isArray(records)) {
            return [];
        }

        return records.filter((record) => {
            return (
                record &&
                test_stations.some(
                    (station) => station.slot === record.slot
                ) &&
                Number.isFinite(record.collected_at)
            );
        });
    } catch {
        return [];
    }
}

export function get_test_stamps() {
    return [
        ...new Set(
            get_test_records()
                .map((record) => {
                    return stamp_list[record.slot]?.id;
                })
                .filter(Boolean)
        )
    ];
}

export function save_test_stamp(slot) {
    if (!gps_test_config.enabled) {
        throw new Error('TEST_DISABLED');
    }

    const valid_station = test_stations.some(
        (station) => station.slot === slot
    );

    if (!valid_station) {
        throw new Error('INVALID_STATION');
    }

    const records = get_test_records();

    if (records.some((record) => record.slot === slot)) {
        return records;
    }

    const next_records = [
        ...records,
        {
            slot,
            collected_at: Date.now()
        }
    ];

    localStorage.setItem(
        gps_test_config.storage_key,
        JSON.stringify(next_records)
    );

    return next_records;
}

export function reset_test_stamps() {
    localStorage.removeItem(
        gps_test_config.storage_key
    );
}