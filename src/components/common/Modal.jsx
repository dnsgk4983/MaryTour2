import {
    useEffect,
    useRef
} from 'react';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import AssetImage from './AssetImage.jsx';

gsap.registerPlugin(useGSAP);

export default function Modal({
    open,
    on_close,
    title,
    children,
    data_mode = 'normal',
    variant = 'default',
    subtitle = ''
}) {
    const dialog_ref = useRef(null);
    const panel_ref = useRef(null);
    const closing_ref = useRef(false);

    const collection_variant = variant === 'collection';

    const reduced_motion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    const use_animation = (
        data_mode !== 'low' &&
        !reduced_motion
    );

    useEffect(() => {
        const dialog = dialog_ref.current;

        if (!dialog) {
            return;
        }

        if (open && !dialog.open) {
            closing_ref.current = false;
            dialog.showModal();
        }

        if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    const { contextSafe } = useGSAP(() => {
        if (!open || !use_animation) {
            return;
        }

        gsap.fromTo(
            panel_ref.current,
            {
                opacity: 0,
                scale: 0.96,
                y: 12
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: true
            }
        );
    }, {
        scope: dialog_ref,
        dependencies: [open, use_animation],
        revertOnUpdate: true
    });

    const close_modal = contextSafe(() => {
        if (closing_ref.current) {
            return;
        }

        closing_ref.current = true;

        if (!use_animation) {
            on_close();
            return;
        }

        gsap.to(panel_ref.current, {
            opacity: 0,
            scale: 0.97,
            y: 8,
            duration: 0.22,
            ease: 'power2.in',
            overwrite: true,
            onComplete: on_close
        });
    });

    const modal_classes = [
        'modal',
        `modal_${variant}`,
        use_animation
            ? 'motion_enabled'
            : 'motion_disabled'
    ].join(' ');

    return (
        <dialog
            className={modal_classes}
            ref={dialog_ref}
            aria-label={title}
            onCancel={(event) => {
                event.preventDefault();
                close_modal();
            }}
            onClose={() => {
                if (open) {
                    on_close();
                }
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    close_modal();
                }
            }}
        >
            <div
                className="modal_panel"
                ref={panel_ref}
            >
                {open && (
                    <>
                        {collection_variant ? (
                            <AssetImage
                                name="ui_ribbon.webp"
                                class_name="modal_ribbon"
                                alt=""
                                animate={false}
                                data_mode={data_mode}
                            />
                        ) : (
                            <AssetImage
                                name="ui_modal_frame.webp"
                                class_name="modal_background"
                                animate={false}
                                data_mode={data_mode}
                            />
                        )}

                        {collection_variant && (
                            <button
                                type="button"
                                className="modal_close_icon"
                                aria-label="팝업 닫기"
                                onClick={close_modal}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    aria-hidden="true"
                                >
                                    <path d="M6 6l12 12" />
                                    <path d="M18 6L6 18" />
                                </svg>
                            </button>
                        )}

                        <div className="modal_content">
                            <header className="modal_heading">
                                {subtitle && (
                                    <p className="modal_subtitle">
                                        {subtitle}
                                    </p>
                                )}

                                <h2 className="modal_title">
                                    {title}
                                </h2>
                            </header>

                            {children}

                            {!collection_variant && (
                                <button
                                    type="button"
                                    className="modal_close"
                                    onClick={close_modal}
                                >
                                    닫기
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </dialog>
    );
}