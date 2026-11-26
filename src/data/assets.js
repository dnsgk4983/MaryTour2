const image_modules = import.meta.glob(
    '../assets/images/**/*.{webp,avif,svg}',
    {
        eager: true,
        query: '?url',
        import: 'default'
    }
);

export const assets = Object.fromEntries(
    Object.entries(image_modules).map(([path, url]) => [
        path.replace('../assets/images/', ''),
        url
    ])
);

export const asset_groups = {
    loading: [
        'loading_background.webp',
        'loading_button.webp',
        'loading_thread.webp'
    ],

    splash: [
        'splash_background.webp',
        'splash_title_frame.webp'
    ],

    home: [
        'atelier_background_00.webp'
    ],

    scanner: [],

    check: [
        'check_background.webp'
    ],

    reward: [],

    admin: []
};

export const deferred_asset_groups = {
    splash: [
        'splash_mary.webp',
        'splash_book.webp'
    ],

    home: [
        'atelier_mary.webp',
        'button_case.webp',
        'button_empty.webp',
        'button_01.webp',
        'button_02.webp',
        'button_03.webp'
    ],

    scanner: [],

    check: [
        'check_frame.webp',
        'check_sealed_box.webp',
        'check_opened_box.webp'
    ],

    reward: [
        'reward_card.webp',
        'reward_envelope.webp',
        'reward_seal.webp',
        'reward_letter.webp'
    ],

    admin: []
};

export function get_asset(file_name) {
    return assets[file_name] || null;
}

export function get_mode_asset(
    file_name,
    data_mode = 'normal'
) {
    if (data_mode === 'low') {
        const low_file_name = file_name.replace(
            /\.webp$/,
            '_low.webp'
        );

        return get_asset(low_file_name);
    }

    return get_asset(file_name);
}

export function get_page_assets(
    group_name,
    data_mode = 'normal'
) {
    const file_names = asset_groups[group_name] || [];

    return file_names.map((file_name) => {
        return get_mode_asset(
            file_name,
            data_mode
        );
    }).filter(Boolean);
}

export function get_deferred_assets(
    group_name,
    data_mode = 'normal'
) {
    const file_names = deferred_asset_groups[group_name] || [];

    return file_names.map((file_name) => {
        return get_mode_asset(
            file_name,
            data_mode
        );
    }).filter(Boolean);
}