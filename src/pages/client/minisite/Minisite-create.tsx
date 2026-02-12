import { useState } from "react";
import { Delete, Eye, Plus, Save, Star, Trash, Trash2 } from "lucide-react";
import InputGroup from "../../../components/ui-main/InputGroup";
import Button from "../../../components/ui/Button";
import CustomSelect from "../../../components/ui-main/selectBox";

const Rating = [
  {
    value: "1",
    label: (
      <div className="flex gap-1">
        <Star size={20} fill="#f59e0b" stroke="current" />
        <Star size={20} fill="#f59e0b" stroke="current" />
        <Star size={20} fill="#f59e0b" stroke="current" />
        <Star size={20} fill="#f59e0b" stroke="current" />
        <Star size={20} fill="#f59e0b" stroke="current" />
      </div>
    ),
  },
  {
    value: "2",
    label: (
      <div className="flex gap-1">
        <Star size={20} fill="#f59e0b" stroke="current" />
        <Star size={20} fill="#f59e0b" stroke="current" />
        <Star size={20} fill="#f59e0b" stroke="current" />
        <Star size={20} fill="#f59e0b" stroke="current" />
      </div>
    ),
  },
  {
    value: "3",
    label: (
      <div className="flex gap-1">
        <Star size={20} fill="#f59e0b" stroke="current" />
        <Star size={20} fill="#f59e0b" stroke="current" />
        <Star size={20} fill="#f59e0b" stroke="current" />
      </div>
    ),
  },
  {
    value: "4",
    label: (
      <div className="flex gap-1">
        <Star size={20} fill="#f59e0b" stroke="current" />
        <Star size={20} fill="#f59e0b" stroke="current" />
      </div>
    ),
  },
  {
    value: "5",
    label: (
      <div className="flex gap-1">
        <Star size={20} fill="#f59e0b" stroke="current" />
      </div>
    ),
  },
];

