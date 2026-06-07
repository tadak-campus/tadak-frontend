# 타닥캠퍼스 현재 디자인 시스템 정리

이 문서는 현재 구현된 프론트엔드 화면과 스타일을 기준으로 정리한 디자인 시스템 스냅샷이다. 목표는 앞으로 디자인 방향을 객관적으로 검토하고, GPT나 팀원에게 리뷰를 요청할 때 같은 기준으로 이야기할 수 있게 만드는 것이다.

## 1. 현재 제품 인상

타닥캠퍼스는 현재 "부드러운 학습 공간"과 "게임화된 타자연습" 사이에 놓여 있다. 전체적으로 딱딱한 교육 서비스보다는 하늘, 구름, 파스텔, 포인트, 키보드 꾸미기를 활용한 가벼운 캠퍼스/놀이터 분위기가 강하다.

현재 무드는 다음에 가깝다.

- 부드러움: 높음
- 친근함: 높음
- 게임성: 중간 이상
- 학습 도구성: 중간
- 전문성/업무 도구성: 낮음
- 프리미엄감: 낮음에서 중간

한 줄로 표현하면, 현재 톤은 "구름처럼 가볍고 귀여운 타자 학습 서비스"다.

## 2. 디자인 방향성

현재 구현 기준의 디자인 키워드는 다음과 같다.

- Soft learning
- Pastel campus
- Friendly typing game
- Rounded interface
- Light gamification
- Customizable keyboard

현재 화면은 사용자를 압박하지 않는 쪽으로 설계되어 있다. 배경은 밝고, 카드와 버튼은 둥글며, 포인트와 상점은 학습 보상 구조를 강조한다. 반대로 정보 밀도, 생산성, 성취 추적, 랭킹/분석 같은 학습 관리 도구의 느낌은 아직 약하다.

## 3. 시각 언어

### 색상

현재 색상은 `src/index.css`의 Tailwind theme 토큰과 화면별 인라인 Tailwind 클래스로 구성되어 있다.

주요 배경색:

- `indigo-50`: 앱 콘텐츠 배경
- `indigo-100`: 전체 페이지 배경 후보
- `sky-300`, `sky-400`: 로그인 배경, 문장 박스, primary hover/focus 계열
- `white`, `white/90`, `white/95`, `white/50`: 카드, 칩, 반투명 로그인 패널

주요 텍스트 색:

- `slate-950`: 기본 본문/제목
- `slate-700`: 내비게이션/칩 텍스트
- `slate-500`: 보조 설명
- `white`: active 버튼, 문장 기본 표시

상태 색:

- Green: 정확도, 적용중
- Blue: CPM, 선택, 구매, 보유중
- Red: 오타, 잘못 입력한 글자
- Purple: 경과 시간
- Amber: 포인트 표시

관찰:

- 전체 팔레트는 파스텔 하늘색과 밝은 인디고가 지배한다.
- `sky`와 `blue`가 primary 역할을 나눠 쓰고 있어, 버튼/선택/입력의 주색이 아직 하나로 고정되지는 않았다.
- 상태 카드는 색상이 명확하지만, 제품 전체의 primary color와 status color가 분리되어 있지 않다.

### 타이포그래피

현재 별도 폰트 지정은 없고 브라우저/system font 기반이다.

주요 크기:

- 페이지 제목: `text-3xl font-bold`
- 섹션 제목: `text-2xl font-bold`
- 타자 문장/입력: `text-2xl leading-relaxed`
- 내비게이션/칩/카드: `text-sm font-semibold`
- 보조 정보: `text-xs`, `text-sm`

관찰:

- 큰 글자와 넉넉한 줄간격은 학습 화면의 읽기 편안함을 만든다.
- 위계는 단순하지만 아직 공통 scale로 정리되어 있지는 않다.
- `font-semibold`와 `font-bold` 사용이 많아 전체적으로 귀엽고 또렷하지만, 긴 학습 콘텐츠가 많아질 경우 다소 무거워질 수 있다.

### 모서리와 형태

현재 UI는 둥근 형태가 핵심이다.

- 로그인 패널: `rounded-[32px]`
- 디자인 시스템 panel: `rounded-[32px]`
- 사이드바 아이템/칩: `rounded-3xl`, `rounded-full`
- 상점/스테이지/통계 카드: `rounded-2xl`
- 입력/문장 박스: `rounded-xl`
- 썸네일/상태 배지: `rounded-lg`

관찰:

- 전체적으로 부드럽고 친근한 인상을 만든다.
- 다만 반경이 `8/12/16/24/32/full`처럼 넓게 퍼져 있어, 어떤 컴포넌트가 어느 radius를 써야 하는지 기준이 필요하다.

### 그림자와 표면

