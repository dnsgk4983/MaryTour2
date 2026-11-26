import Button from './Button.jsx';
import AssetImage from './AssetImage.jsx';

export default function ImageButton({
    children,
    variant = 'primary',
    class_name = '',
    data_mode = 'normal',
    ...props
}) {
    const image_name = variant === 'secondary'
        ? 'ui_button_secondary.webp'
        : 'ui_button_primary.webp';

    const classes = [
        'btn_image',
        data_mode === 'low'
            ? 'motion_disabled'
            : 'motion_enabled',
        class_name
    ].filter(Boolean).join(' ');

    return (
        <Button
            {...props}
            variant={variant}
            class_name={classes}
        >
            <AssetImage
                name={image_name}
                class_name="btn_image_background"
                animate={false}
                data_mode={data_mode}
            />

            <span
                className="btn_reflection"
                aria-hidden="true"
            />

            <span className="btn_image_content">
                {children}
            </span>
        </Button>
    );
}