
"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";
import { motion } from "framer-motion";
import { getRequest } from "../../utils/http-client/axiosClient";
import { ADMIN } from "../../utils/endPoints";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Button from "../../components/ui/Button";
import { ArrowLeft } from "lucide-react";


function formatTreeData(node) {
  if (!node) return null;
  return {
    name: `${node.firstName || ""} ${node.lastName || ""}`.trim(),
    attributes: { level: node.level },
    profileImg: node.profileImg,
    children: node.referrals?.length
      ? node.referrals.map((r) => formatTreeData(r))
      : [],
  };
}

export default function ViewReferralD3() {
  const { id } = useParams();
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const treeContainer = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
   const navigate = useNavigate();
  
  const fetchTree = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRequest(`${ADMIN.VIEW_TREE}/${id}/network`);
      if (res?.data?.success && res.data.data) {
        const formatted = formatTreeData(res.data.data);
        setTreeData(formatted);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  useEffect(() => {
    if (treeContainer.current) {
      const { width, height } = treeContainer.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: 100 });
    }
  }, [treeData]);

  if (loading)
    return (
      <div className="p-6 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={50} />
        ))}
      </div>
    );

  if (!treeData)
    return <div className="text-white text-center">No data found</div>;
  const renderNode = ({ nodeDatum }) => {
    const initials =
      nodeDatum.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "?";

    return (
      <foreignObject width={120} height={120} x={-60} y={-60}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#34d399] bg-gradient-to-tr from-[#06b6d4] to-[#3b82f6] flex items-center justify-center shadow-lg overflow-hidden">
            {nodeDatum.profileImg ? (
              <img
                src={nodeDatum.profileImg}
                alt={nodeDatum.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white text-lg sm:text-xl font-bold">
                {initials}
              </span>
            )}
          </div>
          <div className="mt-2 text-center">
            <div className="text-white font-semibold text-xs sm:text-sm">
              {nodeDatum.name}
            </div>
            <div className="text-gray-400 text-[10px] sm:text-xs">
              Level {nodeDatum.attributes?.level}
            </div>
          </div>
        </motion.div>
      </foreignObject>
    );
  };

  return (
    <>
    <Button
          variant="outline"
          size="small"
          type="button"
          onClick={() => navigate(-1)}
          data-no-translate
          className="gap-2 mb-3"
        >
          <ArrowLeft size={18} /> Retour 
        </Button>

    <div
      ref={treeContainer}
      className="w-full h-[90vh] bg-[#0f172a] rounded-lg overflow-hidden text-white"
    >



      <div className="text-center pt-4">
        <h2 className="text-2xl font-extrabold tracking-wide text-[#34d399] mb-2">
          Arborescence du réseau » - {treeData?.name}
        </h2>
      </div>

      {treeData && (
        <Tree
          data={treeData}
          translate={translate}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          orientation="vertical"
          pathFunc="elbow" 
          zoomable
          collapsible={false}
          zoom={0.8}
          renderCustomNodeElement={renderNode}
          pathClassFunc={() => "stroke-[#334155] stroke-[2px]"}
        />
      )}
    </div>
    </>
  );
}
