import React from "react";
import { Link } from "react-router-dom";
import WeEventLogo from "../WeEventLogo";
import Button from "../ui/Button";
// import { useAuth } from "@/hooks/useAuth";

const HomeHeader: React.FC = () => {
  // const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <WeEventLogo size="small" asButton={false} withText={true} />
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className="font-inter text-base text-gray-600 hover:text-we-gold transition-colors"
            >
              Home
            </Link>

            <Link
              to="/partners"
              className="font-inter text-base text-gray-600 hover:text-we-gold transition-colors"
            >
              Partner
            </Link>
            <Link
              to="/contact"
              className="font-inter text-base text-gray-600 hover:text-we-gold transition-colors"
            >
              Contact
            </Link>
            {/* {isAuthenticated ? (
              <Link to="/client/dashboard">
                <Button className="btn-custom-fill hover:bg-we-gold/90 text-black">
                  Connexion
                </Button>
              </Link>
            ) : ( */}
              <div className="flex gap-3">
                <Link to="/login">
                  <Button className="btn-custom-fill py-1 text-base">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-custom-outline py-1 text-base">
                    Signup
                  </Button>
                </Link>
              </div>
            {/* )} */}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
