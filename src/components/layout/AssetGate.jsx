import { useState } from 'react';

import Loading from '../common/Loading.jsx';
import PageTransition from './PageTransition.jsx';

import use_asset_loader from '../../hooks/use_asset_loader.js';

import { get_page_assets } from '../../data/assets.js';

export default function AssetGate({
    children,
    group_name,
    data_mode
}) {
    const [skip, set_skip] = useState(false);

    const urls = get_page_assets(
        group_name,
        data_mode
    );

    const {
        progress,
        status,
        retry
    } = use_asset_loader(urls);

    const is_ready = (
        urls.length === 0 ||
        status === 'complete' ||
        skip
    );

    if (!is_ready) {
        return (
            <Loading
                progress={progress}
                status={status}
                data_mode={data_mode}
                on_retry={retry}
                on_skip={() => set_skip(true)}
            />
        );
    }

    return (
        <PageTransition data_mode={data_mode}>
            {children}
        </PageTransition>
    );
}