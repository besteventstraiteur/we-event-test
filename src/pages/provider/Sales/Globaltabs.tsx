import { useState, useEffect } from "react";

function Globaltabs({ tabs = [], defaultTab = null }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Set first tab as default if no defaultTab is provided
  useEffect(() => {
    if (!defaultTab && tabs.length > 0) {
      setActiveTab(tabs[0].label);
    }
  }, [tabs, defaultTab]);

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex p-1 bg-gray-100 dark:bg-neutral-800 rounded-lg overflow-x-auto">
        {tabs.map(({ label }) => (
          <button
            key={label}
            type="button"
            onClick={() => setActiveTab(label)}
            className={`flex-1 whitespace-nowrap p-2 text-center rounded-lg cursor-pointer font-medium capitalize ${
              activeTab === label
                ? "bg-white dark:bg-darkmode text-secondary dark:text-neutral-300"
                : "text-gray-500 hover:text-secondary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map(
          ({ label, content }) =>
            activeTab === label && (
              <div key={label} className="animate-fadeIn">
                {content}
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default Globaltabs;
