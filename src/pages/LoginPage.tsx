import { useNavigate } from "react-router-dom";
import logo from "@assets/lg_small.png";
import kakaoLoginButton from "@assets/login/kakao_login_medium_narrow.png";
import skyBackground from "@assets/login/sky-background.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    if (import.meta.env.DEV) {
      navigate("/");
      return;
    }

    alert("카카오 로그인 기능은 추후 연동 예정입니다.");
  };

  return (
    <main
      className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-sky-300 bg-cover bg-center px-8 text-slate-950"
      style={{ backgroundImage: `url(${skyBackground})` }}
    >
      <section
        className="w-full max-w-[560px] rounded-[32px] border border-white/55 bg-white/50 px-12 py-14 text-center shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur-[2px] lg:px-20 lg:py-18"
        aria-labelledby="login-title"
      >
        <img
          src={logo}
          alt="타닥캠퍼스 로고"
          className="mx-auto h-40 w-40 object-contain lg:h-50 lg:w-50"
        />

        <p className="mt-5 text-sm font-bold text-slate-500">
          나만의 부드러운 학습 공간에 오신 것을 환영합니다!
        </p>

        <button
          type="button"
          onClick={handleKakaoLogin}
          className="mx-auto mt-12 block w-full max-w-[183px] rounded-md transition hover:brightness-[0.98] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-400 active:translate-y-0.5"
          aria-label="카카오로 시작하기"
        >
          <img
            src={kakaoLoginButton}
            alt=""
            className="block h-auto w-full"
            aria-hidden
          />
        </button>
      </section>
    </main>
  );
};

export default LoginPage;