현재 표면은 흰색 카드와 은은한 그림자를 주로 쓴다.

- 로그인 패널: 큰 확산 그림자와 반투명 흰색
- 사이드바: 얕은 `shadow-sm`
- 헤더 칩: `shadow-sm`
- 상점 패널: `shadow-md`
- 키보드: `shadow-md`
- 디자인 시스템 panel: 커스텀 soft shadow

관찰:

- "떠 있는 종이/구름 카드" 같은 느낌이 있다.
- 그림자 강도는 대체로 부드럽지만, 페이지마다 `shadow-md`, 커스텀 shadow, `shadow-sm`이 섞여 있어 elevation 기준이 아직 명확하지 않다.

## 4. 레이아웃 시스템

### 앱 셸

현재 앱은 고정 사이드바와 고정 헤더를 가진다.

- Sidebar: 좌측 고정, 모바일/좁은 화면 `w-20`, 큰 화면 `w-48`
- Header: 상단 고정, 사이드바 너비만큼 왼쪽 offset
- Content: `ml-20 lg:ml-48`, `pt-18`, `bg-indigo-50`

이 구조는 "학습 대시보드"나 "캠퍼스 앱" 느낌을 만든다. 내비게이션이 항상 보이기 때문에 반복 사용 서비스에 적합하다.

주의점:

- 사이드바 active 상태가 아직 없다.
- 헤더는 투명 배경이라 콘텐츠와 겹칠 때 시각적 경계가 약할 수 있다.
- 모바일에서 통계 카드 grid가 고정 컬럼으로 되어 있어 좁은 화면 대응 기준이 더 필요하다.

### 화면별 구조

로그인:

- 하늘 배경 이미지
- 중앙 반투명 카드
- 큰 로고
- 카카오 로그인 버튼

타자연습:

- 제목
- 상단 통계 카드
- 문장 표시 박스
- 입력창
- 가상 키보드

상점:

- 좌측 아이템 목록 카드
- 우측 키보드 꾸미기 프리뷰 카드
- 탭, 아이템 카드, 저장 버튼

현재 가장 완성도가 높은 화면은 로그인과 상점이다. 타자연습은 기능 중심으로 구성되어 있지만, 배경/카드/상태 표현이 상점만큼 정리되어 있지는 않다.

## 5. 컴포넌트 패턴

### Navigation

사이드바는 아이콘과 라벨을 함께 사용한다. 좁은 화면에서는 아이콘만 표시된다.

현재 패턴:

- MUI outlined icons
- 둥근 hover surface
- hover 시 sky background
- active 상태 없음

권장 기준:

- active nav item을 반드시 정의한다.
- hover와 active 색상을 분리한다.
- 사이드바 아이콘 크기, 라벨 weight, padding을 토큰화한다.

### Header Chip

헤더에는 포인트 칩과 프로필 칩이 있다.

현재 패턴:

- 흰색 반투명 pill
- 작은 그림자
- 포인트 아이콘 이미지
- 프로필 이니셜 원형 아바타

이 패턴은 제품의 게임화 요소를 잘 드러낸다. 앞으로 알림, 레벨, 연속 학습일 같은 보상 요소를 붙이기 좋다.

### Stat Card

통계 카드는 상태 색을 명확히 분리한다.

현재 variant:

- green: 정확도
- blue: CPM
- red: 오타
- purple: 시간

장점:

- 빠르게 스캔하기 좋다.
- 학습 중 피드백이 명확하다.

개선점:

- 값의 숫자 크기가 아직 작다.
- 카드가 다소 단순해서 게임성/성취감 표현은 약하다.
- 통계 카드의 컬럼 수와 모바일 레이아웃 규칙이 필요하다.

### Sentence And Input

문장 표시와 입력창은 모두 `text-2xl`, `rounded-xl`, `border-sky-300`을 쓴다.

현재 특징:

- 문장 박스는 sky 배경
- 아직 입력하지 않은 문자는 white
- 정답은 black
- 오답은 red

주의점:

- 흰 글자와 sky 배경의 대비가 약할 수 있다.
- 문장 박스와 입력창은 기능적으로 중요하므로 접근성 기준을 우선해야 한다.

### Keyboard

키보드는 이 제품의 핵심 시각 자산이다.

현재 특징:

- 실제 키 입력 반응
- 키캡 스킨 적용 가능
- plate/base/border/text/pressed 색 토큰 구조
- 상점에서 배경, 장식, 효과음 라벨과 함께 프리뷰 가능

강점:

- 타닥캠퍼스만의 차별화된 인터랙션이다.
- 상점과 플레이 화면을 연결하는 중심 컴포넌트가 될 수 있다.

개선점:

