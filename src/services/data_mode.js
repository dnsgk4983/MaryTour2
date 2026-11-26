import { settings } from '../data/settings.js';

export function get_data_mode() {
    try {
        const saved_mode = localStorage.getItem(
            settings.storage_key
        );

        if (
            saved_mode === settings.data_mode.normal ||
            saved_mode === settings.data_mode.low
        ) {
            return saved_mode;
        }
    } catch {
        // 저장소 접근 실패 시 기본 설정 사용
    }

    if (navigator.connection?.saveData) {
        return settings.data_mode.low;
    }

    return settings.data_mode.normal;
}

export function set_data_mode(mode) {
    if (
        mode !== settings.data_mode.normal &&
        mode !== settings.data_mode.low
    ) {
        return false;
    }

    try {
        localStorage.setItem(
            settings.storage_key,
            mode
        );

        return true;
    } catch {
        return false;
    }
}