"use client";

import { Suspense } from "react";
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Loading from "../loading";

export default function ContactPage() {
  return (
    <main className="tech-pattern-bg min-h-screen text-white">
      <Header />
      <Suspense fallback={<Loading />}>
        <Contact />
      </Suspense>
      <Footer />
    </main>
  );
}
