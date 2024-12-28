import BlogSection from '../components/BlogSection';
import Hero from '../components/Hero';
import Reviews from '../components/Reviews';
import ProductSection from '../components/ProductSection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <ProductSection title="Kosmetyki z Serii Białej" bgColor="bg-white" />
      <ProductSection title="Kosmetyki z Serii Białej" bgColor="bg-white" />
      <BlogSection />
      <Reviews />
    </>
  );
};

export default HomePage;
