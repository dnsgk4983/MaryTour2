import {
    admin_config
} from '../data/admin_config.js';

export function validate_admin_credentials({
    username,
    password
}) {
    const errors = {};

    if (!String(username || '').trim()) {
        errors.username = '아이디를 입력해 주세요.';
    }

    if (!String(password || '')) {
        errors.password = '비밀번호를 입력해 주세요.';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

export async function sign_in_admin({
    username,
    password,
    preview = false
}) {
    const validation = validate_admin_credentials({
        username,
        password
    });

    if (!validation.valid) {
        return {
            success: false,
            authenticated: false,
            preview: false,
            code: 'INVALID_INPUT',
            message: '입력 정보를 확인해 주세요.'
        };
    }

    if (
        preview &&
        admin_config.preview_enabled
    ) {
        await new Promise((resolve) => {
            window.setTimeout(resolve, 450);
        });

        if (
            username.trim() === 'admin' &&
            password === 'test'
        ) {
            return {
                success: true,
                authenticated: false,
                preview: true,
                code: 'PREVIEW_SUCCESS',
                message: '테스트 로그인에 성공했습니다.'
            };
        }

        return {
            success: false,
            authenticated: false,
            preview: true,
            code: 'INVALID_CREDENTIALS',
            message: '아이디 또는 비밀번호가 일치하지 않습니다.'
        };
    }

    return {
        success: false,
        authenticated: false,
        preview: false,
        code: 'AUTH_NOT_CONNECTED',
        message: '관리자 인증 서비스가 아직 연결되지 않았습니다.'
    };
}

export async function get_admin_session() {
    return null;
}

export async function sign_out_admin() {
    return {
        success: true
    };
}