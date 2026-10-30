# E5 Polyline 수정 검증

검증일: 2026-10-30, 기준 `fe_main@0d0f4cd29387fdf7f3f7937b2021cdd1efa54422`.

Google 공식 E5 예제의 첫 좌표는 38.5/-120.2이다. 기존 decodePolyline은 이를 3.85/-12.02로 반환했다. `1e6` 나눗셈을 `1e5`로 수정했고, 같은 독립 기대값 검사에서 실패→성공을 확인했다. 알고리즘과 반환 인터페이스는 유지했다.

이 함수는 computeRouteStepsDirect에서 사용한다. 현재 앱 진입점에서 해당 경로가 활성화되는 것은 확인하지 못했다. 이 PR은 함수의 좌표 정확성을 수정하며 현재 사용자 화면의 오류를 재현했다고 주장하지 않는다.

## 테스트

`trip`에서 `node --test tests/polylineDecode.test.mjs` 실행.

공식 3점 예제, 빈 입력, 원점, 반복 원점, 음수 위도 증분, 양수 경도 증분의 6개 통과, 실패·skip 0. Node v24.13.0, 외부 패키지 설치와 API 호출 없이 실제 함수를 실행했다. 잘못되거나 잘린 문자열의 처리 정책은 이 변경에 포함하지 않았다.

전체 앱 빌드·Lint·브라우저/Google API 통합은 의존성이 준비되지 않아 미실행이다. 이 단위 검사 성공을 앱 전체 검증으로 해석하지 않는다.

## 성능

기준 커밋의 원본 파일을 별도 ES-module 작업 트리에 보관하고 `trip`에서 다음 명령을 실행했다.

```text
node benchmarks/polylineDecode.mjs <baseline-worktree>/trip/src/utils/polylineDecode.js
```

두 버전 모두 정확한 1,000개 원점 좌표를 1,000번 디코딩하는 배치다. 비영점 좌표의 기존 오류를 성능상 이점으로 취급하지 않기 위해 공통으로 올바른 입력을 사용했다. 비영점 정확성은 별도 회귀 검사에서 확인한다.

동시성 1, 외부 호출 0, 각 워밍업 3배치·측정 15배치, 같은 프로세스에서 AB/BA 교차 순서. 배치들은 GC/JIT 영향을 공유하므로 통계적으로 독립된 실행이라고 주장하지 않는다. 중앙값 11.3179ms → 11.6977ms로 약 3.36% 증가했다. 사전에 정한 허용 조건은 기준 중앙값의 25% + 2ms 이내이며 충족했다. 속도 개선이나 실제 지도 렌더링 지연을 측정한 결과가 아니다.

반복값·소스/데이터 해시·판정: [polyline-performance-20261030.json](polyline-performance-20261030.json). 후보 결과의 길이·좌표 정확성 및 전체 반복 횟수 checksum을 검사했다.

## 검토

- 요구사항: Google E5 좌표를 그대로 반환하고 기존 객체 배열 인터페이스를 유지한다.
- 유지보수성: 동작 수정은 배율 한 줄이다. Node 기본 테스트/벤치마크를 사용해 의존성을 추가하지 않았다.
- 공개할 내용은 이 변경 파일과 검증 기록뿐이며 로컬의 다른 작업·설정·키를 포함하지 않는다.

기대값 출처: [Google Encoded Polyline Algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm).
