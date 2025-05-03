/**
 * Declarações de tipos para módulos
 * Resolve os problemas de "Cannot find module X or its corresponding type declarations"
 */

// React
declare module 'react' {
  export * from 'react';
  
  // Hooks
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void | undefined), deps?: ReadonlyArray<any>): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function useReducer<R extends React.Reducer<any, any>, I>(
    reducer: R,
    initializerArg: I & React.ReducerState<R>,
    initializer?: (arg: I & React.ReducerState<R>) => React.ReducerState<R>
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export function useMemo<T>(factory: () => T, deps: ReadonlyArray<any> | undefined): T;
  export function useRef<T = undefined>(initialValue?: T): React.MutableRefObject<T>;
  export function useLayoutEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
  export function useImperativeHandle<T, R extends T>(ref: React.Ref<T> | undefined, init: () => R, deps?: ReadonlyArray<any>): void;
  export function useDebugValue<T>(value: T, format?: (value: T) => any): void;
  
  // Types
  export type FC<P = {}> = React.FunctionComponent<P>;
  export type ReactNode = React.ReactNode;
  export type CSSProperties = React.CSSProperties;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type MouseEvent<T = Element> = React.MouseEvent<T>;
  
  // Componentes
  export const Suspense: React.FC<{
    fallback: React.ReactNode;
    children?: React.ReactNode;
  }>;
}

// Next.js
declare module 'next/navigation' {
  export const useRouter: () => {
    push: (url: string) => void;
    replace: (url: string) => void;
    prefetch: (url: string) => void;
    back: () => void;
    forward: () => void;
  };
}

declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: any;
  }
}

declare module 'next/dynamic' {
  import { ComponentType } from 'react';
  
  interface DynamicOptions {
    loading?: ComponentType;
    ssr?: boolean;
    [key: string]: any;
  }
  
  export default function dynamic<P = {}>(
    dynamicImport: () => Promise<ComponentType<P> | { default: ComponentType<P> }>,
    options?: DynamicOptions
  ): ComponentType<P>;
}

// Lucide React
declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  
  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    className?: string;
    fill?: string;
  }
  
  export const Play: FC<IconProps>;
  export const Pause: FC<IconProps>;
  export const Volume2: FC<IconProps>;
  export const VolumeX: FC<IconProps>;
  export const Download: FC<IconProps>;
  export const Maximize: FC<IconProps>;
  export const FileText: FC<IconProps>;
  export const Heart: FC<IconProps>;
  export const Target: FC<IconProps>;
  export const BarChart2: FC<IconProps>;
  export const BookOpen: FC<IconProps>;
  export const Clock: FC<IconProps>;
  export const Share2: FC<IconProps>;
  export const Globe: FC<IconProps>;
  export const Activity: FC<IconProps>;
  export const Filter: FC<IconProps>;
  export const Tag: FC<IconProps>;
  export const Facebook: FC<IconProps>;
  export const ExternalLink: FC<IconProps>;
  export const ChevronRight: FC<IconProps>;
  export const TrendingUp: FC<IconProps>;
  export const BarChart: FC<IconProps>;
  export const LockOpen: FC<IconProps>;
  export const ArrowLeft: FC<IconProps>;
  export const X: FC<IconProps>;
  export const MenuIcon: FC<IconProps>;
  export const Settings: FC<IconProps>;
  export const Plus: FC<IconProps>;
  export const Calendar: FC<IconProps>;
  export const List: FC<IconProps>;
  export const Search: FC<IconProps>;
  export const ChevronDown: FC<IconProps>;
  export const Flame: FC<IconProps>;
  export const LayoutGrid: FC<IconProps>;
  export const Loader: FC<IconProps>;
}

// next-i18next
declare module 'next-i18next' {
  export function useTranslation(namespace?: string | string[]): {
    t: (key: string, options?: any) => string;
    i18n: {
      language: string;
      [key: string]: any;
    };
  };
}

// framer-motion
declare module 'framer-motion' {
  import * as React from 'react';
  
  interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: any;
    [key: string]: any;
  }
  
  type MotionComponent<P = {}> = React.ComponentType<P & MotionProps>;
  
  export const motion: {
    div: MotionComponent<React.HTMLAttributes<HTMLDivElement>>;
    span: MotionComponent<React.HTMLAttributes<HTMLSpanElement>>;
    button: MotionComponent<React.ButtonHTMLAttributes<HTMLButtonElement>>;
    a: MotionComponent<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    ul: MotionComponent<React.HTMLAttributes<HTMLUListElement>>;
    li: MotionComponent<React.LiHTMLAttributes<HTMLLIElement>>;
    svg: MotionComponent<React.SVGAttributes<SVGElement>>;
    path: MotionComponent<React.SVGAttributes<SVGPathElement>>;
    [key: string]: MotionComponent<any>;
  };
  
  export const AnimatePresence: React.FC<{
    exitBeforeEnter?: boolean;
    initial?: boolean;
    onExitComplete?: () => void;
    custom?: any;
    children?: React.ReactNode;
  }>;
}

// recharts
declare module 'recharts' {
  import * as React from 'react';
  
  interface CommonProps {
    width?: number;
    height?: number;
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    [key: string]: any;
  }
  
  export const LineChart: React.FC<CommonProps>;
  export const Line: React.FC<any>;
  export const BarChart: React.FC<CommonProps>;
  export const Bar: React.FC<any>;
  export const XAxis: React.FC<any>;
  export const YAxis: React.FC<any>;
  export const CartesianGrid: React.FC<any>;
  export const Tooltip: React.FC<any>;
  export const ResponsiveContainer: React.FC<any>;
  export const Cell: React.FC<any>;
  export const Area: React.FC<any>;
  export const RechartsBarChart: React.FC<CommonProps>;
}
