# MANDLE 배포 프로세스

## 브랜치 구조

| 브랜치 | 역할 | 배포 환경 |
|--------|------|-----------|
| `develop` | 개발계 | Vercel Preview |
| `main` | 운영계 | Vercel Production (mandle.kr) |

## 배포 순서

### 1. 개발 (develop)
- 기능 개발 및 버그 수정은 `develop` 브랜치에서 진행
- 커밋 후 `develop`에 push

```bash
git add <파일>
git commit -m "feat: 작업 내용"
git push origin develop
```

### 2. PR 생성 (develop → main)
- GitHub에서 Pull Request 생성
- PR 제목과 변경사항 요약 작성

```bash
gh pr create --base main --head develop --title "PR 제목" --body "변경사항 요약"
```

### 3. 리뷰 및 머지
- PR 내용 확인 후 승인
- GitHub에서 머지 실행

```bash
gh pr merge <PR번호> --merge
```

### 4. 운영 배포
- `main` 브랜치에 머지되면 Vercel이 자동으로 Production 배포 진행
- https://mandle.kr 에서 배포 확인

### 5. develop 동기화
- 머지 후 develop 브랜치를 최신 상태로 동기화

```bash
git checkout develop
git pull origin main
```

## DB 마이그레이션

코드 배포와 별도로 DB 변경이 필요한 경우:

1. `supabase/migrations/` 에 SQL 파일 작성
2. **코드 배포 전** Supabase Dashboard > SQL Editor에서 실행
3. 코드 배포 진행

## 환경변수

Vercel에 등록된 환경변수:

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 |

환경변수 추가/변경 시:
```bash
vercel env add <변수명> production
```

## 소셜 로그인 Provider

| Provider | 관리 콘솔 |
|----------|-----------|
| Kakao | https://developers.kakao.com |
| Google | https://console.cloud.google.com |
| Apple | https://developer.apple.com |

배포 도메인 변경 시 각 Provider의 Redirect URI 업데이트 필요.
Supabase 콜백 URL: `https://mfjwfeldtbldfnwlrjsl.supabase.co/auth/v1/callback`
