import { settings } from '../data/settings.js';

const loaded_assets = new Set();
const pending_assets = new Map();

export function load_asset(url) {
    if (loaded_assets.has(url)) {
        return Promise.resolve(url);
    }

    if (pending_assets.has(url)) {
        return pending_assets.get(url);
    }

    const request = new Promise((resolve, reject) => {
        const image = new Image();

        function cleanup() {
            clearTimeout(timer);
            image.onload = null;
            image.onerror = null;
        }

        const timer = setTimeout(() => {
            cleanup();
            image.removeAttribute('src');

            reject(new Error(`Loading timeout: ${url}`));
        }, settings.loading.timeout);

        image.onload = () => {
            cleanup();
            loaded_assets.add(url);
            resolve(url);
        };

        image.onerror = () => {
            cleanup();

            reject(new Error(`Loading failed: ${url}`));
        };

        image.src = url;
    }).finally(() => {
        pending_assets.delete(url);
    });

    pending_assets.set(url, request);

    return request;
}

export async function load_assets(
    urls,
    on_progress = () => {}
) {
    const unique_urls = [...new Set(urls)];
    const total = unique_urls.length;
    const failed_assets = [];

    let completed = 0;

    if (total === 0) {
        on_progress(100);

        return {
            success: true,
            failed_assets
        };
    }

    await Promise.all(
        unique_urls.map(async (url) => {
            try {
                await load_asset(url);
            } catch {
                failed_assets.push(url);
            } finally {
                completed += 1;

                on_progress(
                    Math.round(completed / total * 100)
                );
            }
        })
    );

    return {
        success: failed_assets.length === 0,
        failed_assets
    };
}