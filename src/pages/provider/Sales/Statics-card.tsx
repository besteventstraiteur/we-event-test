import { Link } from "react-router-dom";

const Staticscard = ({
  heading,
  value,
  subheading,
  icon,
  bgcolor,
  iconcolor,
  link, // optional redirect
  onClick, // optional action
}) => {
  const Wrapper = ({ children }) => {
    if (link) {
      return <Link to={link}>{children}</Link>;
    }

    if (onClick) {
      return (
        <div onClick={onClick} className="cursor-pointer">
          {children}
        </div>
      );
    }

    return <>{children}</>;
  };

  return (
    <Wrapper>
      <div
        className={`h-full relative bg-white dark:bg-darkmode rounded-lg border border-gray-200 dark:border-black p-4 transition-all
        ${link || onClick ? "hover:shadow-lg cursor-pointer" : ""}
        `}
      >
        <div className="flex flex-col gap-1 pr-5">
          <div className="text-gray-500 dark:text-neutral-400 text-sm">
            {heading}
          </div>
          <span className="text-3xl font-bold dark:text-neutral-100">
            {value}
          </span>
          <p className="text-sm text-gray-600 dark:text-neutral-300">
            {subheading}
          </p>
        </div>

        <span
          className={`absolute right-5 top-5 w-8 h-8 rounded-full flex items-center justify-center ${bgcolor} ${iconcolor}`}
        >
          {icon}
        </span>
      </div>
    </Wrapper>
  );
};

export default Staticscard;
