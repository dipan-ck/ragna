import ChatInterface from "@/components/sections/ChatInterface";
import Features from "@/components/sections/Features";
import Hero from "@/components/sections/Hero";
import KnowledgeBase from "@/components/sections/KnowledgeBase";
import Image from "next/image";

export default function Home() {
  return (
    <div>
    <Hero/>
    <Features/>
    <KnowledgeBase/>
    <ChatInterface/>
    </div>
  );
}
