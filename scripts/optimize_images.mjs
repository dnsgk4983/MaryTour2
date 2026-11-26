import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root_path = process.cwd();

const original_path = path.join(
    root_path,
    'resources/images/original'
);

const output_path = path.join(
    root_path,
    'src/assets/images'
);

const supported_extensions = [
    '.png',
    '.jpg',
    '.jpeg'
];

const image_modes = [
    {
        suffix: '',
        width: 1080,
        quality: 85
    },
    {
        suffix: '_low',
        width: 540,
        quality: 65
    }
];

async function get_image_files(directory) {
    const entries = await fs.readdir(directory, {
        withFileTypes: true
    });

    const files = [];

    for (const entry of entries) {
        const entry_path = path.join(
            directory,
            entry.name
        );

        if (entry.isDirectory()) {
            const nested_files = await get_image_files(
                entry_path
            );

            files.push(...nested_files);

            continue;
        }

        const extension = path.extname(
            entry.name
        ).toLowerCase();

        if (supported_extensions.includes(extension)) {
            files.push(entry_path);
        }
    }

    return files;
}

function format_size(bytes) {
    return `${(bytes / 1024).toFixed(2)} KB`;
}

async function preserve_originals() {
    const files = await get_image_files(output_path);

    for (const file of files) {
        const relative_path = path.relative(
            output_path,
            file
        );

        const destination = path.join(
            original_path,
            relative_path
        );

        await fs.mkdir(path.dirname(destination), {
            recursive: true
        });

        await fs.copyFile(file, destination);

        console.log(`[BACKUP] ${relative_path}`);
    }
}

async function optimize_image(file) {
    const relative_path = path.relative(
        original_path,
        file
    );

    const parsed_path = path.parse(relative_path);
    const original_stat = await fs.stat(file);

    const result = {
        original: original_stat.size,
        normal: 0,
        low: 0
    };

    console.log(`\n[IMAGE] ${relative_path}`);
    console.log(`Original: ${format_size(result.original)}`);

    for (const mode of image_modes) {
        const file_name = `${parsed_path.name}${mode.suffix}.webp`;

        const destination = path.join(
            output_path,
            parsed_path.dir,
            file_name
        );

        await fs.mkdir(path.dirname(destination), {
            recursive: true
        });

        await sharp(file)
            .rotate()
            .resize({
                width: mode.width,
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({
                quality: mode.quality,
                alphaQuality: 100,
                effort: 6
            })
            .toFile(destination);

        const output_stat = await fs.stat(destination);

        if (mode.suffix === '_low') {
            result.low = output_stat.size;
        } else {
            result.normal = output_stat.size;
        }

        console.log(
            `${file_name}: ${format_size(output_stat.size)}`
        );
    }

    return result;
}

async function main() {
    await fs.mkdir(original_path, {
        recursive: true
    });

    await fs.mkdir(output_path, {
        recursive: true
    });

    await preserve_originals();

    const files = await get_image_files(original_path);

    const totals = {
        original: 0,
        normal: 0,
        low: 0
    };

    for (const file of files) {
        const result = await optimize_image(file);

        totals.original += result.original;
        totals.normal += result.normal;
        totals.low += result.low;
    }

    console.log('\n================================');
    console.log(`Images: ${files.length}`);
    console.log(`Original: ${format_size(totals.original)}`);
    console.log(`Normal: ${format_size(totals.normal)}`);
    console.log(`Low Data: ${format_size(totals.low)}`);

    if (totals.original > 0) {
        const normal_reduction = (
            1 - totals.normal / totals.original
        ) * 100;

        const low_reduction = (
            1 - totals.low / totals.original
        ) * 100;

        console.log(
            `Normal reduction: ${normal_reduction.toFixed(2)}%`
        );

        console.log(
            `Low Data reduction: ${low_reduction.toFixed(2)}%`
        );
    }

    console.log('================================');
    console.log('Image optimization complete.');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});