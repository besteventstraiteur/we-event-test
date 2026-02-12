// src/components/provider-training/TrainingTabs.tsx
const TrainingTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-3">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          type="button"
          onClick={() => setActiveTab(tab.name)}
          className={`flex shrink-0 gap-2 items-center px-4 py-2 rounded-lg border text-gray-600 dark:text-neutral-600 border-gray-200 dark:border-neutral-700 text-sm transition cursor-pointer ${
            activeTab === tab.name ? "bg-gray-100" : "hover:bg-gray-100"
          }`}
        >
          {tab.icon}
          <span>{tab.name}</span>
        </button>
      ))}
    </div>
  );
};

export default TrainingTabs;
