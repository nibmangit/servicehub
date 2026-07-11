import Hero from "../features/home/components/Hero";
import CategoryGrid from "../features/home/components/CategoryGrid";
import ServiceGrid from "../features/home/components/ServiceGrid";
import WhyChooseUs from "../features/home/components/WhyChooseUs";
import CTASection from "../features/home/components/CTASection";
import Footer from "../features/home/components/Footer";

export default function HomePage() {
    return (
        <>
            <Hero />

            <CategoryGrid />

            <ServiceGrid />

            <WhyChooseUs />

            <CTASection />

            <Footer />
        </>
    );
}