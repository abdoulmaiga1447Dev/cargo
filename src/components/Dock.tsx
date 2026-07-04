'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence
} from 'motion/react';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

export type DockItemData = {
  id: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  activeTab?: string;
  className?: string;
  distance?: number;
  panelWidth?: number;
  dockWidth?: number;
  baseItemSize?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  key?: React.Key;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseY: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  label?: React.ReactNode;
  isActive?: boolean;
};

function DockItem({
  children,
  className = '',
  onClick,
  mouseY,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
  isActive
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseY, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      y: 0,
      height: baseItemSize
    };
    return val - rect.y - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const bgClass = isActive 
    ? 'bg-[#1b172a] text-purple-400 border-[#7c3aed] shadow-[0_0_15px_rgba(124,58,237,0.45)]' 
    : 'bg-[#120F17] text-gray-400 border-[#2d2640]/60 hover:border-[#5848aa] hover:text-white hover:bg-[#1a1628] shadow-sm hover:shadow-md';

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex items-center justify-center rounded-2xl border transition-all cursor-pointer ${bgClass} ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-label={typeof label === 'string' ? label : undefined}
    >
      {Children.map(children, child =>
        React.isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
          : child
      )}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.15 }}
          className={`${className} absolute left-full top-1/2 -translate-y-1/2 ml-4 w-fit whitespace-pre rounded-lg border border-[#2d2640] bg-[#120F17] px-3 py-1.5 text-xs font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.6)] z-50`}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = '' }: DockIconProps) {
  return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  activeTab,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 150,
  panelWidth = 68,
  dockWidth = 256,
  baseItemSize = 50
}: DockProps) {
  const mouseY = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxWithCalculated = useMemo(() => Math.max(dockWidth, magnification + magnification / 2 + 4), [magnification]);
  const widthRow = useTransform(isHovered, [0, 1], [panelWidth, maxWithCalculated]);
  const width = useSpring(widthRow, spring);

  return (
    <motion.div style={{ width, scrollbarWidth: 'none' }} className="relative flex flex-col justify-center items-center my-2">
      <motion.div
        onMouseMove={({ clientY }) => {
          isHovered.set(1);
          mouseY.set(clientY);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseY.set(Infinity);
        }}
        className={`${className} absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-fit gap-4 rounded-3xl bg-[#0b0811]/90 backdrop-blur-md border border-[#2d2640]/80 p-3 shadow-inner`}
        style={{ width: panelWidth }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => {
          const isActive = item.id === activeTab;
          return (
            <DockItem
              key={item.id || index}
              onClick={item.onClick}
              className={item.className}
              mouseY={mouseY}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
              label={item.label}
              isActive={isActive}
            >
              <DockIcon>{item.icon}</DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
