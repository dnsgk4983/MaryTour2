import {
    useEffect,
    useRef
} from 'react';

import AdminIcon from './AdminIcon.jsx';

export default function AdminConfirmDialog({
    open,
    title,
    description,
    children,
    confirm_label = '확인',
    on_confirm,
    on_close
}) {
    const dialog_ref = useRef(null);

    useEffect(() => {
        const dialog = dialog_ref.current;

        if (!dialog) {
            return;
        }

        if (open && !dialog.open) {
            dialog.showModal();
        }

        if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog
            ref={dialog_ref}
            className="admin_dialog"
            aria-labelledby="admin_dialog_title"
            onCancel={(event) => {
                event.preventDefault();
                on_close();
            }}
        >
            <div className="admin_dialog_content">
                <div className="admin_dialog_icon">
                    <AdminIcon name="shield" />
                </div>

                <h2 id="admin_dialog_title">
                    {title}
                </h2>

                <p className="admin_dialog_description">
                    {description}
                </p>

                {children}

                <div className="admin_dialog_actions">
                    <button
                        type="button"
                        className="admin_button admin_button_outline"
                        onClick={on_close}
                        autoFocus
                    >
                        취소
                    </button>

                    <button
                        type="button"
                        className="admin_button admin_button_primary"
                        onClick={on_confirm}
                    >
                        {confirm_label}
                    </button>
                </div>
            </div>
        </dialog>
    );
}