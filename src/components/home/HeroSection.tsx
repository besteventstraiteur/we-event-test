
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-gray-800 to-black text-white py-32 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Planifiez le mariage de <span className="text-yellow-400">vos rêves</span>
          </h1>
          <p className="text-lg mb-8 text-gray-300">
            WeEvent vous propose une expérience tout-en-un pour organiser un événement inoubliable. 
            Simplifiez votre planning et trouvez les meilleurs prestataires.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <Link 
              to="/register-client"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-all"
            >
              Commencer gratuitement
            </Link>
            <Link
              to="/partners"
              className="bg-transparent hover:bg-white/10 border border-white text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Découvrir nos prestataires
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 mt-10 lg:mt-0">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-2xl">
            <img 
              src="/lovable-uploads/b9084086-687c-4556-8914-cc674205a61c.png" 
              alt="Planning de mariage" 
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

