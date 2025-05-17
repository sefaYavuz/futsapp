
declare module 'expo-router' {
    
  export function useRouter(): {
    push: (href: string) => void;
    back: () => void;
    params?: Record<string, string>;
  };

  export function useNavigation(): {
    goBack: () => void;
  };

  export function useLocalSearchParams<T extends Record<string, string>>(): T;

  export const Stack: {
    Screen: React.ComponentType<{
      options?: {
        headerShown?: boolean;
        title?: string;
      };
    }>;
  };

  export const Tabs: {
    Screen: React.ComponentType<{
      name: string;
      options?: {
        title?: string;
        tabBarIcon?: (props: { color: string }) => React.ReactNode;
      };
    }>;
  };

  export const Link: React.ComponentType<{
    href: string;
    asChild?: boolean;
    children: React.ReactNode;
  }>;
} 