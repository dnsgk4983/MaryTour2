const production_origin = 'https://dnsgk4983.github.io';

const production_path = '/MaryTour2/';

const token_pattern = /^[A-Za-z0-9_-]{16,128}$/;

export function validate_qr_url(decoded_text) {
    if (typeof decoded_text !== 'string') {
        return null;
    }

    try {
        const url = new URL(decoded_text.trim());

        const local_origin = window.location.origin;

        const local_path = import.meta.env.BASE_URL;

        const production_allowed = (
            url.origin === production_origin &&
            url.pathname === production_path
        );

        const local_allowed = (
            import.meta.env.DEV &&
            url.origin === local_origin &&
            url.pathname === local_path
        );

        if (!production_allowed && !local_allowed) {
            return null;
        }

        if (
            url.username ||
            url.password ||
            url.search
        ) {
            return null;
        }

        const route_match = url.hash.match(
            /^#\/check\/([A-Za-z0-9_-]+)$/
        );

        if (!route_match) {
            return null;
        }

        const token = route_match[1];

        if (!token_pattern.test(token)) {
            return null;
        }

        return {
            token,
            route: `/check/${token}`
        };
    } catch {
        return null;
    }
}