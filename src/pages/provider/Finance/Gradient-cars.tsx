import { File, FileStack } from "lucide-react";
const Gradeintcard = ({
  heading,
  value,
  subheading,
  icon,
  bgcolor,
  iconcolor,
}) => {
  return (
    <>
      <div
        className={`relative ${bgcolor} rounded-3xl text-white p-6 transition-all

      `}
      >
        <div className="flex flex-col gap-1 pr-5">
          <div className="text-sm">{heading}</div>
          <span className="text-3xl font-bold">{value}</span>
          <p className="text-sm">{subheading}</p>
        </div>
        <span
          className={`absolute right-5 top-5 w-8 h-8 rounded-full flex items-center justify-center ${iconcolor}`}
        >
          {icon}
        </span>
      </div>
    </>
  );
};

export default Gradeintcard;