- 키보드 자체의 크기와 반응형 규칙이 더 필요하다.
- 플레이 화면의 키보드와 상점 프리뷰 키보드가 동일한 품질로 보이도록 stage 규칙을 통합할 필요가 있다.

### Shop Item Card

상점 카드는 작고 명확한 선택/구매 카드다.

현재 특징:

- white surface
- selected 시 blue border
- 미보유는 구매 버튼
- 보유/적용 상태는 badge
- 배경/장식은 이미지 썸네일
- 키보드는 CSS mini preview
- 효과음은 텍스트 라벨

장점:

- 기능 상태가 명확하다.
- 카드 크기가 작아 상점 목록에 적합하다.

개선점:

- selected, equipped, owned 상태의 우선순위가 시각적으로 더 정리되면 좋다.
- 구매 버튼과 저장 버튼의 primary color 기준을 통일해야 한다.

## 6. 현재 디자인 시스템 파일 상태

현재 `src/designs/design-system.ts`는 앱 셸 중심의 className 상수를 제공한다.

포함된 것:

- 페이지/레이아웃 shell
- 헤더
- 사이드바
- 콘텐츠 영역
- panel
- nav button
- badge
- section title/headline

아직 부족한 것:

- Button variants
- Card variants
- Chip variants
- Tabs
- Form input
- Stat card
- Keyboard stage
- Empty/loading/error state
- Focus style
- Active nav style
- Responsive grid rules

현재는 "디자인 시스템"이라기보다 "레이아웃 className 모음"에 가깝다. 다음 단계에서는 토큰과 컴포넌트 규칙을 분리하는 것이 좋다.

## 7. 일관성 이슈

현재 가장 먼저 정리하면 좋은 부분은 다음이다.

- Primary color가 `sky`와 `blue`로 나뉘어 있다.
- Card radius가 화면마다 다르지만 의도 기준이 문서화되어 있지 않다.
- Shadow/elevation 단계가 정의되어 있지 않다.
- 페이지별 카드 배경이 일부 누락되어 있다. 예: 타자연습 컨텐츠 카드가 `shadow-md`는 있지만 명시적 `bg-white`가 없다.
- Sidebar active 상태가 없다.
- Header dropdown은 `rounded-md`, 다른 UI는 큰 radius라 톤이 약간 다르다.
- 포인트, 프로필, 상점, 타자연습이 연결되기 시작했지만 홈/결과 화면은 아직 디자인 기준이 없다.
- 에러, 로딩, 빈 상태의 공통 패턴이 없다.
- 접근성 기준이 아직 약하다. 특히 focus ring, 색 대비, 키보드 접근성 기준이 필요하다.

## 8. 추천 디자인 원칙

현재 제품을 유지하면서 더 단단하게 만들려면 다음 원칙을 추천한다.

1. 부드럽되 흐릿하지 않게 만든다.
   - 파스텔 배경은 유지하되, 핵심 텍스트와 액션은 충분한 대비를 준다.

2. 게임성은 보상 영역에 집중한다.
   - 포인트, 상점, 키보드 꾸미기, 완료 결과에서는 playful하게.
   - 문장 입력, 정확도, 오타 피드백은 명확하고 차분하게.

3. 키보드를 브랜드 자산으로 삼는다.
   - 플레이, 상점, 결과 화면 모두 키보드 비주얼을 중심 축으로 연결한다.

4. 둥근 형태는 유지하되 scale을 줄인다.
   - Small: 8px
   - Medium: 12px
   - Large: 16px
   - Hero/Modal: 32px
   - Pill: full

5. Primary action을 하나로 정한다.
   - 추천: `sky-400` 또는 명확한 `blue-500` 중 하나를 제품 primary로 선택한다.
   - 나머지는 hover, secondary, status로 분리한다.

## 9. 추천 토큰 초안

현재 구현을 기반으로 정리하면 다음 토큰 구조가 적절하다.

### Color Tokens

- `color.background.app`: `indigo-50`
- `color.background.page`: `indigo-100`
- `color.surface.default`: `white`
- `color.surface.soft`: `white/95`
- `color.surface.glass`: `white/50`
- `color.text.primary`: `slate-950`
- `color.text.secondary`: `slate-700`
- `color.text.muted`: `slate-500`
- `color.brand.primary`: `sky-400` 또는 `blue-500`
- `color.brand.primaryHover`: `sky-300` 또는 `blue-400`
- `color.status.success`: green scale
- `color.status.info`: blue scale
- `color.status.danger`: red scale
- `color.status.time`: purple scale
- `color.reward.point`: amber scale

### Radius Tokens

- `radius.thumbnail`: 8px
- `radius.control`: 12px
- `radius.card`: 16px
- `radius.panel`: 32px
- `radius.pill`: 9999px

