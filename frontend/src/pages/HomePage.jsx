import HeroSection from "../features/home/components/HeroSection";
import CategorySection from "../features/home/components/CategorySection";
import FeaturedServices from "../features/home/components/FeaturedServices";
import HowItWorks from "../features/home/components/HowItWorks";
import BecomeProvider from "../features/home/components/BecomeProvider";

export default function HomePage() {
    return (
        <>
            <HeroSection />

            <CategorySection />

            <FeaturedServices />

            <HowItWorks />

            <BecomeProvider />
        </>
    );
}