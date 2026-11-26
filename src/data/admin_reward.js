export const admin_reward_config = Object.freeze({
    total_stock: 300,
    initial_issued: 128,
    reward_name: '스탬프 투어 완주 특전',
    stations: [
        {
            id: 'bupyeong',
            name: '산곡역'
        },
        {
            id: 'daerim',
            name: '대림역'
        },
        {
            id: 'gurodigital',
            name: '구로디지털단지역'
        }
    ]
});

export const admin_test_participants = [
    {
        id: 'MARY-0001',
        stamps: [
            'bupyeong',
            'daerim',
            'gurodigital'
        ],
        claimed: false,
        claimed_at: null
    },
    {
        id: 'MARY-0002',
        stamps: [
            'bupyeong',
            'daerim'
        ],
        claimed: false,
        claimed_at: null
    },
    {
        id: 'MARY-0003',
        stamps: [
            'bupyeong',
            'daerim',
            'gurodigital'
        ],
        claimed: true,
        claimed_at: null
    },
    {
        id: 'MARY-0004',
        stamps: [],
        claimed: false,
        claimed_at: null
    }
];