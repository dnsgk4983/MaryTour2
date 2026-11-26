import { useNavigate, useParams } from 'react-router-dom';

import Screen from '../components/layout/Screen.jsx';
import Title from '../components/common/Title.jsx';
import Button from '../components/common/Button.jsx';

import { routes } from '../data/routes.js';

export default function QrCheckPage() {
    const navigate = useNavigate();
    const { token } = useParams();

    return (
        <Screen class_name="check">
            <Title>위치 인증</Title>

            <p>GPS 인증 기능 준비 중</p>
            <p>인증 토큰: {token}</p>

            <Button
                variant="secondary"
                onClick={() => navigate(routes.home)}
            >
                돌아가기
            </Button>
        </Screen>
    );
}