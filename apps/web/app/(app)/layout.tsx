"use client";

import { AppLayout } from "@/components/app-layout";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
