# TrendMapLP

트렌드맵에 대한 사전 검증용 랜딩 페이지.

## 개요

- **목적**: 트렌드맵 아이디어의 시장 반응 사전 검증
- **구성**: 정적/SSG 기반 랜딩 페이지 (기술 스택은 마스터 플래닝에서 결정)

## 협업 셋업

이 저장소는 [claude-code-template](https://github.com/Gundy93/claude-code-template) **v0.1.0 lite** 프로필 기반이다.

- 에이전트: `explorer` / `implementer` / `test-writer` (`.claude/agents/`)
- 라우팅 스킬: `sub-agent-routing` (`.claude/skills/sub-agent-routing/SKILL.md`)
- 운영 가이드: [`CLAUDE.md`](CLAUDE.md)
- 핸드북 단일 진실의 원천: `~/development/claude-code-template/HANDBOOK.md`

`architect` / `deep-debugger` / `pr-reviewer` / `refactorer` / `doc-writer` 영역은 마스터가 직접 처리한다 (CLAUDE.md 영역 표 참조). 작업이 누적되면 `docs/profile-selection.md` 의 lite → standard 전환 레시피로 승격.

## 다음 단계

1. 마스터 플래닝 — 타깃·CTA·콘텐츠 구조·기술 스택·배포 인프라 결정
2. ADR 작성 (`docs/adr/0001-*.md` ~)
3. 구현 시작
