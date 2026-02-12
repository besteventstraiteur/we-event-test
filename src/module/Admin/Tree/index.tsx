import React, { useRef, useEffect, useState } from "react";
import Tree from "react-d3-tree";

const containerStyles = {
  width: "100%",
  height: "90vh",
};

const treeData = {
  name: "Company",
  attributes: { role: "Root" },
  children: [
    {
      name: "Ambassador A",
      attributes: { department: "06" },
      children: [
        {
          name: "Partner 1",
          attributes: { region: "Nice" },
          children: [{ name: "Subpartner 1" }, { name: "Subpartner 2" }],
        },
        {
          name: "Partner 2",
          attributes: { region: "Cannes" },
          children: [{ name: "Subpartner 3" }],
        },
      ],
    },
    {
      name: "Ambassador B",
      attributes: { department: "13" },
      children: [
        {
          name: "Partner 3",
          attributes: { region: "Marseille" },
          children: [{ name: "Subpartner 4" }, { name: "Subpartner 5" }],
        },
      ],
    },
    {
      name: "Ambassador C",
      attributes: { department: "75" },
      children: [
        {
          name: "Partner 4",
          attributes: { region: "Paris" },
          children: [{ name: "Subpartner 6" }],
        },
      ],
    },
  ],
};

export default function NetworkTree() {
  const treeContainer = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Center the tree in container
  useEffect(() => {
    if (treeContainer.current) {
      const dimensions = treeContainer.current.getBoundingClientRect();
      setTranslate({ x: dimensions.width / 2, y: 100 });
    }
  }, []);

  return (
    <div
      ref={treeContainer}
      style={containerStyles}
      className="bg-gray-900 text-white p-6 rounded-lg"
    >
      <Tree
        data={treeData}
        translate={translate}
        orientation="vertical"
        pathFunc="step"
        zoom={0.8}
        nodeSize={{ x: 200, y: 150 }}
        separation={{ siblings: 1, nonSiblings: 1.5 }}
        renderCustomNodeElement={({ nodeDatum }) => (
          <g>
            <circle
              r={25}
              fill={
                nodeDatum.name.startsWith("Ambassador")
                  ? "#F97316" // orange
                  : nodeDatum.name.startsWith("Partner")
                  ? "#22C55E" // green
                  : nodeDatum.name.startsWith("Subpartner")
                  ? "#06B6D4" // cyan
                  : "#EAB308" // company
              }
              stroke="#fff"
              strokeWidth="2"
            />
            <text
              fill="white"
              strokeWidth="0"
              x="35"
              y="5"
              className="text-sm font-medium"
            >
              {nodeDatum.name}
            </text>
          </g>
        )}
      />
    </div>
  );
}
