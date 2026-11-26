export const demo_groups = [
    {
        title: '참여자 화면',
        pages: [
            ['splash', '로딩 및 스플래시', '프로젝트 시작 화면'],
            ['home', '인형공방', '단추 수집 현황'],
            ['scanner', 'QR 스캐너', 'QR 촬영 시연'],
            ['gps', 'GPS 위치 인증', '가상 위치 인증'],
            ['discovery', '단추 발견', '단추 수집 애니메이션'],
            ['complete', '여정 완주', '단추 수집 완료'],
            ['reward', '특전 확인', '봉투 개봉 인터랙션'],
            ['ending', '엔딩', '생일 축하 메시지']
        ]
    },
    {
        title: '예외 상황 화면',
        pages: [
            ['duplicate', '중복 수령', '기존 수령 이력 안내'],
            ['sold_out', '재고 소진', '특전 소진 안내'],
            ['failed', '인증 실패', '위치 인증 실패 안내'],
            ['closed', '행사 종료', '운영 종료 안내']
        ]
    },
    {
        title: '운영진 화면',
        pages: [
            ['admin', '관리자 로그인', '가상 운영 계정'],
            ['dashboard', '운영 대시보드', '테스트 운영 통계'],
            ['distribution', '특전 지급 관리', '가상 특전 지급'],
            ['issued', '지급 완료', '지급 결과 확인']
        ]
    }
];

export const demo_status = {
    duplicate: {
        title: '이미 특전을 수령하셨습니다.',
        message: '특전은 참여자 한 분당 한 번만 제공됩니다.'
    },
    sold_out: {
        title: '특전이 모두 소진되었습니다.',
        message: '메리의 생일을 함께 축하해 주셔서 감사합니다.'
    },
    failed: {
        title: '위치 인증에 실패했습니다.',
        message: '광고가 설치된 역 근처에서 다시 시도해 주세요.'
    },
    closed: {
        title: '행사 운영이 종료되었습니다.',
        message: '함께해 주신 모든 분께 감사드립니다.'
    }
};