const MiniSiteCreate = () => {
  // tabs
  const [activeTab, setActiveTab] = useState("Content");

 // Separate states for each color
  const [colors, setColors] = useState({
    main: "#f59e0b", // orange
    secondary: "#3b82f6", // blue
    accent: "#10b981", // green
  });

  // Single handler for all inputs
  const handleChange = (e, key) => {
    const newColor = e.target.value;
    setColors((prev) => ({
      ...prev,
      [key]: newColor,
    }));
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold dark:text-neutral-300">
            Ma Landing Page 
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your personalized marketing page
          </p>
        </div>

        {/* TABS */}
        <div className="mt-10">
          {/* Tabs Header */}
          <div className="flex p-2 bg-gray-100 rounded-lg">
            {["Content", "Services", "Testimonials", "Design"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-center cursor-pointer capitalize font-medium rounded-lg ${
                  activeTab === tab
                    ? "bg-white text-primary"
                    : "text-gray-500 hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <div className="mt-5">
            {activeTab === "Content" && (
              <div className="space-y-6">
                <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                  <span className="text-2xl font-semibold mb-4 block dark:text-neutral-300">
                    General Information
                  </span>

                  <div className="space-y-4">
                    <div>
                      <InputGroup
                        type="text"
                        label="Page URL"
                        placeholder="Page URL(slug)"
                      />
                    </div>

                    <div>
                      <InputGroup
                        type="text"
                        label="Main Title"
                        placeholder="Enter main title"
                      />
                    </div>

                    <div>
                      <InputGroup
                        type="text"
                        label="Catchy Subtitle"
                        placeholder="Enter catchy subtitle"
                      />
                    </div>

                    <div>
                      <InputGroup
                        type="text"
                        label="Hero Image URL"
                        placeholder="Enter URL"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                  <span className="text-2xl font-semibold mb-4 block dark:text-neutral-300">
                    About Section
                  </span>

                  <div className="space-y-4">
                    <div>
                      <InputGroup
                        type="textarea"
                        label="Description"
                        placeholder="Describe your business, your passion, your approach..."
                        rows={5}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                  <span className="text-2xl font-semibold mb-4 block dark:text-neutral-300">
                    Contact Information
                  </span>

                  <div className="space-y-4">
                    <div className="flex justify-between gap-3">
                      <div className="flex-1">
                        <InputGroup
                          type="tel"
                          label="Phone"
                          placeholder="Enter Phone number"
                        />
                      </div>

                      <div className="flex-1">
                        <InputGroup
                          type="email"
                          label="Email"
                          placeholder="Enter email"
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <InputGroup
                        type="text"
                        label="Address"
                        placeholder="Enter address"
                      />
                    </div>

                    <div className="w-full">
                      <InputGroup
                        type="text"
                        label="Instagram"
                        placeholder="Instagram (@username)"
                      />
                    </div>

                    <div className="w-full">
                      <InputGroup
                        type="text"
                        label="Facebook"
                        placeholder="Facebook Profile Link"
                      />
                    </div>

                    <div className="w-full">
                      <InputGroup
                        type="text"
                        label="Website"
                        placeholder="Enter website URL"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Services" && (
              <div className="space-y-6">
                <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                  <span className="text-2xl font-semibold mb-4 block dark:text-neutral-300">
                    Your services
                  </span>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-5 rounded-lg space-y-4">
                      <div className="flex gap-3 justify-between">
                        <span className="text-md font-semibold  dark:text-neutral-300">
                          Service 1 
                        </span>

                        <button className="p-2 bg-gray-100 dark:bg-transparent border border-transparent dark:border-white rounded-md hover:bg-gray-200 hover:dark:bg-darkmode cursor-pointer group relative">
                          <Trash2 size={18} className="text-red-500" />
                          <span
                            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                             opacity-0 group-hover:opacity-100
                             bg-gray-800 text-white text-xs px-2 py-1 rounded
                             transition-opacity duration-300 whitespace-nowrap"
                          >
                            Delete
                          </span>
                        </button>
                      </div>
                      <div className="flex justify-between gap-3">
                        <div className="flex-1">
                          <InputGroup
                            type="text"
                            label="Name"
                            placeholder="Name of the service"
                            className="bg-white"
                          />
                        </div>

                        <div className="flex-1">
                          <InputGroup
                            type="number"
                            label="Price(€)"
                            placeholder="Price (e.g:from €500)"
                            className="bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <InputGroup
                          type="textarea"
                          label="Description"
                          placeholder="Service description"
                          className="bg-white"
                        />
                      </div>

                      <div>
                        <InputGroup
                          type="text"
                          label="Image URL"
                          placeholder="Enter URL"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="relative overflow-hidden">
                      <Button
                        variant="outline"
                        size="medium"
                        className="w-full"
                      >
                        <Plus size={16} /> Add more service
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Testimonials" && (
              <div className="space-y-6">
                <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                  <span className="text-2xl font-semibold mb-4 block dark:text-neutral-300">
                    Testimonials
                  </span>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-5 rounded-lg space-y-4">
                      <div className="flex gap-3 justify-between">
                        <span className="text-md font-semibold  dark:text-neutral-300">
                          Testimonials 1
                        </span>

                        <button className="p-2 bg-gray-100 dark:bg-transparent border border-transparent dark:border-white rounded-md hover:bg-gray-200 hover:dark:bg-darkmode cursor-pointer group relative">
                          <Trash2 size={18} className="text-red-500" />
                          <span
                            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                             opacity-0 group-hover:opacity-100
                             bg-gray-800 text-white text-xs px-2 py-1 rounded
                             transition-opacity duration-300 whitespace-nowrap"
                          >
                            Delete
                          </span>
                        </button>
                      </div>
                      <div className="flex justify-between gap-3">
                        <div className="flex-1">
                          <InputGroup
                            type="text"
                            label="Customer Name"
                            placeholder="Enter customer name"
                            className="bg-white"
                          />
                        </div>

                        <div className="flex-1">
                          <CustomSelect
                            label="Rating"
                            options={Rating}
                            value={Rating.value}
                            onChange={Rating.onChange}
                            placeholder="Select Status"
                          />
                        </div>
                      </div>

                      <div>
                        <InputGroup
                          type="textarea"
                          label="Review"
                          placeholder="Enter review"
                          className="bg-white"
                        />
                      </div>

                      <div>
                        <InputGroup
                          type="text"
                          label="Customer Photo"
                          placeholder="Enter URL"
                          className="bg-white"
                        />
                      </div>
                    </div>

                    <div className="relative overflow-hidden">
                      <Button
                        variant="outline"
                        size="medium"
                        className="w-full"
                      >
                        <Plus size={16} /> Add more testimonials
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Design" && (
              <div className="space-y-6">
                <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                  <span className="text-2xl font-semibold mb-4 block dark:text-neutral-300">
                    Design customization
                  </span>

                
                    {/* Color Picker Input */}

                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                          Main Color
                        </label>
                        <div className="relative">
                          <input
                            label="Main Color"
                            type="color"
                            value={colors.main}
                            onChange={(e) => handleChange(e, "main")}
                            className=" absolute w-10 left-1 h-[49px] rounded-lg cursor-pointer !border-0 outline-0 appearance-none"
                          />

                          <input
                            type="text"
                            value={colors.main}
                            onChange={(e) => handleChange(e, "secondary")}
                            className="w-full ps-13 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                          Secondary Color
                        </label>
                        <div className="relative">
                          <input
                            label="Secondary Color"
                            type="color"
                            value={colors.secondary}
                            onChange={(e) => handleChange(e, "accent")}
                            className=" absolute w-10 left-1 h-[49px] rounded-lg cursor-pointer !border-0 outline-0 appearance-none"
                          />

                          <input
                            type="text"
                              value={colors.secondary}
                            onChange={handleChange}
                            className="w-full ps-13 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                          Accent color
                        </label>
                        <div className="relative">
                          <input
                            label="Accent color"
                            type="color"
                            value={colors.accent}
                           onChange={(e) => handleChange(e, "accent")}
                            className=" absolute w-10 left-1 h-[49px] rounded-lg cursor-pointer !border-0 outline-0 appearance-none"
                          />

                          <input
                            type="text"
                            value={colors.accent}
                             onChange={(e) => handleChange(e, "accent")}
                            className="w-full ps-13 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                          <CustomSelect
                            label="Font"
                            options={Rating}
                            value={Rating.value}
                            onChange={Rating.onChange}
                            placeholder="Select Status"
                          />
                        </div>
                  
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniSiteCreate;
