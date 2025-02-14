import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Mail,
  Sparkles,
  Palette,
  Layout,
  MousePointerClick,
  Wand2,
  Clock,
  Image,
  Bot,
  Users,
  BrainCircuit,
  Download,
  PenTool,
} from "lucide-react";
import {
  CustomCursor,
  FloatingEmoji,
  GradientBlob,
  Card3D,
} from "./Components";
import {
  FeatureCard,
  TimelineItem,
  Statistic,
  ThumbnailCard,
} from "./Components";
import { darkTheme } from "./theme";
import { Link, Events, scrollSpy } from "react-scroll";
import ReactPageScroller from "react-page-scroller";

const LandingPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  React.useEffect(() => {
    Events.scrollEvent.register("begin", () => {});
    Events.scrollEvent.register("end", () => {});
    scrollSpy.update();

    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  const features = [
    {
      icon: MousePointerClick,
      title: "클릭 한 번으로 이모지 추가",
      description: "수백 개의 3D 이모지를 클릭 한 번으로 추가하고 배치하세요.",
      gradient: darkTheme.colors.gradient.primary,
    },
    {
      icon: Layout,
      title: "드래그로 완성되는 레이아웃",
      description: "복잡한 도구 없이 드래그 & 드롭으로 쉽게 배치하세요.",
      gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFB6C1 100%)",
    },
    {
      icon: Layout,
      title: "50+ 프리셋 템플릿",
      description: "미리 준비된 프로페셔널한 템플릿으로 시간을 절약하세요.",
      gradient: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
    },
  ];

  const steps = [
    {
      icon: Image,
      title: "템플릿 선택",
      description: "다양한 프리셋 중에서 마음에 드는 템플릿을 선택하세요.",
    },
    {
      icon: Palette,
      title: "이모지 & 태그 추가",
      description: "3D 이모지와 태그를 추가하여 썸네일을 꾸며보세요.",
    },
    {
      icon: Layout,
      title: "레이아웃 조정",
      description: "드래그 & 드롭으로 요소들의 위치를 자유롭게 조정하세요.",
    },
    {
      icon: Download,
      title: "완성 & 다운로드",
      description: "작업이 완료되면 고품질 이미지로 다운로드하세요.",
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "활성 사용자",
      trend: { value: 27, isPositive: true },
    },
    {
      icon: Image,
      value: "50,000+",
      label: "생성된 썸네일",
      trend: { value: 32, isPositive: true },
    },
    {
      icon: Clock,
      value: "5분",
      label: "평균 제작 시간",
      trend: { value: 15, isPositive: false },
    },
  ];

  const examples = [
    {
      title: "React로 시작하는 웹 개발",
      emoji: "⚛️",
      tags: ["React", "웹개발", "프론트엔드"],
      style: "modern",
    },
    {
      title: "TypeScript 완벽 가이드",
      emoji: "📘",
      tags: ["TypeScript", "개발", "프로그래밍"],
      style: "minimal",
    },
    {
      title: "디자인 시스템 구축하기",
      emoji: "🎨",
      tags: ["UI/UX", "디자인", "시스템"],
      style: "bold",
    },
    {
      title: "Next.js 마스터하기",
      emoji: "🚀",
      tags: ["Next.js", "React", "SSR"],
      style: "modern",
    },
  ];

  const comingSoonFeatures = [
    {
      icon: BrainCircuit,
      title: "AI 기반 태그 추천",
      description:
        "블로그 내용을 분석하여 최적의 태그를 자동으로 추천해드려요.",
      gradient: "linear-gradient(135deg, #6B46C1 0%, #B794F4 100%)",
    },
    {
      icon: PenTool,
      title: "자유로운 캔버스 크기",
      description: "다양한 플랫폼에 맞는 썸네일 크기를 자유롭게 설정하세요.",
      gradient: "linear-gradient(135deg, #F6AD55 0%, #ED8936 100%)",
    },
  ];

  // Navigation items
  const navItems = [
    { id: "hero", name: "홈" },
    { id: "features", name: "주요 기능" },
    { id: "examples", name: "예시" },
    { id: "stats", name: "통계" },
    { id: "howto", name: "사용법" },
    { id: "coming-soon", name: "예정 기능" },
    { id: "contact", name: "문의하기" },
  ];

  const handlePageChange = (number: number) => {
    setCurrentPage(number);
  };

  const handleNavigationClick = (index: number) => {
    setCurrentPage(index);
  };

  const shouldAnimate = (sectionId: string) => {
    const targetIndex = navItems.findIndex((item) => item.id === sectionId);
    const threshold = 1.5;

    return Math.abs(currentPage - targetIndex) <= threshold;
  };

  return (
    <div className="h-screen relative">
      <CustomCursor />

      {/* 오른쪽 Navigation */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col gap-2 items-end">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavigationClick(index)}
              className="group relative flex items-center"
            >
              {/* 텍스트 - 오른쪽 정렬 */}
              <span
                className={`
                text-sm font-medium
                transition-all duration-300
                transform origin-right
                ${
                  currentPage === index
                    ? "text-text-primary -translate-x-2"
                    : "text-text-secondary/50 translate-x-0 opacity-30 group-hover:opacity-100 group-hover:-translate-x-2"
                }
              `}
              >
                {item.name}
              </span>

              {/* 활성 표시 점 - 텍스트 오른쪽에 배치 */}
              <div
                className={`
                w-2 h-2 rounded-full ml-4
                transition-all duration-300 ease-out
                ${
                  currentPage === index
                    ? "bg-accent-primary scale-100"
                    : "bg-text-secondary/30 scale-75 group-hover:scale-100"
                }
              `}
              />
            </button>
          ))}
        </div>
      </div>

      <ReactPageScroller
        pageOnChange={handlePageChange}
        customPageNumber={currentPage}
        // animationTimer={800}
        // blockScrollDown={isScrolling}
        // blockScrollUp={isScrolling}
        renderAllPagesOnFirstRender={true}
      >
        {/* Hero Section */}
        <div
          name="hero"
          className="h-screen w-full flex items-center justify-center overflow-hidden"
        >
          {/* 배경 효과 강화 */}
          <GradientBlob
            color={darkTheme.colors.gradient.primary}
            style="top-20 left-20 w-[500px] h-[500px] animate-blob opacity-30"
          />
          <GradientBlob
            color={darkTheme.colors.gradient.secondary}
            style="bottom-20 right-20 w-[500px] h-[500px] animate-blob-delay opacity-30"
          />

          {/* 배경 파티클 효과 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {shouldAnimate("hero") &&
              [...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-accent-primary/30 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  animate={{
                    x: [
                      Math.random() * window.innerWidth,
                      Math.random() * window.innerWidth,
                    ],
                    y: [
                      Math.random() * window.innerHeight,
                      Math.random() * window.innerHeight,
                    ],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 1],
                  }}
                />
              ))}
          </div>

          <div className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-8 gap-12">
            {/* 왼쪽 텍스트 영역 */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <motion.span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 text-accent-primary"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  }}
                >
                  <Bot size={16} className="animate-pulse" />
                  <span className="text-sm font-medium">
                    개발자를 위한 오픈소스 썸네일 메이커
                  </span>
                </motion.span>

                <motion.h1
                  className="text-6xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  블로그 썸네일,
                  <br />
                  <motion.span
                    className="text-gradient bg-gradient-to-r from-accent-primary to-accent-secondary inline-block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    이제 코딩하듯 빠르게
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-xl text-text-secondary leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  디자인에 시간 쓰지 마세요!
                  <motion.span
                    className="inline-block"
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.2, 1.2, 1.2, 1],
                    }}
                    transition={{
                      duration: 1,
                      delay: 1,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    🎨
                  </motion.span>
                  <br />
                  3D 이모지로 깔끔한 썸네일을 뚝딱 만들어보세요.
                  <br />
                  <span className="text-accent-primary">100% 무료</span>, 완전
                  오픈소스입니다.
                </motion.p>

                <motion.div
                  className="flex items-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <Card3D glowOnHover>
                    <motion.a
                      href="https://github.com/sumi-0011/Thumbnail-Maker"
                      target="_blank"
                      className="relative group px-8 py-4 bg-accent-primary rounded-lg text-xl font-semibold overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                      />
                      <span className="relative flex items-center gap-2">
                        GitHub에서 보기
                        <BrainCircuit className="inline-block" size={20} />
                      </span>
                    </motion.a>
                  </Card3D>
                </motion.div>

                <motion.div
                  className="flex items-center gap-4 text-sm text-text-secondary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  {[
                    "⭐ MIT 라이선스",
                    "🛠️ React + TypeScript",
                    "💻 누구나 기여 가능",
                  ].map((text, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                      className="hover:text-accent-primary transition-colors cursor-default"
                    >
                      {text}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* 오른쪽 프리뷰 영역 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-1 relative"
            >
              <Card3D className="transform hover:rotate-6 transition-transform duration-300">
                <motion.div
                  className="relative bg-background-secondary rounded-2xl p-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                      <motion.div
                        className="w-12 h-12 rounded-lg bg-accent-primary/20 flex items-center justify-center"
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        ⚛️
                      </motion.div>
                      <div className="flex-1">
                        <motion.div
                          className="h-6 w-3/4 bg-background-tertiary rounded"
                          animate={{ opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                          className="h-4 w-1/2 bg-background-tertiary rounded mt-2"
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 0.3,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {["React", "Tutorial", "Web"].map((tag, i) => (
                        <motion.span
                          key={i}
                          className="px-3 py-1 rounded-full bg-background-tertiary text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Card3D>

              {/* 3D 이모지들 */}
              {[
                { emoji: "⚛️", style: "top-0 right-0", size: "lg", delay: 1.2 },
                {
                  emoji: "📘",
                  style: "bottom-20 left-0",
                  size: "xl",
                  delay: 1.4,
                },
                {
                  emoji: "💻",
                  style: "top-40 left-20",
                  size: "md",
                  delay: 1.6,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: item.delay,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <FloatingEmoji
                    emoji={item.emoji}
                    style={item.style}
                    size={item.size}
                    interactive
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div
          name="features"
          className="min-h-screen w-full py-24 flex items-center justify-center"
        >
          <motion.div
            className="relative w-full max-w-7xl mx-auto px-8"
            initial={{ opacity: 0, y: 50 }}
            animate={shouldAnimate("features") ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-2 rounded-full bg-accent-primary/10 text-accent-primary text-sm font-medium mb-6">
                심플한 기능
              </span>
              <h2 className="text-5xl font-bold mb-6">
                개발자를 위한
                <br />
                <span className="text-gradient bg-gradient-to-r from-accent-primary to-accent-secondary">
                  3가지 핵심 기능
                </span>
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                디자인 시간은 줄이고, 개발에만 집중하세요.
                <br />
                필요한 기능만 담았습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <Card3D key={i} delay={i * 100} glowOnHover>
                  <div className="relative p-8 bg-background-tertiary rounded-2xl h-full">
                    <feature.icon
                      size={32}
                      className="text-accent-primary mb-6"
                    />
                    <h3 className="text-2xl font-semibold mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary">{feature.description}</p>
                  </div>
                </Card3D>
              ))}
            </div>

            {/* 기술 스택 & 오픈소스 정보 */}
            <div className="mt-24 p-8 bg-background-tertiary rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">🛠️ 기술 스택</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-background-secondary">
                      React
                    </span>
                    <span className="px-3 py-1 rounded-full bg-background-secondary">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 rounded-full bg-background-secondary">
                      Framer Motion
                    </span>
                    <span className="px-3 py-1 rounded-full bg-background-secondary">
                      TailwindCSS
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">📦 오픈소스</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-background-secondary">
                      MIT License
                    </span>
                    <span className="px-3 py-1 rounded-full bg-background-secondary">
                      누구나 기여 가능
                    </span>
                    <span className="px-3 py-1 rounded-full bg-background-secondary">
                      자유로운 사용
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Example Thumbnails Section */}
        <div
          name="examples"
          className="h-screen w-full flex items-center justify-center bg-background-secondary"
        >
          <GradientBlob
            color={darkTheme.colors.gradient.primary}
            style="top-1/2 left-1/4 w-[400px] h-[400px]"
            opacity={0.05}
          />

          <motion.div
            className="relative w-full max-w-6xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={shouldAnimate("examples") ? { opacity: 1 } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6">썸네일 예시</h2>
              <p className="text-xl text-text-secondary">
                다양한 스타일의 썸네일을 쉽고 빠르게 만들어보세요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {examples.map((example, i) => (
                <Card3D key={i} delay={i} glowOnHover>
                  <ThumbnailCard {...example} />
                </Card3D>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Statistics Section */}
        <div
          name="stats"
          className="h-screen w-full flex items-center justify-center"
        >
          <GradientBlob
            color={darkTheme.colors.gradient.secondary}
            style="center-center w-[800px] h-[800px]"
            opacity={0.05}
          />

          <motion.div
            className="relative w-full max-w-6xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={shouldAnimate("stats") ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <Statistic key={i} {...stat} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* How It Works Section */}
        <div
          name="howto"
          className="h-screen w-full flex items-center justify-center bg-background-secondary"
        >
          <GradientBlob
            color={darkTheme.colors.gradient.primary}
            style="top-1/4 left-0 w-[600px] h-[600px]"
          />

          <motion.div
            className="relative w-full max-w-6xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={shouldAnimate("howto") ? { opacity: 1 } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6">이렇게 만들어보세요</h2>
              <p className="text-xl text-text-secondary">
                단 4단계로 완성되는 매력적인 썸네일
              </p>
            </div>

            <div className="flex flex-col gap-16">
              {steps.map((step, i) => (
                <TimelineItem key={i} {...step} step={i + 1} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Coming Soon Section */}
        <div
          name="coming-soon"
          className="h-screen w-full flex items-center justify-center"
        >
          <div className="relative w-full max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6">곧 추가될 기능들</h2>
              <p className="text-xl text-text-secondary">
                더 편리하고 강력한 기능들이 준비되고 있어요
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {comingSoonFeatures.map((feature, i) => (
                <Card3D key={i} delay={i} glowOnHover>
                  <div className="p-8 bg-background-tertiary rounded-2xl">
                    <feature.icon
                      size={32}
                      className="text-accent-primary mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary">{feature.description}</p>
                    <div
                      className="absolute inset-0 opacity-10 rounded-2xl"
                      style={{ background: feature.gradient }}
                    />
                  </div>
                </Card3D>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div
          name="contact"
          className="h-screen w-full flex items-center justify-center bg-background-secondary"
        >
          <GradientBlob
            color={darkTheme.colors.gradient.primary}
            style="center-center w-[800px] h-[800px]"
          />

          <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center px-4 text-center">
            <h2 className="relative text-5xl font-bold mb-12">
              더 나은 썸네일 메이커를
              <br />
              함께 만들어요
            </h2>

            <div className="relative flex flex-col md:flex-row gap-8 text-xl">
              <Card3D delay={0} glowOnHover>
                <a
                  href="mailto:selina202015@gmail.com"
                  className="flex items-center gap-3 px-8 py-4 bg-background-tertiary rounded-xl hover:bg-opacity-80 transition-all"
                >
                  <Mail className="text-accent-primary" />
                  <span className="text-text-secondary">
                    selina202015@gmail.com
                  </span>
                </a>
              </Card3D>

              <Card3D delay={200} glowOnHover>
                <a
                  href="https://github.com/sumi-0011/Thumbnail-Maker"
                  className="flex items-center gap-3 px-8 py-4 bg-background-tertiary rounded-xl hover:bg-opacity-80 transition-all"
                >
                  <span className="text-text-secondary">GitHub</span>
                </a>
              </Card3D>
            </div>

            <motion.div
              className="mt-16 text-text-secondary"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p>Thumbnail Maker는 오픈소스 프로젝트입니다.</p>
              <p>여러분의 의견과 기여를 환영합니다!</p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div
          name="footer"
          className="h-screen w-full flex items-center justify-center"
        >
          <div className="relative w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-text-secondary">
              © 2024 Thumbnail Maker. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-text-secondary hover:text-accent-primary transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-accent-primary transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-accent-primary transition-colors"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </ReactPageScroller>
    </div>
  );
};

export default LandingPage;
