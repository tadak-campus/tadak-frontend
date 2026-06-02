// 백엔드가 내려주는 에셋 URL을 브라우저에서 로드 가능한 절대 URL로 변환한다.
// - 절대 URL(http/https)은 그대로 사용한다.
// - "/static/..." 같은 상대경로는 백엔드 origin을 붙인다(프론트 dev 서버가 아닌
//   API 서버가 서빙하므로). origin은 apiClient baseURL에서 "/api"를 제거해 도출한다.
// - null/빈 값은 그대로 null을 반환해 호출부가 플레이스홀더를 그리게 한다.

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// "http://127.0.0.1:8000/api" → "http://127.0.0.1:8000"
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const resolveAssetUrl = (url: string | null): string | null => {
  if (!url) {
    return null;
  }
  if (/^https?:\/\//.test(url)) {
    return url;
  }
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
};
