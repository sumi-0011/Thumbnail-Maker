import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Mail,
  Sparkles,
  Palette,
  Layout,
  MousePointerClick,
  ChevronRight,
} from "lucide-react";

// 마우스 커서 효과 컴포넌트
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: { clientX: any; clientY: any }) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 w-8 h-8 bg-[#7371FC] bg-opacity-30 rounded-full blur-sm transform -translate-x-1/2 -translate-y-1/2 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: "all 0.1s ease",
      }}
    />
  );
};

// 스크롤 프로그레스 바
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.pageYOffset;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-[#7371FC] transition-all duration-200"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

// 네비게이션 도트
const NavigationDots = () => {
  const sections = ["hero", "features", "showcase", "examples", "contact"];
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
    };

    const observerCallback = (entries: any[]) => {
      entries.forEach(
        (entry: {
          isIntersecting: any;
          target: { id: React.SetStateAction<string> };
        }) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      );
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
      {sections.map((section) => (
        <a
          key={section}
          href={`#${section}`}
          className={`block w-3 h-3 my-4 rounded-full transition-all duration-300 
            ${
              activeSection === section
                ? "bg-[#7371FC] scale-125"
                : "bg-gray-300 hover:bg-[#7371FC] hover:scale-110"
            }`}
        />
      ))}
    </div>
  );
};

// 3D 카드 컴포넌트
const Card3D = ({ children }: { children: React.ReactNode }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef();

  const handleMouseMove = (e: { clientY: number; clientX: number }) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setRotate({ x: x * 20, y: y * 20 });
  };

  const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      className="relative transform-gpu transition-transform duration-200"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      {children}
    </div>
  );
};

// 예시 썸네일 데이터
const exampleThumbnails = [
  {
    title: "React 개발 환경 설정하기",
    emoji: "⚛️",
    tags: ["React", "개발환경", "webpack"],
  },
  {
    title: "Next.js로 블로그 만들기",
    emoji: "🚀",
    tags: ["Next.js", "블로그", "SSG"],
  },
  {
    title: "TypeScript 기초 문법",
    emoji: "📘",
    tags: ["TypeScript", "문법", "기초"],
  },
  { title: "UI/UX 디자인 원칙", emoji: "🎨", tags: ["디자인", "UI", "UX"] },
];

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-b from-[#F8F9FD] to-white overflow-x-hidden">
      <CustomCursor />
      <ScrollProgress />
      <NavigationDots />

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen relative flex items-center justify-center py-20"
      >
        {/* Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: 0.1,
                }}
              >
                ✨
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-4">
          <div className="relative mb-12">
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#7371FC] bg-opacity-10 rounded-full animate-pulse" />
            <h1 className="text-7xl font-bold mb-6 animate-fadeIn">
              블로그 썸네일이
              <br />
              어려운 당신에게
            </h1>
            <p className="text-2xl text-gray-600 mb-8 animate-fadeIn animation-delay-200">
              3D 이모지 하나로 눈길을 사로잡는 썸네일을,
              <br />단 1분만에 뚝딱
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-[#7371FC] blur-xl opacity-20 animate-pulse" />
            <button
              className="relative bg-[#7371FC] text-white px-8 py-4 rounded-lg text-xl font-semibold 
                             hover:bg-opacity-90 transition-all transform hover:scale-105 animate-fadeIn animation-delay-400
                             flex items-center gap-2"
            >
              무료로 시작하기
              <Sparkles className="inline-block" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="min-h-screen relative flex items-center justify-center py-20"
      >
        {/* ... Features content ... */}
      </section>

      {/* Showcase Section */}
      <section
        id="showcase"
        className="min-h-screen relative flex items-center justify-center py-20"
      >
        {/* ... Showcase content ... */}
      </section>

      {/* Examples Section - NEW */}
      <section
        id="examples"
        className="min-h-screen relative flex items-center justify-center py-20"
      >
        <div className="relative w-full max-w-6xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16">썸네일 예시</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {exampleThumbnails.map((thumb, i) => (
              <Card3D key={i}>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="text-6xl mb-4">{thumb.emoji}</div>
                  <h3 className="text-2xl font-bold mb-4">{thumb.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {thumb.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen relative flex items-center justify-center py-20"
      >
        {/* ... Contact content ... */}
      </section>
    </div>
  );
};

export default LandingPage;
