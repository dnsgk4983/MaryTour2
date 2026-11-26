export default function AdminIcon({
    name,
    class_name = ''
}) {
    const paths = {
        shield: (
            <>
                <path d="M12 3l8 3v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3z" />
                <path d="M8.5 12l2.5 2.5 4.5-5" />
            </>
        ),

        mail: (
            <>
                <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                />
                <path d="M3 7l9 6 9-6" />
            </>
        ),

        lock: (
            <>
                <rect
                    x="5"
                    y="10"
                    width="14"
                    height="11"
                    rx="2"
                />
                <path d="M8 10V7a4 4 0 018 0v3" />
                <path d="M12 14v3" />
            </>
        ),

        eye: (
            <>
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                <circle
                    cx="12"
                    cy="12"
                    r="3"
                />
            </>
        ),

        eye_off: (
            <>
                <path d="M3 3l18 18" />
                <path d="M10 5a11 11 0 012 0c6.5 0 10 7 10 7a17 17 0 01-3 4" />
                <path d="M6 6a17 17 0 00-4 6s3.5 7 10 7a11 11 0 004-.8" />
            </>
        ),

        alert: (
            <>
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />
                <path d="M12 7v6" />
                <path d="M12 16h.01" />
            </>
        ),

        check: (
            <>
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />
                <path d="M8 12l3 3 5-6" />
            </>
        ),

        arrow_left: (
            <>
                <path d="M19 12H5" />
                <path d="M12 5l-7 7 7 7" />
            </>
        )
    };

    return (
        <svg
            className={class_name}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name] || paths.shield}
        </svg>
    );
}