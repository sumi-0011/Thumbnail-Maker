import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { cn } from "src/lib/utils";

interface Carousel3DProps<T> {
  items: T[];
  renderItem: (item: T, index: number, isActive: boolean) => React.ReactNode;
  autoRotate?: boolean;
  rotationSpeed?: number;
  pauseOnHover?: boolean;
  onItemClick?: (item: T, index: number) => void;
  className?: string;
}

export function Carousel3D<T>({
  items,
  renderItem,
  autoRotate = true,
  rotationSpeed = 8000,
  pauseOnHover = true,
  onItemClick,
  className,
}: Carousel3DProps<T>) {
  const [isPaused, setIsPaused] = useState(false);
  const rotation = useMotionValue(0);
  const itemCount = items.length;
  const angleStep = 360 / itemCount;
  const radius = Math.max(280, itemCount * 35);

  useEffect(() => {
    if (!autoRotate || isPaused) return;

    const controls = animate(rotation, rotation.get() + 360, {
      duration: rotationSpeed / 1000,
      ease: "linear",
      repeat: Infinity,
    });

    return () => controls.stop();
  }, [autoRotate, isPaused, rotationSpeed, rotation]);

  const handleItemClick = useCallback(
    (item: T, index: number) => {
      if (onItemClick) {
        onItemClick(item, index);
      }
    },
    [onItemClick]
  );

  return (
    <div
      className={cn("relative w-full h-[400px]", className)}
      style={{ perspective: "1200px" }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          rotateY: rotation,
          transformStyle: "preserve-3d",
        }}
      >
        {items.map((item, index) => {
          const angle = index * angleStep;
          return (
            <CarouselItem
              key={index}
              angle={angle}
              radius={radius}
              rotation={rotation}
              onClick={() => handleItemClick(item, index)}
            >
              {renderItem(item, index, false)}
            </CarouselItem>
          );
        })}
      </motion.div>
    </div>
  );
}

interface CarouselItemProps {
  children: React.ReactNode;
  angle: number;
  radius: number;
  rotation: ReturnType<typeof useMotionValue<number>>;
  onClick?: () => void;
}

function CarouselItem({ children, angle, radius, rotation, onClick }: CarouselItemProps) {
  const itemRotation = useTransform(rotation, (r: number) => -r);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 cursor-pointer"
      style={{
        transform: `
          translateX(-50%)
          translateY(-50%)
          rotateY(${angle}deg)
          translateZ(${radius}px)
        `,
        transformStyle: "preserve-3d",
      }}
      onClick={onClick}
      whileHover={{ scale: 1.1, z: 50 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div style={{ rotateY: itemRotation }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
