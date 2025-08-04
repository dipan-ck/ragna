import ChatInterface from "@/components/sections/ChatInterface";
import Features from "@/components/sections/Features";
import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/Hero";
import KnowledgeBase from "@/components/sections/KnowledgeBase";


export default function Home() {
  return (
    <div>
    <Hero/>
    <Features/>
    <KnowledgeBase/>
    <ChatInterface/>
    <Footer/>
    </div>
  );
}
