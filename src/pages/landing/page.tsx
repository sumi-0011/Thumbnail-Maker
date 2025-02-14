import React from "react";
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

const LandingPage: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-background-primary text-text-primary overflow-x-hidden">
      <CustomCursor />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20">
        <GradientBlob
          color={darkTheme.colors.gradient.primary}
          style="top-20 left-20 w-96 h-96"
        />
        <GradientBlob
          color={darkTheme.colors.gradient.secondary}
          style="bottom-20 right-20 w-96 h-96"
        />

        <FloatingEmoji
          emoji="🎨"
          style="top-20 left-1/4"
          size="lg"
          interactive
        />
        <FloatingEmoji
          emoji="✨"
          style="top-40 right-1/4"
          size="md"
          interactive
        />
        <FloatingEmoji
          emoji="🚀"
          style="bottom-32 left-1/3"
          size="lg"
          interactive
        />
        <FloatingEmoji
          emoji="💫"
          style="bottom-40 right-1/3"
          size="md"
          interactive
        />

        <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl font-bold mb-6">
              블로그 썸네일이
              <br />
              어려운 당신에게
            </h1>
            <p className="text-2xl text-text-secondary mb-12">
              3D 이모지 하나로 눈길을 사로잡는 썸네일을,
              <br />단 1분만에 뚝딱
            </p>
          </motion.div>

          <Card3D glowOnHover>
            <button
              className="relative group px-8 py-4 bg-accent-primary rounded-lg text-xl font-semibold
                             hover:bg-opacity-90 transition-all duration-300"
            >
              <div
                className="absolute inset-0 rounded-lg opacity-25 bg-gradient-to-r from-white/0 via-white/5 to-white/0
                             group-hover:opacity-50 transition-opacity duration-500 animate-shimmer"
              />
              <span className="relative flex items-center gap-2">
                무료로 시작하기
                <Sparkles className="inline-block animate-pulse" size={20} />
              </span>
            </button>
          </Card3D>

          <motion.div
            className="absolute bottom-8"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown size={32} className="text-text-secondary" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32">
        <GradientBlob
          color={darkTheme.colors.gradient.secondary}
          style="top-0 right-0 w-[500px] h-[500px]"
        />

        <div className="relative w-full max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              복잡한 디자인 툴은 이제 그만
            </h2>
            <p className="text-xl text-text-secondary">
              누구나 쉽게 사용할 수 있는 직관적인 인터페이스로
              <br />
              프로페셔널한 썸네일을 제작하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Example Thumbnails Section */}
      <section className="relative py-32 bg-background-secondary">
        <GradientBlob
          color={darkTheme.colors.gradient.primary}
          style="top-1/2 left-1/4 w-[400px] h-[400px]"
          opacity={0.05}
        />

        <div className="relative w-full max-w-6xl mx-auto px-4">
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
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-32">
        <GradientBlob
          color={darkTheme.colors.gradient.secondary}
          style="center-center w-[800px] h-[800px]"
          opacity={0.05}
        />

        <div className="relative w-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <Statistic key={i} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 bg-background-secondary">
        <GradientBlob
          color={darkTheme.colors.gradient.primary}
          style="top-1/4 left-0 w-[600px] h-[600px]"
        />

        <div className="relative w-full max-w-6xl mx-auto px-4">
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
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="relative py-32">
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
      </section>

      {/* Contact Section */}
      <section className="relative py-32 bg-background-secondary">
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
      </section>

      {/* Footer */}
      <footer className="relative py-8 bg-background-primary">
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
      </footer>
    </div>
  );
};

export default LandingPage;
