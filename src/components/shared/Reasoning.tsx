/**
 * Reasoning — adapted from ai-elements (elements.ai-sdk.dev/components/reasoning)
 * Stripped of streamdown/markdown rendering; uses Compass tokens + lucide-react icons.
 * Auto-opens while isStreaming, auto-closes 1 s after streaming ends.
 */
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDownIcon } from 'lucide-react';

/* ── Context ──────────────────────────────────────────────────────── */
interface ReasoningContextValue {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number | undefined;
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

export const useReasoning = () => {
  const ctx = useContext(ReasoningContext);
  if (!ctx) throw new Error('Reasoning components must be used within <Reasoning>');
  return ctx;
};

/* ── Shimmer text ─────────────────────────────────────────────────── */
const ShimmerText = ({ children }: { children: ReactNode }) => (
  <span className="shimmer-text">{children}</span>
);

/* ── Root ─────────────────────────────────────────────────────────── */
export interface ReasoningProps {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  children?: ReactNode;
  className?: string;
}

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

export const Reasoning = memo(({
  className,
  isStreaming = false,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  duration: durationProp,
  children,
}: ReasoningProps) => {
  const resolvedDefault = defaultOpen ?? isStreaming;
  const [isOpen, setIsOpenState] = useState(resolvedDefault);
  const [duration, setDuration] = useState<number | undefined>(durationProp);
  const isOpenRef = useRef(isOpen);
  const hasEverStreamedRef = useRef(isStreaming);
  const [hasAutoClosed, setHasAutoClosed] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  // Sync controlled open
  const isOpenValue = controlledOpen !== undefined ? controlledOpen : isOpen;
  const setIsOpen = useCallback((next: boolean) => {
    setIsOpenState(next);
    isOpenRef.current = next;
    onOpenChange?.(next);
  }, [onOpenChange]);

  // Track streaming duration
  useEffect(() => {
    if (isStreaming) {
      hasEverStreamedRef.current = true;
      if (startTimeRef.current === null) startTimeRef.current = Date.now();
    } else if (startTimeRef.current !== null) {
      setDuration(Math.ceil((Date.now() - startTimeRef.current) / MS_IN_S));
      startTimeRef.current = null;
    }
  }, [isStreaming]);

  // Auto-open when streaming starts
  useEffect(() => {
    if (isStreaming && !isOpenRef.current) setIsOpen(true);
  }, [isStreaming, setIsOpen]);

  // Auto-close 1s after streaming ends
  useEffect(() => {
    if (hasEverStreamedRef.current && !isStreaming && isOpenValue && !hasAutoClosed) {
      const t = setTimeout(() => {
        setIsOpen(false);
        setHasAutoClosed(true);
      }, AUTO_CLOSE_DELAY);
      return () => clearTimeout(t);
    }
  }, [isStreaming, isOpenValue, setIsOpen, hasAutoClosed]);

  const ctx = useMemo(
    () => ({ duration, isOpen: isOpenValue, isStreaming, setIsOpen }),
    [duration, isOpenValue, isStreaming, setIsOpen],
  );

  return (
    <ReasoningContext.Provider value={ctx}>
      <Collapsible.Root
        className={`flex flex-col gap-1 ${className ?? ''}`}
        open={isOpenValue}
        onOpenChange={setIsOpen}
      >
        {children}
      </Collapsible.Root>
    </ReasoningContext.Provider>
  );
});
Reasoning.displayName = 'Reasoning';

/* ── Trigger ──────────────────────────────────────────────────────── */
export interface ReasoningTriggerProps extends ComponentProps<typeof Collapsible.Trigger> {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode;
}

const defaultMessage = (isStreaming: boolean, duration?: number) => {
  if (isStreaming || duration === 0) return <ShimmerText>Thinking...</ShimmerText>;
  if (duration === undefined) return <span>Thought for a few seconds</span>;
  return <span>Thought for {duration}s</span>;
};

export const ReasoningTrigger = memo(({
  className,
  children,
  getThinkingMessage = defaultMessage,
  ...props
}: ReasoningTriggerProps) => {
  const { isStreaming, isOpen, duration } = useReasoning();

  return (
    <Collapsible.Trigger
      className={`flex items-center gap-2 text-secondary text-sm hover:text-primary transition-colors duration-[50ms] ${className ?? ''}`}
      {...props}
    >
      {children ?? (
        <>
          <svg width="20" height="20" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="shrink-0" style={{ width: 20, height: 20 }}>
            <circle cx="32" cy="32" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="0s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
            <circle cx="32" cy="14.08" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.123s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
            <circle cx="44.67" cy="19.33" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.247s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
            <circle cx="49.92" cy="32" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.370s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
            <circle cx="44.67" cy="44.67" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.494s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
            <circle cx="32" cy="49.92" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.617s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
            <circle cx="19.33" cy="44.67" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.741s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
            <circle cx="14.08" cy="32" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.864s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
            <circle cx="19.33" cy="19.33" r="4.8" fill="#3C53E7"><animate attributeName="opacity" values="1;0;1" dur="1.111s" begin="-0.988s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"/></circle>
          </svg>
          {getThinkingMessage(isStreaming, duration)}
          <ChevronDownIcon
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </>
      )}
    </Collapsible.Trigger>
  );
});
ReasoningTrigger.displayName = 'ReasoningTrigger';

/* ── Content ──────────────────────────────────────────────────────── */
export interface ReasoningContentProps extends ComponentProps<typeof Collapsible.Content> {
  children?: ReactNode;
}

export const ReasoningContent = memo(({ className, children, ...props }: ReasoningContentProps) => (
  <Collapsible.Content
    className={`overflow-hidden data-[state=open]:animate-[slideDown_150ms_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-[slideUp_150ms_cubic-bezier(0.16,1,0.3,1)] ${className ?? ''}`}
    {...props}
  >
    <div className="pt-2 text-sm text-secondary">
      {children}
    </div>
  </Collapsible.Content>
));
ReasoningContent.displayName = 'ReasoningContent';
