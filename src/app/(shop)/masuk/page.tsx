"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SignInForm } from "@/components/forms/sign-in-form";

function SignInPageContent() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next");
  const validNext = nextUrl?.startsWith("/") ? nextUrl : "/";

  return <SignInForm nextUrl={validNext} />;
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SignInPageContent />
    </Suspense>
  );
}
