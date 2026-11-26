import {
    admin_menu
} from '../../data/admin_dashboard.js';

export default function AdminNavigation({
    active,
    on_change
}) {
    return (
        <nav
            className="admin_navigation"
            aria-label="관리자 메뉴"
        >
            {admin_menu.map(
                (item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={[
                            'admin_navigation_item',
                            active === item.id
                                ? 'admin_navigation_active'
                                : ''
                        ].filter(Boolean).join(' ')}
                        aria-current={
                            active === item.id
                                ? 'page'
                                : undefined
                        }
                        onClick={() => {
                            on_change(item.id);
                        }}
                    >
                        {item.label}
                    </button>
                )
            )}
        </nav>
    );
}