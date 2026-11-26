import { useEffect, useState } from 'react';

import { load_assets } from '../services/asset_loader.js';

export default function use_asset_loader(urls) {
    const [progress, set_progress] = useState(0);
    const [status, set_status] = useState('loading');
    const [attempt, set_attempt] = useState(0);
    const [failed_assets, set_failed_assets] = useState([]);

    const asset_key = JSON.stringify(urls);

    useEffect(() => {
        let active = true;

        const current_urls = JSON.parse(asset_key);

        set_progress(0);
        set_status('loading');
        set_failed_assets([]);

        load_assets(current_urls, (value) => {
            if (active) {
                set_progress(value);
            }
        }).then((result) => {
            if (!active) {
                return;
            }

            set_failed_assets(result.failed_assets);

            set_status(
                result.success ? 'complete' : 'error'
            );
        }).catch(() => {
            if (active) {
                set_status('error');
            }
        });

        return () => {
            active = false;
        };
    }, [asset_key, attempt]);

    function retry() {
        set_attempt((previous) => previous + 1);
    }

    return {
        progress,
        status,
        failed_assets,
        retry
    };
}