### Shadow Tokens

- `shadow.chip`: subtle, small
- `shadow.panel`: soft medium
- `shadow.hero`: large, diffuse
- `shadow.keyboard`: medium tactile

### Typography Tokens

- `type.pageTitle`: 30px, bold
- `type.sectionTitle`: 24px, bold
- `type.practiceText`: 24px, relaxed
- `type.body`: 14-16px
- `type.caption`: 12px, semibold
- `type.nav`: 14px, semibold

## 10. 우선순위 높은 개선안

1. `Button` 규칙 만들기
   - primary, secondary, ghost, danger
   - loading, disabled, focus-visible

2. `Card` 규칙 만들기
   - panel card, item card, stat card, floating chip

3. Navigation active 상태 추가
   - 현재 위치에 따라 sidebar item의 active style 적용

4. Play 화면 정리
   - 통계 카드 반응형
   - 문장 박스 대비 개선
   - 입력창 focus ring 추가
   - 키보드 stage를 상점과 더 일관되게 적용

5. 색상 역할 분리
   - brand, status, reward, neutral을 구분

6. Empty/loading/error state 공통화
   - 상점 로딩/에러 패턴을 다른 화면에서도 재사용

## 11. GPT 리뷰 요청용 프롬프트

아래 프롬프트를 GPT에게 그대로 붙여넣고 리뷰를 요청할 수 있다.

```text
아래는 현재 개발 중인 "타닥캠퍼스" 프론트엔드의 디자인 시스템 현황입니다.

목표 사용자는 타자연습을 하는 학습자입니다. 제품은 카카오 로그인, 타자연습, 포인트, 상점, 키보드 꾸미기 기능을 가집니다. 현재 무드는 파스텔, 하늘, 구름, 둥근 카드, 포인트 보상, 커스터마이징 키보드에 가깝습니다.

이 디자인 시스템을 객관적으로 검토해주세요.

검토 기준:
1. 현재 시각 분위기가 어떤 제품처럼 느껴지는지
2. 타자 학습 서비스로서 신뢰감과 재미의 균형이 적절한지
3. 컬러, radius, shadow, typography에서 일관성이 떨어지는 부분
4. 더 전문적인 학습 도구로 가려면 무엇을 줄이고 무엇을 강화해야 하는지
5. 더 귀엽고 게임적인 서비스로 가려면 무엇을 강화해야 하는지
6. 디자인 토큰과 컴포넌트 시스템으로 정리할 때의 우선순위

답변은 다음 형식으로 주세요:
- 전체 인상
- 강점
- 약점
- 가장 먼저 고칠 5가지
- 유지해야 할 브랜드 요소
- 버려도 되는 요소
- 추천 디자인 방향 2-3개
```

## 12. 결론

현재 타닥캠퍼스는 이미 "친근한 파스텔 타자 학습 앱"의 인상을 갖고 있다. 가장 강한 자산은 하늘 배경, 둥근 흰색 표면, 포인트 칩, 키보드 커스터마이징이다.

다음 단계의 핵심은 새 스타일을 많이 추가하는 것이 아니라, 이미 있는 톤을 더 명확한 규칙으로 묶는 것이다. 특히 primary color, radius scale, button/card/tabs/focus 상태를 먼저 정리하면 전체 완성도가 빠르게 올라갈 수 있다.

## 13. design-system.ts 기준 UI 일관성 및 반응형 감사

이 섹션은 `src/designs/design-system.ts`를 기준으로 현재 구현된 UI가 얼마나 일관적인지, 그리고 PC/모바일 화면에서 컴포넌트 크기가 정교하고 사용자 친화적인지 검토한 결과다. 실제 브라우저 스크린샷 기반 QA가 아니라 코드 기준 정적 검토이므로, 최종 판단 전에는 360px, 390px, 768px, 1440px, 1920px 뷰포트에서 시각 확인이 필요하다.

### 13.1 기준 디자인 시스템의 성격

`design-system.ts`가 제시하는 기본 분위기는 다음과 같다.

- 배경: `indigo-50`, `indigo-100` 기반의 아주 밝은 파스텔 앱 배경
- 표면: `white/95`, `white/90` 같은 반투명 흰색 카드와 칩
- 형태: `rounded-3xl`, `rounded-[32px]`, `rounded-full` 중심의 매우 둥근 UI
- 그림자: `shadow-sm` 또는 부드러운 커스텀 shadow
- 텍스트: `slate-950`, `slate-700`, `slate-500` 중심의 차분한 slate 계열
- 인터랙션 색: hover/primary로 `sky-400`, `sky-300` 사용
- 앱 구조: 고정 사이드바 + 고정 헤더 + 연한 indigo 콘텐츠 배경

