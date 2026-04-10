import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import Services from "@/components/landing/Services";
import HowItWorks from "@/components/landing/HowItWorks";
import IntakeForm from "@/components/landing/IntakeForm";
import ContactForm from "@/components/landing/ContactForm";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <Problem />
      <Services />
      <HowItWorks />
      <IntakeForm />
      <ContactForm />
      <Footer />
    </main>
  );
}
