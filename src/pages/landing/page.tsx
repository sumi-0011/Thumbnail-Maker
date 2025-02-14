import React from "react";
import {
  ChevronDown,
  Mail,
  Sparkles,
  Palette,
  Layout,
  MousePointerClick,
} from "lucide-react";

const FloatingEmoji = ({ emoji, style }: { emoji: string; style: string }) => (
  <div className={`absolute ${style} animate-float`}>
    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl transform hover:scale-110 transition-transform">
      {emoji}
    </div>
  </div>
);

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) => (
  <div
    className={`p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slideUp`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 bg-[#7371FC] bg-opacity-10 rounded-xl flex items-center justify-center mb-4">
      <Icon size={24} className="text-[#7371FC]" />
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-b from-[#F8F9FD] to-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center py-20">
        <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-4">
          <FloatingEmoji emoji="🎨" style="top-20 left-20" />
          <FloatingEmoji emoji="✨" style="top-40 right-32" />
          <FloatingEmoji emoji="🚀" style="bottom-32 left-40" />
          <FloatingEmoji emoji="💫" style="bottom-40 right-20" />

          <div className="relative">
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#7371FC] bg-opacity-10 rounded-full animate-pulse" />
            <h1 className="text-6xl font-bold mb-6 animate-fadeIn">
              블로그 썸네일이 어려운 당신에게
            </h1>
          </div>
          <p className="text-2xl text-gray-600 mb-8 animate-fadeIn animation-delay-200">
            3D 이모지 하나로 눈길을 사로잡는 썸네일을,
            <br />단 1분만에 뚝딱
          </p>
          <div className="relative">
            <div className="absolute inset-0 bg-[#7371FC] blur-xl opacity-20 animate-pulse" />
            <button className="relative bg-[#7371FC] text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 animate-fadeIn animation-delay-400">
              무료로 시작하기
              <Sparkles className="inline-block ml-2" size={20} />
            </button>
          </div>

          <div className="absolute bottom-8 animate-bounce">
            <ChevronDown size={32} className="text-gray-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="min-h-screen relative flex items-center justify-center py-20">
        <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center px-4">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200 to-green-200 rounded-full blur-3xl opacity-30" />

          <h2 className="text-5xl font-bold mb-16 text-center animate-fadeIn">
            복잡한 디자인 툴은 이제 그만
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative z-10">
            <FeatureCard
              icon={MousePointerClick}
              title="클릭 한 번으로 추가되는 3D 이모지"
              description="수백 개의 이모지 중 마음에 드는 것을 골라보세요"
              delay={0}
            />
            <FeatureCard
              icon={Layout}
              title="드래그로 끝나는 레이아웃 배치"
              description="복잡한 도구 없이 드래그만으로 완성하세요"
              delay={200}
            />
            <FeatureCard
              icon={Palette}
              title="50+ 프리셋 템플릿"
              description="미리 준비된 템플릿으로 더 빠르게 제작하세요"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="min-h-screen relative flex items-center justify-center py-20">
        <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20" />
              <h2 className="relative text-4xl font-bold mb-6 animate-slideLeft">
                수백 개의 3D 이모지로
                <br />
                당신의 이야기를 생동감 있게
              </h2>
              <p className="relative text-xl text-gray-600 animate-slideLeft animation-delay-200">
                트렌디한 3D 이모지로 썸네일에 생동감을 더해보세요
              </p>
            </div>
            <div className="relative animate-slideRight">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl blur-2xl opacity-20" />
              <img
                src="/api/placeholder/600/400"
                alt="3D 이모지 라이브러리"
                className="relative rounded-2xl shadow-2xl w-full transform hover:scale-105 transition-transform"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-32">
            <div className="relative order-2 md:order-1 animate-slideLeft">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl blur-2xl opacity-20" />
              <img
                src="/api/placeholder/600/400"
                alt="템플릿 갤러리"
                className="relative rounded-2xl shadow-2xl w-full transform hover:scale-105 transition-transform"
              />
            </div>
            <div className="relative order-1 md:order-2">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20" />
              <h2 className="relative text-4xl font-bold mb-6 animate-slideRight">
                클릭 한 번으로 완성되는
                <br />
                프로페셔널한 디자인
              </h2>
              <p className="relative text-xl text-gray-600 animate-slideRight animation-delay-200">
                50개 이상의 미리 준비된 템플릿으로
                <br />
                순식간에 멋진 썸네일을 만들어보세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="min-h-screen relative flex items-center justify-center py-20">
        <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center px-4 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50 to-transparent" />

          <h2 className="relative text-5xl font-bold mb-12 animate-fadeIn">
            더 나은 썸네일 메이커를
            <br />
            함께 만들어요
          </h2>

          <div className="relative flex flex-col md:flex-row gap-8 text-xl animate-fadeIn animation-delay-200">
            <a
              href="mailto:selina202015@gmail.com"
              className="flex items-center gap-3 px-8 py-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <Mail className="text-[#7371FC]" />
              <span className="text-gray-700">selina202015@gmail.com</span>
            </a>
            <a
              href="https://github.com/sumi-0011/Thumbnail-Maker"
              className="flex items-center gap-3 px-8 py-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <span className="text-gray-700">GitHub</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
