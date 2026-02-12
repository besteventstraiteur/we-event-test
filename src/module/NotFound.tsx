import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Button from "../components/ui/Button";
import Nofound from "../../src/assets/images/result-no-found.svg";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <section className="max-w-3xl w-full text-center">
        <div className="mx-auto">
          <img src={Nofound} alt="no found" className="max-w-72 mx-auto" />
        </div>

        <div className="my-14">
          <h1 className="text-4xl leading-snug sm:text-5xl md:text-6xl md:leading-16 lg:text-8xl font-bold mb-4">
            404
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Oops! The page being looked for doesn’t exist or has moved. Let’s
            get back on track.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link to="/">
              <Button variant="primary" size="large">
                Return to Home
              </Button>
            </Link>

            <Link to={-1 as any}>
              <Button variant="outline" size="large">
                Go back
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