즉, 기준 파일의 분위기는 "밝고 부드러운 파스텔 대시보드"다. 학습 서비스지만 생산성 도구처럼 딱딱하지 않고, 귀엽고 편안한 캠퍼스 앱에 가깝다.

### 13.2 전체 일관성 평가

현재 UI 분위기는 기준 디자인 시스템과 대체로 같은 방향이다.

- 로그인 화면의 하늘 배경, 반투명 흰색 카드, 큰 radius는 기준 톤과 잘 맞는다.
- 사이드바와 헤더는 `design-system.ts`를 직접 사용하므로 가장 일관적이다.
- 상점 화면도 흰색 카드, 둥근 모서리, 포인트 칩, 키보드 프리뷰로 전체 분위기와 잘 맞는다.
- 타자연습 화면은 기능은 잘 드러나지만, `design-system.ts`의 panel/card 규칙을 덜 사용해서 완성도와 일관성이 상대적으로 낮다.

정성 점수로 보면 다음 정도다.

- 분위기 일관성: 70/100
- PC 사용성: 75/100
- 모바일 사용성: 45/100
- 컴포넌트 사이즈 정교함: 55/100
- 디자인 토큰화 수준: 45/100

결론적으로 "브랜드 분위기는 잡혀 있지만, 컴포넌트 시스템으로 정교하게 통제되는 상태는 아직 아니다."

### 13.3 기준과 잘 맞는 부분

#### App Shell

사이드바, 헤더, 콘텐츠 shell은 기준 디자인 시스템과 가장 잘 맞는다.

- `sidebarShell`, `headerShell`, `headerChip`, `contentShell`을 직접 사용한다.
- 고정 사이드바와 고정 헤더 구조가 앱다운 느낌을 만든다.
- 흰색/반투명 표면과 slate 텍스트의 조합이 안정적이다.

다만 `pageShell`, `layoutShell`, `mainGrid`, `regionContent`, `panel`, `panelPadding`, `navButton`, `badge`, `sectionTitle`, `sectionHeadline`은 현재 실제 화면에서 충분히 재사용되지 않는다. 기준은 존재하지만 화면들이 각자 Tailwind class를 직접 쓰는 비율이 높다.

#### Login

로그인 화면은 분위기 측면에서 가장 강하다.

- 하늘 배경 이미지와 `bg-sky-300`이 제품 톤을 즉시 전달한다.
- `rounded-[32px]`, 반투명 흰색 카드, 큰 로고가 부드러운 브랜드 인상을 만든다.
- 카카오 버튼은 실제 서비스 진입점으로 명확하다.

주의할 점은 로그인 카드의 좌우 padding이 모바일에서 다소 크다는 점이다. `px-12`는 360px 화면에서 내부 여백이 크게 느껴질 수 있다.

#### Shop

상점 화면은 현재 제품의 게임화 방향과 가장 잘 맞는다.

- 좌측 아이템 목록, 우측 키보드 미리보기 구조가 명확하다.
- 포인트 칩, 구매 버튼, 보유/적용 상태가 제품의 보상 구조를 잘 보여준다.
- 키보드 꾸미기라는 핵심 차별점이 화면 중앙 경험으로 드러난다.

다만 상점 카드들은 기준 `panel`의 `rounded-[32px]`, `border`, `bg-white/95`, soft shadow 대신 `rounded-2xl bg-white shadow-md`를 사용한다. 분위기는 유사하지만 기준 시스템과 정확히 일치하지는 않는다.

### 13.4 기준과 어긋나는 부분

#### Primary Color 불일치

기준 디자인 시스템은 hover/primary 느낌으로 `sky-400`, `sky-300`을 사용한다. 실제 구현은 `blue-500`, `blue-400`, `blue-100`, `amber-100`, `gray-400` 등 Tailwind 기본색도 많이 섞인다.

대표 사례:

- 상점 탭 active: `bg-blue-500`
- 아이템 선택 border: `border-blue-500`
- 구매 버튼: `bg-blue-500`
- 저장 버튼: 변경 있음 `bg-blue-500`, 변경 없음 `bg-sky-400`
- 문장/입력: `sky-300`

이 상태에서는 사용자가 `sky`를 브랜드 primary로 인식할지, `blue`를 primary로 인식할지 애매하다.

추천:

- 제품 primary를 하나로 정한다.
- `sky`를 브랜드/감성 색으로 쓰고, `blue`를 정보/선택 색으로 쓸지 역할을 분리한다.
- 버튼, 탭, selected border, focus ring은 같은 primary scale을 쓰게 한다.

#### Radius Scale 불일치

