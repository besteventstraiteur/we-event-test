import React, { useEffect, useState, useRef, useMemo } from "react";
import Draggable from "react-draggable";
import Button from "../../components/ui/Button";
import { Minus, Plus, Users, X } from "lucide-react";
import OuterModal from "../../components/Custommodal/OuterModal";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "../../utils/toast";
import { getRequest, patchRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { useParams } from "react-router-dom";

type Guest = { id: string; name: string; email?: string };
type TableShape = "round" | "square" | "rectangular";
type TableSize = "small" | "medium" | "large";

type Seat = { index: number; x: number; y: number; guest?: Guest | null };

type Table = {
  id: string;
  name: string;
  shape: TableShape;
  size: TableSize;
  color: string;
  rotation: number;
  xPercent: number;
  yPercent: number;
  capacity: number;
  seats: Seat[];
  widthCm?: number;
  heightCm?: number;
  diameterCm?: number;
};

const SIZE_CAPACITY: Record<TableSize, number> = {
  small: 4,
  medium: 6,
  large: 8,
};

const BASE_TABLE_DIMENSIONS: Record<TableSize, { w: number; h: number }> = {
  small: { w: 160, h: 160 },
  medium: { w: 200, h: 200 },
  large: { w: 260, h: 260 },
};

function getTableDimensions(shape: TableShape, size: TableSize) {
  const base = BASE_TABLE_DIMENSIONS[size];
  if (shape === "rectangular") {
    return { w: base.w + 60, h: Math.max(120, base.h - 40) };
  }
  return base;
}
const CM_TO_PX = 2; // 1 cm = 2px (you can fine-tune)
const CHAIR_DIAMETER_CM = 60;
const CHAIR_DIAMETER_PX = CHAIR_DIAMETER_CM * CM_TO_PX;

// --- SEAT GENERATOR -------------------------------------------------
function generateSeats(
  shape: TableShape,
  size: TableSize,
  capacity: number,
  diameterCm = 150,
  widthCm = 180,
  heightCm = 80,
): Seat[] {
  const seats: Seat[] = [];
  const chairRadius = CHAIR_DIAMETER_PX / 2 + 10;

  // ROUND TABLE
  if (shape === "round") {
    const tableRadius = (diameterCm * CM_TO_PX) / 2;
    const dist = tableRadius + chairRadius + 5;

    for (let i = 0; i < capacity; i++) {
      const angle = (i / capacity) * Math.PI * 2;
      seats.push({
        index: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        guest: null,
      });
    }
    return seats;
  }

  // RECTANGLE / SQUARE
  const w = widthCm * CM_TO_PX;
  const h = heightCm * CM_TO_PX;

  const perimeter = 2 * (w + h);
  const step = perimeter / capacity;

  for (let i = 0; i < capacity; i++) {
    let d = i * step;
    let x = 0;
    let y = 0;

    if (d < w) {
      x = -w / 2 + d;
      y = -h / 2 - chairRadius;
    } else if (d < w + h) {
      x = w / 2 + chairRadius;
      y = -h / 2 + (d - w);
    } else if (d < 2 * w + h) {
      x = w / 2 - (d - (w + h));
      y = h / 2 + chairRadius;
    } else {
      x = -w / 2 - chairRadius;
      y = h / 2 - (d - (2 * w + h));
    }

    seats.push({ index: i, x, y, guest: null });
  }

  return seats;
}
const SeatingPlan = ({ guests }: { guests: Guest[] }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [unassigned, setUnassigned] = useState<Guest[]>([]);
  const [editTable, setEditTable] = useState<Table | null>(null);
  const [roomWidthM, setRoomWidthM] = useState(10); // meters
  const [roomHeightM, setRoomHeightM] = useState(15); // meters
  const [zoom, setZoom] = useState(1);
  const [btnLoading, setBtnLoading] = useState(false);

  function regenerateSeatsPreserveGuests(oldSeats: Seat[], newSeats: Seat[]) {
    return newSeats.map((seat, i) => ({
      ...seat,
      guest: oldSeats[i]?.guest || null,
    }));
  }
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const BASE_VIEWPORT_METERS = 20; // how much room should be visible nicely

  const METER_TO_PX = 50;

  const roomWidthPx = roomWidthM * METER_TO_PX;
  const roomHeightPx = roomHeightM * METER_TO_PX;

  const tableRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});

  const allGuests = useMemo(() => {
    const map = new Map<string, Guest>();
    (guests ?? []).forEach((g) => {
      if (g?.id && !map.has(g.id)) {
        map.set(g.id, g);
      }
    });
    return Array.from(map.values());
  }, [guests]);
  const { id } = useParams();
  const eventId = id;

  useEffect(() => {
    const used = new Set<string>();

    tables.forEach((t) =>
      t.seats.forEach((s) => {
        if (s.guest) used.add(s.guest.id);
      }),
    );

    setUnassigned(allGuests.filter((g) => !used.has(g.id)));
  }, [tables, allGuests]);

  const deleteTable = (tableId: string) => {
    setTables((prev) => prev.filter((t) => t.id !== tableId));
    setEditTable(null);
  };

  const addTable = (shape: TableShape = "round", size: TableSize = "small") => {
    let widthCm = 180;
    let heightCm = 80;
    let diameterCm = 150;

    if (shape === "round") {
      if (size === "small") diameterCm = 80;
      if (size === "medium") diameterCm = 150;
      if (size === "large") diameterCm = 180;
    }

    if (shape === "rectangular") {
      widthCm = 180;
      heightCm = 80;
    }

    const capacity = SIZE_CAPACITY[size];

    const seats = generateSeats(
      shape,
      size,
      capacity,
      diameterCm,
      widthCm,
      heightCm,
    );

    setTables((p) => [
      ...p,
      {
        id: "t-" + Date.now(),
        name: `Table ${p.length + 1}`,
        shape,
        size,
        color: "#eeeeee",
        rotation: 0,
        xPercent: 0.05,
        yPercent: 0.05,
        capacity,
        widthCm,
        heightCm,
        diameterCm,
        seats,
      },
    ]);
  };

  // ================= ASSIGN GUEST (DRAG & DROP) =================
  const onGuestDragStart = (e: React.DragEvent, g: Guest) => {
    e.dataTransfer.setData("guestId", g.id);
  };

  const applySeatAssignment = (
    tableId: string,
    seatIndex: number,
    guest: Guest | null,
  ) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;

        // Remove this guest from any other seat on this table
        let seats = t.seats.map((s) =>
          guest && s.guest?.id === guest.id ? { ...s, guest: null } : s,
        );

        // Assign guest to target seat
        seats = seats.map((s) => (s.index === seatIndex ? { ...s, guest } : s));

        return { ...t, seats };
      }),
    );
  };

  const handleSeatDrop = (
    e: React.DragEvent<HTMLDivElement>,
    tableId: string,
    seatIndex: number,
  ) => {
    e.preventDefault();
    const guestId = e.dataTransfer.getData("guestId");
    if (!guestId) return;

    const guest = allGuests.find((g) => g.id === guestId);
    if (!guest) return;

    applySeatAssignment(tableId, seatIndex, guest);
  };

  // ================== AUTO GENERATE ==================
  const autoGenerate = () => {
    const emptySeats = tables.flatMap((t) =>
      t.seats
        .filter((s) => !s.guest)
        .map((s) => ({ tableId: t.id, seatIndex: s.index })),
    );

    const queue = [...unassigned];
    const ops: { tableId: string; seatIndex: number; guest: Guest }[] = [];

    for (let i = 0; i < emptySeats.length && queue.length > 0; i++) {
      ops.push({ ...emptySeats[i], guest: queue.shift()! });
    }

    setTables((prev) =>
      prev.map((t) => {
        const f = ops.filter((o) => o.tableId === t.id);
        const seats = t.seats.map((s) => {
          const m = f.find((o) => o.seatIndex === s.index);
          return m ? { ...s, guest: m.guest } : s;
        });
        return { ...t, seats };
      }),
    );
  };

  // ================== DRAG TABLE ==================
  const onTableStop = (e: any, data: any, id: string) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, x: data.x, y: data.y } : t)),
    );
  };

  // ================== RENDER TABLE ==================
  const renderTable = (t: Table) => {
    // const { w, h } = getTableDimensions(t.shape, t.size);
    const tableWidthPx =
      t.shape === "round" ? t.diameterCm! * CM_TO_PX : t.widthCm! * CM_TO_PX;

    const tableHeightPx =
      t.shape === "round" ? t.diameterCm! * CM_TO_PX : t.heightCm! * CM_TO_PX;

    return (
      <div
        style={{
          width: tableWidthPx,
          height: tableHeightPx,
          background: t.color,
          borderRadius: t.shape === "round" ? "50%" : 12,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 3px #ccc",
        }}
      >
        {/* Edit Button */}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setEditTable(t);
          }}
          className="absolute -top-2 -right-2 bg-white border px-2 py-0.5 rounded-full text-xs shadow-sm no-pdf"
        >
          Modifier
        </button>

        {/* Center text */}

        <div style={{ textAlign: "center", pointerEvents: "none" }}>
          <div className="font-semibold text-sm">{t.name}</div>
          <div className="text-xs text-gray-600">
            {t.seats.filter((s) => s.guest).length}/{t.capacity}
          </div>
        </div>

        {/* Seats */}

        {t.seats.map((s) => (
          <div
            key={s.index}
            onDrop={(e) => handleSeatDrop(e, t.id, s.index)}
            onDragOver={(e) => e.preventDefault()}
            style={{
              position: "absolute",
              left: `calc(50% + ${s.x}px)`,
              top: `calc(50% + ${s.y}px)`,
              transform: "translate(-50%,-50%)",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: s.guest ? "#3b82f6" : "#e5e7eb",
              border: "2px solid #d1d5db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {s.guest && (
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>
                {s.guest.name[0]}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("pdfRoot");
    if (!element) return alert("PDF root not found");

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,

      onclone: (doc) => {
        doc.querySelectorAll(".no-pdf").forEach((el) => {
          (el as HTMLElement).style.display = "none";
        });

        // Remove scrolling limits
        doc.querySelectorAll(".no-pdf-scroll").forEach((el) => {
          (el as HTMLElement).style.overflow = "visible";
          (el as HTMLElement).style.height = "auto";
        });

        // Reset zoom
        const room = doc.querySelector("#pdfRoot > div > div");
        if (room) {
          (room as HTMLElement).style.transform = "scale(1)";
        }

        // ⭐ FIX OKLCH COLORS
        const all = doc.querySelectorAll("*");

        all.forEach((el) => {
          const style = window.getComputedStyle(el);

          ["color", "backgroundColor", "borderColor"].forEach((prop) => {
            const value = style[prop as any];
            if (value?.includes("oklch")) {
              (el as HTMLElement).style[prop as any] = "#000000"; // safe fallback
            }
          });
        });
      },
    });

    const img = canvas.toDataURL("image/png", 1.0);

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(img);
    const imgRatio = imgProps.width / imgProps.height;

    let renderWidth = pdfWidth - 20;
    let renderHeight = renderWidth / imgRatio;

    if (renderHeight > pdfHeight - 40) {
      renderHeight = pdfHeight - 40;
      renderWidth = renderHeight * imgRatio;
    }

    const x = (pdfWidth - renderWidth) / 2;
    const y = 20;
    pdf.setFontSize(18);
    pdf.text("Plan de table", pdfWidth / 2, 15, { align: "center" });
    pdf.addImage(img, "PNG", x, y, renderWidth, renderHeight);

    pdf.setFontSize(10);
    pdf.text("Généré par we-event.eu", pdfWidth / 2, pdfHeight - 10, {
      align: "center",
    });
    pdf.save("seating-plan.pdf");
  };

  // ================== EDIT MODAL ==================
  const EditModal = () => {
    if (!editTable) return null;
    const table = editTable;

    const updateLocal = (updater: (prev: Table) => Table) =>
      setEditTable((prev) => (prev ? updater(prev) : prev));

    const regenerate = (
      prev: Table,
      capacity = prev.capacity,
      diameter = prev.diameterCm,
      width = prev.widthCm,
      height = prev.heightCm,
      shape = prev.shape,
      size = prev.size,
    ) => {
      const newSeats = generateSeats(
        shape,
        size,
        capacity,
        diameter,
        width,
        height,
      );
      return regenerateSeatsPreserveGuests(prev.seats, newSeats);
    };

    const handleCapacityChange = (value: number) => {
      updateLocal((prev) => {
        const cap = Math.max(value, prev.seats.filter((s) => s.guest).length);

        return {
          ...prev,
          capacity: cap,
          seats: regenerate(prev, cap),
        };
      });
    };

    const handleShapeChange = (shape: TableShape) => {
      updateLocal((prev) => {
        let diameter = prev.diameterCm || 80;
        let width = prev.widthCm || 180;
        let height = prev.heightCm || 80;

        if (shape === "round") diameter = prev.size === "large" ? 180 : 150;
        if (shape === "rectangular") {
          width = 180;
          height = 80;
        }

        return {
          ...prev,
          shape,
          diameterCm: diameter,
          widthCm: width,
          heightCm: height,
          seats: regenerate(
            prev,
            prev.capacity,
            diameter,
            width,
            height,
            shape,
          ),
        };
      });
    };

    const handleSizeChange = (size: TableSize) => {
      updateLocal((prev) => {
        let diameter = prev.diameterCm || 150;

        if (prev.shape === "round") {
          if (size === "small") diameter = 80;
          if (size === "medium") diameter = 150;
          if (size === "large") diameter = 180;
        }

        return {
          ...prev,
          size,
          diameterCm: diameter,
          seats: regenerate(prev, prev.capacity, diameter),
        };
      });
    };

    const updateDimension = (key: "widthCm" | "heightCm", value: number) => {
      updateLocal((prev) => {
        const next = { ...prev, [key]: value } as Table;
        return {
          ...next,
          seats: regenerate(next),
        };
      });
    };

    const handleSeatGuestChange = (seatIndex: number, guestId: string) => {
      updateLocal((prev) => {
        const newGuest =
          guestId === ""
            ? null
            : allGuests.find((g) => g.id === guestId) || null;

        const seats = prev.seats.map((s) =>
          s.index === seatIndex
            ? { ...s, guest: newGuest }
            : s.guest?.id === newGuest?.id
              ? { ...s, guest: null }
              : s,
        );

        return { ...prev, seats };
      });
    };

    return (
      <OuterModal active setActive={() => setEditTable(null)}>
        <div className="max-w-2xl mx-auto border-2 border-transparent dark:border-[#2F2F2F] bg-white dark:bg-[#1E1E1E] rounded-xl p-6 relative mt-10">
          <button
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => setEditTable(null)}
          >
            <X />
          </button>

          <h2 className="text-xl font-semibold mb-4 dark:text-neutral-100">
            Modifier la table
          </h2>

          <div className="space-y-4">
            {/* NAME */}
            <div>
              <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Nom de la table
              </label>

              <input
                className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder dark:border-neutral-700 bg-inputbg dark:bg-neutral-800 rounded-lg focus:border-secondary  dark:text-neutral-300"
                value={table.name}
                onChange={(e) =>
                  updateLocal((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            {/* COLOR PICKER */}

            <div>
              <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Couleur de la table
              </label>
              <input
                type="color"
                value={table.color}
                className="w-full h-10 border border-borderlight p-0"
                onChange={(e) =>
                  updateLocal((prev) => ({ ...prev, color: e.target.value }))
                }
              />
            </div>

            {/* SEATS */}
            <div>
              <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Sièges
              </label>
              <input
                type="number"
                className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder dark:border-neutral-700 bg-inputbg dark:bg-neutral-800 rounded-lg focus:border-secondary  dark:text-neutral-300"
                value={table.capacity}
                onChange={(e) => handleCapacityChange(+e.target.value)}
              />
            </div>

            {/* SHAPE */}

            <div>
              <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Forme
              </label>
              <select
                className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder dark:border-neutral-700 bg-inputbg dark:bg-neutral-800 rounded-lg focus:border-secondary  dark:text-neutral-300"
                value={table.shape}
                onChange={(e) =>
                  handleShapeChange(e.target.value as TableShape)
                }
              >
                <option value="round">Ronde</option>
                <option value="square">Carrée</option>
                <option value="rectangular">Rectangulaire</option>
              </select>
            </div>

            {table.shape === "round" && (
              <div>
                <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                  Diamètre (cm)
                </label>
                <input
                  type="number"
                  min={60}
                  className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder dark:border-neutral-700 bg-inputbg dark:bg-neutral-800 rounded-lg focus:border-secondary  dark:text-neutral-300"
                  value={table.diameterCm ?? 150}
                  onChange={(e) =>
                    updateLocal((prev) => {
                      const diameter = Number(e.target.value);

                      return {
                        ...prev,
                        diameterCm: diameter,
                        seats: regenerate(prev, prev.capacity, diameter),
                      };
                    })
                  }
                />
              </div>
            )}

            <div>
              {table.shape !== "round" && (
                <input
                  type="number"
                  className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder dark:border-neutral-700 bg-inputbg dark:bg-neutral-800 rounded-lg focus:border-secondary  dark:text-neutral-300"
                  value={table.widthCm ?? 180}
                  onChange={(e) => updateDimension("widthCm", +e.target.value)}
                />
              )}
            </div>

            {/* HEIGHT */}

            <div>
              {table.shape !== "round" && (
                <>
                  <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                    Height
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder dark:border-neutral-700 bg-inputbg dark:bg-neutral-800 rounded-lg focus:border-secondary  dark:text-neutral-300"
                    value={table.heightCm ?? 80}
                    onChange={(e) =>
                      updateDimension("heightCm", +e.target.value)
                    }
                  />
                </>
              )}
            </div>

            <div>
              {/* SIZE */}
              <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Size
              </label>
              <select
                className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder dark:border-neutral-700 bg-inputbg dark:bg-neutral-800 rounded-lg focus:border-secondary  dark:text-neutral-300"
                value={table.size}
                onChange={(e) => handleSizeChange(e.target.value as TableSize)}
              >
                <option value="small">Petite</option>
                <option value="medium">Moyenne</option>
                <option value="large">Grande</option>
              </select>
            </div>

            {/* ASSIGNMENT */}
            <div>
              <label className="block mb-4 text-base font-medium text-mainclr dark:text-neutral-300">
                Attribuer des sièges
              </label>

              {table.seats.map((seat) => (
                <div key={seat.index} className="flex gap-2 mb-2">
                  <span className="w-20 dark:text-neutral-300">
                    Siège {seat.index + 1}
                  </span>

                  <select
                    value={seat.guest?.id || ""}
                    onChange={(e) =>
                      handleSeatGuestChange(seat.index, e.target.value)
                    }
                    className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder dark:border-neutral-700 bg-inputbg dark:bg-neutral-800 rounded-lg focus:border-secondary  dark:text-neutral-300"
                  >
                    <option value="">Vide</option>
                    {allGuests.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* FOOTER */}

            <div className="flex flex-col md:flex-row gap-3 mt-6">
              <Button
                variant="danger"
                onClick={() => deleteTable(table.id)}
                className="flex-1"
              >
                Supprimer la table
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditTable(null)}
                className="flex-1"
              >
                Annuler
              </Button>

              <Button
                onClick={() => {
                  setTables((prev) =>
                    prev.map((t) => (t.id === table.id ? table : t)),
                  );
                  setEditTable(null);
                }}
                className="flex-1"
              >
                Valider
              </Button>
            </div>
          </div>
        </div>
      </OuterModal>
    );
  };

  const toast = useToast();
  const savePlan = async () => {
    setBtnLoading(true);
    const payload = {
      eventId,
      room: {
        widthM: roomWidthM,
        heightM: roomHeightM,
        zoom,
      },
      tables: tables.map((t) => ({
        id: t.id,
        name: t.name,
        shape: t.shape,
        size: t.size,
        color: t.color,
        rotation: t.rotation,
        xPercent: t.xPercent,
        yPercent: t.yPercent,
        capacity: t.capacity,
        widthCm: t.widthCm,
        heightCm: t.heightCm,
        diameterCm: t.diameterCm,
        seats: t.seats.map((s) => ({
          index: s.index,
          guestId: s.guest?.id || null,
        })),
      })),
    };

    try {
      await patchRequest(PROVIDER.UPDATE_GUEST_PLAN, payload);
      toast.success("Plan de sièges enregistré avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Échec de l’enregistrement du plan de sièges");
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const res = await getRequest(
          `${PROVIDER.GUEST_PLAN}?eventId=${eventId}`,
        );
        const savedTables = res?.data?.data?.tables || [];
        const savedRoom = res?.data?.data?.room;

        if (savedRoom) {
          setRoomWidthM(savedRoom.widthM || 10);
          setRoomHeightM(savedRoom.heightM || 15);
          setZoom(savedRoom.zoom || 1);
        }
        const restored = savedTables.map((t: any, index: number) => {
          const xPercent =
            typeof t.xPercent === "number" ? t.xPercent : 0.2 + index * 0.05;
          const yPercent =
            typeof t.yPercent === "number" ? t.yPercent : 0.2 + index * 0.05;

          return {
            ...t,
            xPercent,
            yPercent,
            seats: generateSeats(
              t.shape,
              t.size,
              t.capacity,
              t.diameterCm,
              t.widthCm,
              t.heightCm,
            ).map((s, i) => ({
              ...s,
              guest:
                allGuests.find(
                  (g) =>
                    t.seats?.find((x: any) => x.index === i)?.guestId === g.id,
                ) || null,
            })),
          };
        });

        setTables(restored);
      } catch (e) {}
    };

    loadPlan();
  }, [eventId]);

  return (
    <div className="grid grid-cols-1 gap-5 mt-6">
      {/* LEFT PANEL */}
      <div className="bg-white dark:bg-darkmode p-4 rounded-xl shadow">
        <div className="text-xl font-semibold mb-3 dark:text-neutral-100">
          Les invités doivent placer ({unassigned.length})
        </div>

        {unassigned.length === 0 && (
          <p className="text-xs text-gray-500 ddark:text-neutral-300 mb-2">
            Tous les invités sont déjà assis.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {unassigned.map((g) => (
            <div
              key={g.id}
              draggable
              onDragStart={(e) => onGuestDragStart(e, g)}
              className="p-3 bg-gray-100 dark:bg-neutral-800 dark:text-neutral-300 rounded mb-2 cursor-grab flex items-center gap-2 capitalize"
            >
              <Users size={16} /> {g.name}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-white dark:bg-darkmode p-4 rounded-xl shadow">
        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div>
              <label className="block text-sm mb-1 dark:text-neutral-300">
                Largeur de la pièce (m)
              </label>
              <input
                type="number"
                min={1}
                value={roomWidthM}
                onChange={(e) => setRoomWidthM(Number(e.target.value))}
                className="border px-2 py-1 rounded w-full md:w-24 h-8 text-sm  border-inputborder dark:border-neutral-700 dark:text-neutral-300"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 dark:text-neutral-300">
                Hauteur de la pièce (m)
              </label>
              <input
                type="number"
                min={1}
                value={roomHeightM}
                onChange={(e) => setRoomHeightM(Number(e.target.value))}
                className="border px-2 py-1 rounded w-full md:w-24 h-8 text-sm  border-inputborder dark:border-neutral-700 dark:text-neutral-300"
              />
            </div>
            <div className="no-pdf">
              <label className="block text-sm mb-1 dark:text-neutral-300">
                Zoom
              </label>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
                  className="!p-0 w-8 h-8 dark:text-neutral-300"
                >
                  <Minus size={18} />
                </Button>

                <span className="text-sm w-10 text-center dark:text-neutral-300">
                  {Math.round(zoom * 100)}%
                </span>

                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                  className="!p-0 w-8 h-8 dark:text-neutral-300"
                >
                  <Plus size={18} />
                </Button>
              </div>
            </div>
          </div>

          {/* <h2 className="font-semibold text-xl">Seating Plan</h2> */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 no-pdf">
            <Button
              variant="outline"
              size="small"
              onClick={() => addTable()}
              className="w-full"
            >
              <Plus size={18} /> Ajouter une table
            </Button>

            <Button
              variant="outline"
              size="small"
              onClick={autoGenerate}
              className="w-full"
            >
              Attribution automatique
            </Button>

            <Button
              variant="outline"
              size="small"
              onClick={handleExportPDF}
              className="w-full"
            >
              Exporter au format PDF
            </Button>

            <Button
              variant="primary"
              size="small"
              loading={btnLoading}
              onClick={savePlan}
              className="w-full"
            >
              Plan de table
            </Button>
          </div>
        </div>

        {/* PDF WRAP */}
        <div id="pdfRoot" data-no-translate>
          <div
            className="mt-5 relative border border-gray-200 overflow-auto no-pdf-scroll"
            style={{
              width: "100%",
              height: "650px",
            }}
          >
            <div
              ref={containerRef}
              className="relative w-full h-[650px]  border"
              style={{
                background:
                  "linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)",
                backgroundSize: `${METER_TO_PX * scale}px ${
                  METER_TO_PX * scale
                }px`,
              }}
            >
              {/* CENTERING LAYER */}
              <div
                ref={containerRef}
                className="relative w-full h-[650px] border overflow-auto"
              >
                {/* ROOM */}
                <div
                  // style={{
                  //   width: roomWidthPx,
                  //   height: roomHeightPx,
                  //   transform: `scale(${scale})`,
                  //   transformOrigin: "center center",
                  //   position: "relative",
                  //   background:
                  //     "linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px)",
                  //   backgroundSize: `${METER_TO_PX}px ${METER_TO_PX}px`,
                  // }}
                  // style={{
                  //   width: roomWidthPx,
                  //   height: roomHeightPx,
                  //   // transform: `scale(${scale * zoom})`,
                  //   transform: `scale(${zoom})`,
                  //   transformOrigin: "center center",
                  //   position: "relative",
                  // }}
                  style={{
                    width: roomWidthPx,
                    height: roomHeightPx,
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                    position: "relative",
                  }}
                >
                  {tables.map((t) => {
                    if (!tableRefs.current[t.id]) {
                      tableRefs.current[t.id] =
                        React.createRef<HTMLDivElement>();
                    }

                    const ref = tableRefs.current[t.id];
                    const xPx = t.xPercent * roomWidthPx;
                    const yPx = t.yPercent * roomHeightPx;

                    return (
                      <Draggable
                        key={t.id}
                        nodeRef={ref}
                        position={{ x: xPx, y: yPx }}
                        bounds="parent"
                        onStop={(e, data) => {
                          setTables((prev) =>
                            prev.map((tb) =>
                              tb.id === t.id
                                ? {
                                    ...tb,
                                    xPercent: data.x / roomWidthPx,
                                    yPercent: data.y / roomHeightPx,
                                  }
                                : tb,
                            ),
                          );
                        }}
                      >
                        <div ref={ref} style={{ position: "absolute" }}>
                          {renderTable(t)}
                        </div>
                      </Draggable>
                    );
                  })}
                </div>
              </div>
            </div>
            <div data-no-translate>Généré par we-event.eu</div>
          </div>
        </div>
      </div>

      {EditModal()}
    </div>
  );
};

export default SeatingPlan;
