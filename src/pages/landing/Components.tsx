import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Position,
  FloatingEmojiProps,
  GradientBlobProps,
  Card3DProps,
  FeatureProps,
  StatisticProps,
  TimelineItemProps,
} from "./types";
import { darkTheme } from "./theme";

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(target.closest('button, a, [role="button"]') !== null);
    };

    window.addEventListener("mousemove", (e) => {
      updatePosition(e);
      updateHoverState(e);
    });

    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 mix-blend-difference"
      animate={{
        scale: isHovering ? 1.5 : 1,
        x: position.x - 4,
        y: position.y - 4,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      <div
        className={`w-8 h-8 rounded-full bg-white ${
          isHovering ? "opacity-70" : "opacity-30"
        }`}
      />
    </motion.div>
  );
};

export const FloatingEmoji: React.FC<FloatingEmojiProps> = ({
  emoji,
  style,
  size = "md",
  interactive = false,
}) => {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  return (
    <motion.div
      className={`absolute ${style} ${interactive ? "cursor-pointer" : ""}`}
      animate={{ y: [0, -20, 0] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={interactive ? { scale: 1.1 } : undefined}
    >
      <div
        className={`${sizes[size]} bg-background-tertiary rounded-2xl shadow-lg 
                      flex items-center justify-center text-2xl backdrop-blur-sm
                      ${
                        interactive ? "hover:shadow-glow transition-shadow" : ""
                      }`}
      >
        {emoji}
      </div>
    </motion.div>
  );
};

export const GradientBlob: React.FC<GradientBlobProps> = ({
  color,
  style,
  blur = "blur-3xl",
  opacity = 0.1,
}) => (
  <motion.div
    className={`absolute ${style} rounded-full ${blur}`}
    style={{
      background: color,
      opacity,
    }}
    animate={{
      scale: [1, 1.1, 1],
      opacity: [opacity, opacity * 1.5, opacity],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export const Card3D: React.FC<Card3DProps> = ({
  children,
  delay = 0,
  className = "",
  intensity = 1,
  glowOnHover = false,
}) => {
  const [rotate, setRotate] = useState<Position>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setRotate({
      x: x * 20 * intensity,
      y: y * 20 * intensity,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setRotate({ x: 0, y: 0 });
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: delay * 0.1,
      }}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "all 0.3s ease",
      }}
    >
      {glowOnHover && isHovered && (
        <div className="absolute inset-0 bg-accent-primary opacity-20 blur-xl -z-10" />
      )}
      {children}
    </motion.div>
  );
};

export const FeatureCard: React.FC<FeatureProps> = ({
  icon: Icon,
  title,
  description,
  delay = 0,
  gradient = darkTheme.colors.gradient.primary,
}) => (
  <motion.div
    className="relative p-8 bg-background-secondary rounded-2xl overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: delay * 0.1 }}
    whileHover={{ y: -5 }}
  >
    <div
      className="absolute inset-0 opacity-10"
      style={{ background: gradient }}
    />
    <div className="relative">
      <div className="w-12 h-12 bg-background-tertiary rounded-xl flex items-center justify-center mb-6">
        <Icon size={24} className="text-accent-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-text-primary">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  </motion.div>
);

export const TimelineItem: React.FC<TimelineItemProps> = ({
  step,
  title,
  description,
  icon: Icon,
}) => (
  <motion.div
    className="relative flex gap-8 items-start"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: step * 0.1 }}
  >
    <div className="relative">
      <div className="w-12 h-12 bg-background-tertiary rounded-full flex items-center justify-center">
        <Icon size={24} className="text-accent-primary" />
      </div>
      {step < 4 && (
        <div className="absolute top-12 left-1/2 w-px h-16 bg-background-tertiary" />
      )}
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2 text-text-primary">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  </motion.div>
);

export const Statistic: React.FC<StatisticProps> = ({
  value,
  label,
  icon: Icon,
  trend,
}) => (
  <motion.div
    className="p-6 bg-background-secondary rounded-xl"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="w-10 h-10 bg-background-tertiary rounded-lg flex items-center justify-center">
        <Icon size={20} className="text-accent-primary" />
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 text-sm ${
            trend.isPositive ? "text-accent-success" : "text-accent-warning"
          }`}
        >
          <span>{trend.isPositive ? "↑" : "↓"}</span>
          <span>{Math.abs(trend.value)}%</span>
        </div>
      )}
    </div>
    <div className="text-3xl font-bold text-text-primary mb-1">{value}</div>
    <div className="text-text-secondary">{label}</div>
  </motion.div>
);

export const ThumbnailCard: React.FC<{
  title: string;
  emoji: string;
  tags: string[];
  style?: string;
}> = ({ title, emoji, tags, style = "minimal" }) => (
  <motion.div
    className="relative p-8 bg-background-secondary rounded-2xl overflow-hidden"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="text-6xl mb-6">{emoji}</div>
    <h3 className="text-xl font-semibold mb-4 text-text-primary">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="px-3 py-1 bg-background-tertiary rounded-full text-sm text-text-secondary"
        >
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
);