기준 시스템은 `rounded-[32px]`, `rounded-3xl`, `rounded-full`처럼 큰 radius가 중심이다. 실제 화면은 `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-[32px]`, `rounded-full`이 모두 섞인다.

문제가 되는 부분:

- Header dropdown: `rounded-md`라 전체 분위기보다 각이 져 보인다.
- Login button: `rounded-md`는 카카오 공식 이미지 버튼 때문에 자연스럽지만, 앱 버튼 기준과는 다르다.
- Shop panel: `rounded-2xl`이라 기준 `panel`보다 덜 부드럽다.
- Keyboard keycap: `rounded-md`는 키보드 특성상 괜찮지만 별도 예외로 정의해야 한다.

추천:

- 앱 panel: 32px
- 카드/스테이지: 16px
- 입력/버튼: 12px
- 썸네일/배지: 8px
- 칩: full
- 키캡: 6px 또는 8px 예외

#### Shadow/Elevation 불일치

기준 `panel`은 매우 부드러운 custom shadow를 갖는다. 실제 화면은 `shadow-sm`, `shadow-md`, `shadow-lg`, custom shadow가 섞인다.

문제가 되는 부분:

- Header dropdown의 `shadow-lg`는 전체 soft tone보다 강하다.
- 상점 panel의 `shadow-md`는 기준 panel보다 일반 Tailwind 카드처럼 보인다.
- 키보드의 `shadow-md`는 촉각적이라 좋지만, panel shadow와 구분되는 별도 elevation으로 정의해야 한다.

추천:

- chip shadow
- panel shadow
- dropdown shadow
- keyboard tactile shadow

이 4단계로 정리한다.

#### Typography 불일치

대체로 `font-semibold`, `font-bold`, slate 텍스트를 일관되게 사용한다. 하지만 페이지 제목, 섹션 제목, 문장 텍스트, 카드 값 숫자 크기가 컴포넌트별로 독립적으로 정해져 있다.

특히 타자연습 통계 카드의 숫자는 학습 피드백의 핵심인데 현재 `font-bold`만 있고 크기 강조가 약하다. 반대로 문장과 입력은 `text-2xl`로 크고 명확하다.

추천:

- Page title: 30px bold
- Section title: 24px bold
- Practice text: 24px relaxed
- Stat value: 24px bold
- Card title/nav/chip: 14px semibold
- Caption/badge: 12px semibold

### 13.5 모바일 반응형 검토

현재 모바일 반응형은 가장 큰 리스크다. 레이아웃이 완전히 깨진다고 단정할 수는 없지만, 정교하고 사용자 친화적인 상태라고 보기는 어렵다.

#### 공통 Shell

모바일에서도 사이드바가 `w-20`으로 고정된다. 360px 화면에서는 콘텐츠가 실제로 약 280px 폭 안에서 동작한다. `contentShell`의 `px-4`를 빼면 내부 가용 폭은 약 248px까지 줄어든다.

리스크:

- 작은 모바일에서 콘텐츠가 매우 좁다.
- 고정 사이드바는 앱다워 보이지만, 타자연습처럼 넓은 가로 공간이 필요한 기능과 충돌한다.
- Header는 `left-20`, `px-6`, chip gap이 있어 긴 닉네임이나 포인트가 들어오면 겹치거나 압축될 수 있다.

추천:

- 모바일에서는 하단 탭바 또는 접히는 사이드바를 고려한다.
- 최소한 `contentShell`의 모바일 padding을 줄이고, header chip의 max-width/truncate를 넣는다.

#### Play Page

모바일에서 가장 문제가 크다.

현재 구조:

- `main p-8`
- 통계 카드 `grid grid-cols-5`
- 실제 카드 수는 4개
- 문장/입력 `text-2xl`
- 키보드 key `min-w-[40px] h-[52px]`

리스크:

- `grid-cols-5`는 4개의 통계 카드에 맞지 않고, 모바일에서는 카드 폭이 지나치게 좁아진다.
- `p-8`은 좁은 화면에서 너무 크다.
- 문장/입력의 `text-2xl`은 모바일에서 좋을 수도 있지만 긴 한국어 문장에서는 줄바꿈이 많아져 화면 점유가 커진다.
- 키보드는 각 키가 `min-w-[40px]`라 모바일 폭을 초과할 가능성이 매우 높다.
- 키보드 부모에 `overflow-x-auto`가 없어 넘침이 발생할 수 있다.

추천:

- 통계 카드: `grid-cols-2 sm:grid-cols-4`
- Play main: `p-4 lg:p-8`
- 문장/입력: `text-lg sm:text-xl lg:text-2xl`
- 키보드: 모바일에서는 scale down 또는 horizontal scroll 허용
- 키보드 stage: `overflow-x-auto`, `min-w`/`max-w` 기준 정의

