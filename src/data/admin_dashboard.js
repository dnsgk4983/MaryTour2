export const admin_dashboard_config = Object.freeze({
    title: '운영 대시보드',
    subtitle: 'EVENT OVERVIEW',
    reward_title: '특전 지급 관리',
    reward_subtitle: 'REWARD MANAGEMENT'
});

export const admin_menu = [
    {
        id: 'dashboard',
        label: '운영 대시보드'
    },
    {
        id: 'reward',
        label: '특전 지급 관리'
    }
];

export const admin_test_anomalies = [
    {
        id: 'ANOMALY-001',
        participant_id: 'MARY-0002',
        station: '구로디지털단지역',
        type: 'distance',
        label: 'GPS 반경 이탈',
        detail: '허용 인증 반경 초과',
        time: '14:32:18',
        status: 'blocked'
    },
    {
        id: 'ANOMALY-002',
        participant_id: 'MARY-0004',
        station: '대림역',
        type: 'travel_time',
        label: '이동시간 미충족',
        detail: '최소 이동시간 조건 미충족',
        time: '14:18:42',
        status: 'blocked'
    },
    {
        id: 'ANOMALY-003',
        participant_id: 'MARY-0003',
        station: '산곡역',
        type: 'duplicate',
        label: '중복 인증 시도',
        detail: '이미 수집한 단추 재인증',
        time: '13:56:09',
        status: 'blocked'
    }
];

export const admin_anomaly_types = [
    {
        id: 'distance',
        label: 'GPS 반경 이탈'
    },
    {
        id: 'travel_time',
        label: '이동시간 미충족'
    },
    {
        id: 'duplicate',
        label: '중복 인증 시도'
    }
];