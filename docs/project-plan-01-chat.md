# AI 기반 대화형 신발 컨피규레이터 업그레이드 계획

스크린샷의 디자인을 참고하여 기존 컨트롤 패널에 AI 채팅 모드를 추가하겠습니다.

## 1. 아키텍처 설계

### AI 통합 방식
- **Claude API 직접 통합**: Anthropic Claude API를 직접 호출
- **환경 변수**: `.env.local`에 `VITE_CLAUDE_API_KEY` 저장
- **대안**: Vercel AI SDK 또는 OpenAI API 사용 가능 (설정 간소화)

### UI 구조
- 우측 컨트롤 패널에 "Chat Mode / Manual Mode" 토글 추가
- Chat Mode 선택 시 머티리얼 리스트를 채팅 인터페이스로 전환
- 채팅창 하단에 입력 필드와 전송 버튼
- 메시지 히스토리 표시 영역

## 2. 구현 단계

### Phase 1: UI 구성
1. **ChatInterface 컴포넌트** 생성
   - 메시지 리스트 영역
   - 입력 필드 및 전송 버튼
   - 로딩 상태 표시

2. **모드 스위처** 구현
   - 토글 버튼으로 Manual/Chat 모드 전환
   - 상태 관리로 현재 모드 추적

### Phase 2: Claude API 연동
1. **API 서비스 레이어**
   ```typescript
   - claudeService.ts: API 호출 로직
   - 프롬프트 엔지니어링 (신발 부위 인식)
   - 응답 파싱 및 명령 추출
   ```

2. **환경 설정**
   - `.env.local` 파일 생성
   - Vite 환경 변수 설정
   - API 키 보안 처리

### Phase 3: AI-Material 연동
1. **명령 파서** 구현
   - 자연어를 머티리얼 변경 명령으로 변환
   - "밑창을 빨간색으로", "전체 검정색" 등 해석

2. **MaterialController 확장**
   - AI 명령을 받아 실제 색상 변경 실행
   - 피드백 메시지 생성

## 3. 주요 파일 변경사항

### 새로 생성할 파일
- `src/components/ChatInterface.tsx` - 채팅 UI
- `src/components/ChatInterface.module.css` - 채팅 스타일
- `src/services/claudeService.ts` - API 통신
- `src/utils/materialParser.ts` - 명령 파싱
- `.env.local` - API 키 저장

### 수정할 파일
- `App.tsx` - 모드 상태 관리 추가
- `App.module.css` - 모드 스위처 스타일
- `package.json` - axios 또는 fetch 라이브러리 추가
- `vite.config.ts` - 환경 변수 설정

## 4. 프롬프트 엔지니어링

Claude에게 전달할 시스템 프롬프트:
```
당신은 3D 신발 컨피규레이터의 어시스턴트입니다.
사용자가 원하는 색상 변경을 이해하고 JSON 형식으로 응답합니다.

사용 가능한 머티리얼: [동적으로 전달]
응답 형식: 
{
  "changes": [
    {"material": "sole", "color": "#FF0000"},
    {"material": "upper", "color": "#000000"}
  ],
  "message": "밑창을 빨간색으로, 갑피를 검정색으로 변경했습니다."
}
```

## 5. 스타일 가이드

스크린샷 참고하여:
- 모던한 채팅 UI (메시지 버블 스타일)
- 기존 다크 테마와 일치하는 색상
- 부드러운 애니메이션 전환
- 반응형 레이아웃 유지

## 6. 기대 효과

- **사용자 경험 향상**: 자연어로 신발 커스터마이징 가능
- **접근성 개선**: 기술적 지식 없이도 쉽게 조작
- **차별화**: AI 기반 인터페이스로 혁신적인 사용자 경험 제공