// app/types.d.ts
import 'next';

declare module 'next' {
  export interface LayoutProps {
    children: React.ReactNode;
    params: { lng: string } | any;
  }
}