#### Shop Page

상점은 `flex-col lg:flex-row`라 큰 구조는 모바일 친화적이다. 하지만 내부 컴포넌트에서 리스크가 있다.

현재 구조:

- `main p-8`
- 상점 panel `p-5`
- 탭 `flex gap-2`
- 아이템 그리드 `grid-cols-2`
- 키보드 stage `p-8`

리스크:

- 모바일에서 `p-8` + `p-5`가 겹쳐 실제 콘텐츠 폭이 많이 줄어든다.
- 탭 4개가 한 줄에 고정되어 좁은 화면에서 overflow 가능성이 있다.
- 아이템 카드 2열은 360px에서 카드 폭이 너무 작아질 수 있다.
- 키보드 stage의 `p-8`도 모바일에서는 과하다.

추천:

- Shop main: `p-4 lg:p-8`
- Panel: `p-4 lg:p-5`
- Tabs: `overflow-x-auto`, `whitespace-nowrap`
- ItemGrid: `grid-cols-1 sm:grid-cols-2`
- KeyboardStage: `p-4 sm:p-6 lg:p-8`

#### Login Page

로그인은 모바일에서 비교적 안정적이다.

리스크:

- 카드 `px-12`는 360px에서 다소 크다.
- 로고 `h-40 w-40`은 괜찮지만 작은 모바일에서는 세로 공간을 많이 쓴다.

추천:

- Card padding: `px-8 py-10 sm:px-12 sm:py-14`
- Logo: `h-32 w-32 sm:h-40 sm:w-40 lg:h-50 lg:w-50`

### 13.6 PC 화면 검토

PC에서는 전체적으로 사용 가능하고 분위기도 안정적이다. 특히 1440px 전후에서는 사이드바, 헤더, 상점 2컬럼 구조가 자연스럽다.

좋은 점:

- 사이드바가 큰 화면에서 `w-48`로 확장되어 라벨을 보여준다.
- 상점은 좌측 440px 목록 + 우측 프리뷰로 기능 분리가 명확하다.
- 키보드 프리뷰 `max-w-190`은 데스크톱에서 과하게 커지지 않도록 잡혀 있다.
- 로그인은 중앙 카드 max-width가 있어 안정적이다.

리스크:

- `MainLayout`은 `h-screen`, `contentShell`은 `min-h-screen`이라 페이지 내부 스크롤/고정 헤더 관계가 어색해질 수 있다.
- `layoutShell`, `max-w-[1720px]` 토큰이 실제 레이아웃에 적용되지 않아 초광폭 화면에서는 콘텐츠가 너무 넓게 퍼질 수 있다.
- 타자연습 화면은 데스크톱에서도 `grid-cols-5`에 카드 4개만 있어 오른쪽 빈 컬럼이 생긴다.
- Play의 문장 카드에는 `bg-white`가 없어 배경과 카드 구분이 상점보다 약하다.
- Header가 투명이라 PC에서도 콘텐츠가 스크롤될 때 경계가 모호해질 수 있다.

추천:

- 콘텐츠 내부에 `max-w` 기준을 둔다. 예: Play는 `max-w-6xl`, Shop은 `max-w-7xl`.
- Play 통계 카드는 `grid-cols-4`로 정리한다.
- 공통 panel 스타일을 Play/Shop에 적용한다.
- Header는 `bg-indigo-50/70` 또는 blur + border-bottom을 검토한다.

### 13.7 컴포넌트별 사이즈/친화성 평가

#### Header

평가: PC는 적절, 모바일은 긴 데이터에 취약.

좋은 점:

- 칩 높이 36px는 부담이 적다.
- 포인트와 프로필이 오른쪽에 모여 있어 게임화 정보가 잘 보인다.

리스크:

- 닉네임 길이 제한/truncate가 없다.
- 포인트가 큰 숫자가 되면 칩이 넓어진다.
- 모바일 header width가 좁아질 때 두 chip이 겹치거나 답답해질 수 있다.

권장:

- 프로필명 `max-w`, `truncate`
- 포인트 칩 최소/최대 폭 기준
- 모바일에서는 닉네임 숨김 유지 또는 프로필 칩 축약

#### Sidebar

평가: PC는 좋음, 모바일은 제품 성격에 따라 재검토 필요.

좋은 점:

- `w-20` 아이콘 전용 모드는 깔끔하다.
- `lg:w-48`에서 라벨이 보이는 구조는 자연스럽다.

리스크:

- active 상태가 없다.
- 모바일에서 가로 공간을 계속 점유한다.
- 타자연습의 키보드 영역과 충돌한다.

권장:

- active route 스타일 추가
- 모바일 하단 네비게이션 검토

#### Login Card

