let scanner_queue = Promise.resolve();

function enqueue_scanner(task) {
    const result = scanner_queue.then(
        task,
        task
    );

    scanner_queue = result.catch(() => {});

    return result;
}

export function create_qr_scanner({
    element_id,
    on_scan
}) {
    let scanner = null;
    let started = false;
    let disposed = false;
    let stop_promise = null;

    async function release_scanner() {
        if (!scanner) {
            return;
        }

        if (started || scanner.isScanning) {
            await scanner.stop();

            started = false;
        }

        scanner.clear();

        scanner = null;
    }

    function start() {
        return enqueue_scanner(async () => {
            if (disposed) {
                return false;
            }

            if (started) {
                return true;
            }

            if (!window.isSecureContext) {
                throw new Error('INSECURE_CONTEXT');
            }

            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('CAMERA_UNSUPPORTED');
            }

            const {
                Html5Qrcode,
                Html5QrcodeSupportedFormats
            } = await import('html5-qrcode');

            if (disposed) {
                return false;
            }

            scanner = new Html5Qrcode(
                element_id,
                {
                    formatsToSupport: [
                        Html5QrcodeSupportedFormats.QR_CODE
                    ],
                    verbose: false
                }
            );

            try {
                await scanner.start(
                    {
                        facingMode: {
                            ideal: 'environment'
                        }
                    },
                    {
                        fps: 10,
                        disableFlip: false
                    },
                    (decoded_text) => {
                        if (!disposed) {
                            on_scan(decoded_text);
                        }
                    },
                    () => {}
                );

                started = true;

                if (disposed) {
                    await release_scanner();

                    return false;
                }

                return true;
            } catch (error) {
                try {
                    await release_scanner();
                } catch (cleanup_error) {
                    console.error(
                        'QR scanner cleanup failed:',
                        cleanup_error
                    );
                }

                throw error;
            }
        });
    }

    function stop() {
        disposed = true;

        if (!stop_promise) {
            stop_promise = enqueue_scanner(
                release_scanner
            ).catch((error) => {
                stop_promise = null;

                throw error;
            });
        }

        return stop_promise;
    }

    return {
        start,
        stop
    };
}

export function get_camera_error(error) {
    const message = String(
        error?.message || error || ''
    );

    const name = error?.name || '';

    const detail = `${name} ${message}`;

    if (detail.includes('INSECURE_CONTEXT')) {
        return '보안 연결(HTTPS)에서 카메라를 사용할 수 있어요.';
    }

    if (detail.includes('CAMERA_UNSUPPORTED')) {
        return '현재 브라우저는 카메라 기능을 지원하지 않아요.';
    }

    if (
        /NotAllowedError|PermissionDenied|permission denied|permission dismissed/i.test(detail)
    ) {
        return '카메라 권한이 필요해요. 브라우저 설정에서 카메라 사용을 허용해주세요.';
    }

    if (
        /NotFoundError|DevicesNotFound|no camera/i.test(detail)
    ) {
        return '사용 가능한 카메라를 찾지 못했어요.';
    }

    if (
        /NotReadableError|TrackStartError|Could not start video source/i.test(detail)
    ) {
        return '카메라가 다른 앱에서 사용 중이거나 접근할 수 없어요.';
    }

    if (
        /OverconstrainedError|ConstraintNotSatisfied/i.test(detail)
    ) {
        return '현재 카메라 설정을 사용할 수 없어요.';
    }

    return '카메라를 실행하지 못했어요. 다시 시도해주세요.';
}