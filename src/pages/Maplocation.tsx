import { useEffect, useRef } from "react";
import mapimage from "../assets/images/map-image.jpg";
import { motion } from "motion/react";

// area cordinates
const areas = [
  {
    name: "Region1",
    shape: "poly",
    coords: [421, 53, 460, 37, 540, 98, 531, 159, 488, 184, 428, 166, 424, 117],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region2",
    shape: "poly",
    coords: [
      251, 130, 351, 154, 394, 115, 413, 114, 420, 179, 387, 215, 371, 237, 317,
      225, 262, 207,
    ],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region3",
    shape: "poly",
    coords: [
      559, 592, 671, 615, 726, 561, 739, 538, 695, 514, 691, 483, 664, 468, 621,
      539, 582, 533,
    ],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region4",
    shape: "poly",
    coords: [
      276, 423, 290, 328, 349, 331, 382, 358, 412, 375, 444, 377, 458, 395, 460,
      459, 434, 484, 378, 518, 321, 564, 306, 634, 238, 601,
    ],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region5",
    shape: "poly",
    coords: [
      109, 207, 200, 192, 263, 216, 290, 227, 273, 270, 218, 291, 113, 247,
    ],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region6",
    shape: "poly",
    coords: [
      481, 244, 540, 265, 594, 287, 658, 264, 689, 285, 643, 372, 593, 371, 541,
      387, 502, 352, 482, 313,
    ],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region7",
    shape: "poly",
    coords: [
      556, 113, 730, 182, 716, 226, 704, 292, 642, 255, 577, 260, 511, 232, 514,
      184,
    ],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region8",
    shape: "poly",
    coords: [
      420, 212, 457, 240, 471, 279, 474, 328, 466, 355, 402, 362, 375, 334, 348,
      307, 364, 284, 395, 212,
    ],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region9",
    shape: "poly",
    coords: [
      579, 387, 660, 385, 699, 443, 687, 461, 638, 488, 593, 520, 550, 525, 512,
      488, 470, 493, 468, 444, 466, 405, 462, 364,
    ],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region10",
    shape: "poly",
    coords: [
      446, 507, 514, 497, 546, 533, 560, 545, 538, 580, 490, 648, 461, 675, 406,
      653, 355, 643, 314, 625, 325, 580, 383, 524, 443, 494,
    ],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region11",
    shape: "poly",
    coords: [
      310, 227, 368, 247, 345, 289, 337, 316, 288, 319, 280, 347, 259, 378, 233,
      339, 226, 305,
    ],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region12",
    shape: "poly",
    coords: [698, 635, 717, 676, 705, 736, 683, 723, 663, 680],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region13",
    shape: "poly",
    coords: [
      118, 701, 135, 701, 146, 716, 114, 726, 102, 750, 93, 719, 94, 707,
    ],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region14",
    shape: "poly",
    coords: [181, 688, 212, 714, 218, 745, 194, 738, 174, 706],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region15",
    shape: "poly",
    coords: [253, 690, 284, 712, 274, 745, 242, 746, 245, 711],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region16",
    shape: "poly",
    coords: [325, 696, 358, 714, 363, 743, 332, 744, 307, 718],
    href: "#",
    target: "_blank",
  },
  {
    name: "Region17",
    shape: "poly",
    coords: [396, 694, 420, 709, 410, 738, 397, 741, 391, 706],
    href: "#",
    target: "_blank",
  },

   {
    name: "Region18",
    shape: "poly",
    coords: [422,175,504,195,502,231,447,235,417,206],
    href: "#",
    target: "_blank",
  },
];

export default function ImageMapExample() {
  const imgRef = useRef<HTMLImageElement>(null);
  const mapRef = useRef<HTMLMapElement>(null);

  useEffect(() => {
    const resizeMap = () => {
      const img = imgRef.current;
      const map = mapRef.current;
      if (!img || !map) return;

      const natW = img.naturalWidth || img.width;
      const curW = img.clientWidth;
      const scale = curW / natW;

      Array.from(map.getElementsByTagName("area")).forEach((area) => {
        const original = area.dataset.original;
        if (!original) return;
        const coords = original.split(",").map(Number);
        const scaled = coords.map((c) => Math.round(c * scale));
        area.coords = scaled.join(",");
      });
    };

    window.addEventListener("resize", resizeMap);
    if (imgRef.current) {
      if (imgRef.current.complete) {
        resizeMap();
      } else {
        imgRef.current.addEventListener("load", resizeMap);
      }
    }

    return () => {
      window.removeEventListener("resize", resizeMap);
      if (imgRef.current) {
        imgRef.current.removeEventListener("load", resizeMap);
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 text-center"
      >
        French Regions.
      </motion.h2>
      <img
        ref={imgRef}
        src={mapimage}
        alt="Map"
        useMap="#mymap"
        style={{ maxWidth: "100%", height: "auto", display: "block" }}
      />
      <map name="mymap" ref={mapRef}>
        {areas.map((area, i) => (
          <area
            key={i}
            shape={area.shape}
            data-original={area.coords.join(",")}
            coords={area.coords.join(",")}
            href={area.href}
            alt={area.name}
          />
        ))}
      </map>
    </div>
  );
}