평가: 분위기 일관성 높음, 모바일 padding만 조정 권장.

좋은 점:

- 브랜드 이미지가 가장 선명하다.
- 하늘 배경과 흰색 glass panel이 기준 톤과 잘 맞는다.

리스크:

- 모바일 padding이 살짝 과하다.

#### Play Stats

평가: 정보 구조는 좋지만 사이즈/반응형은 미흡.

리스크:

- 4개 카드인데 5컬럼.
- 모바일에서 카드 폭 부족.
- 숫자 강조 부족.

권장:

- `grid-cols-2 sm:grid-cols-4`
- value `text-xl sm:text-2xl`
- label은 `text-xs sm:text-sm`

#### Sentence Display / Typing Input

평가: 기능 중심으로 명확하지만 접근성과 모바일 대응 보강 필요.

리스크:

- sky 배경 위 white 텍스트 대비가 약할 수 있다.
- input focus가 `focus:outline-none`이라 접근성 힌트가 부족하다.
- `border-3`은 강하지만 focus 상태 차이가 없다.

권장:

- 미입력 텍스트를 `text-slate-100` 또는 더 높은 대비로 조정
- input에 `focus-visible:ring`
- 모바일 텍스트 크기 단계화

#### Keyboard

평가: 브랜드 자산으로 좋지만 반응형 핵심 리스크.

리스크:

- key `min-w-[40px]`가 모바일에서 overflow 가능성이 높다.
- 키보드 전체가 줄어들거나 스크롤되는 정책이 없다.

권장:

- 모바일 scale token 또는 horizontal scroll 정책 결정
- key size: mobile 28-32px, desktop 40px 이상
- KeyboardStage와 Keyboard의 responsive sizing 통합

#### Shop Tabs

평가: PC는 좋음, 모바일 overflow 가능.

권장:

- `overflow-x-auto`
- `whitespace-nowrap`
- active/hover 색을 primary token과 통일

#### Item Grid / Item Card

평가: PC는 적절, 모바일 2열은 다소 빡빡함.

리스크:

- 360px + sidebar 환경에서는 2열 카드 폭이 매우 작다.
- 구매 버튼 텍스트는 짧아서 괜찮지만, 아이템명이 길면 줄바꿈이 어색할 수 있다.

권장:

- `grid-cols-1 sm:grid-cols-2`
- 아이템명 line-clamp 또는 min-height 정의
- 카드 height 안정화

#### Keyboard Stage

평가: 상점 PC에서는 좋고, 모바일 padding/overflow 보강 필요.

권장:

- `p-4 sm:p-6 lg:p-8`
- `overflow-x-auto`
- sound label이 키보드와 겹치지 않도록 safe area 확보

### 13.8 우선순위 액션

가장 먼저 고칠 순서는 다음을 추천한다.

1. Play 통계 카드 `grid-cols-5` 수정
   - `grid-cols-2 sm:grid-cols-4`로 바꾸는 것이 가장 즉시 효과가 크다.

2. 모바일 padding scale 정리
   - Page: `p-4 lg:p-8`
   - Panel: `p-4 lg:p-5`
   - Stage: `p-4 sm:p-6 lg:p-8`

3. Keyboard 모바일 overflow 정책 결정
   - 축소할지, 가로 스크롤을 허용할지 먼저 정한다.

4. Primary color 통일
   - 버튼, 탭, 선택 border, focus ring을 같은 색 역할로 묶는다.

5. 공통 panel 스타일 재사용
   - Shop/Play의 큰 카드에 `panel`, `panelPadding`을 적용하거나 새 panel variant를 만든다.

6. Header/Sidebar 상태 정리
   - active nav, truncate, dropdown radius/shadow를 기준 시스템에 맞춘다.

7. 접근성 focus state 추가
   - 버튼, 탭, 입력창, nav item에 `focus-visible` 스타일을 통일한다.

### 13.9 최종 판단

현재 UI는 `design-system.ts`가 의도한 "밝고 둥근 파스텔 앱" 분위기와 방향은 일치한다. 특히 로그인, 사이드바, 헤더, 상점의 정서적 톤은 서로 잘 맞는다.

하지만 "모든 컴포넌트 사이즈가 PC와 모바일에서 정교하고 사용자 친화적인가?"라는 질문에는 아직 그렇다고 보기 어렵다. PC는 대체로 사용 가능하지만, 모바일은 고정 사이드바, 큰 padding, 고정 grid column, 키보드 최소 폭 때문에 실제 사용성이 흔들릴 가능성이 높다.

따라서 다음 단계는 비주얼을 새로 바꾸는 것이 아니라, 현재 분위기를 유지한 채 responsive spacing, grid, key size, primary color, panel variant를 정교하게 묶는 것이다.
