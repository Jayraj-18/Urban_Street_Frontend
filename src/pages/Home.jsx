import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Products from "../components/Products";
import SaleBanner from "../components/SaleBanner";
import Footer from "../components/Footer";


function Home({darkMode, setDarkMode}) {
  return (
    <div className="dark:bg-[#0A0A0A]">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
      <Hero />
      <Categories />
      <Products />
      
      <SaleBanner />
      <Footer />
    </div>
  );
}

export default Home;
