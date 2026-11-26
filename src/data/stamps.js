export const stamp_list = [
    {
        id: 'bupyeong',
        name: '부평구청역',
        image: 'button_01.webp'
    },
    {
        id: 'daerim',
        name: '대림역',
        image: 'button_02.webp'
    },
    {
        id: 'gurodigital',
        name: '구로디지털단지역',
        image: 'button_03.webp'
    }
];

export function get_stamp_count(collected_stamps) {
    return stamp_list.filter((stamp) => {
        return collected_stamps.includes(stamp.id);
    }).length;
}

export function is_stamp_complete(collected_stamps) {
    return get_stamp_count(collected_stamps) === stamp_list.length;
}