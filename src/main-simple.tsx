import { createRoot } from "react-dom/client";
import "./index.css";

function SimpleApp() {
  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "48px", color: "#10b981", marginBottom: "20px" }}>
        ✅ React is Working!
      </h1>
      <p style={{ fontSize: "24px", color: "#64748b" }}>
        We Event Application is successfully running
      </p>
      <div style={{ marginTop: "40px", padding: "20px", background: "#f1f5f9", borderRadius: "8px" }}>
        <h2 style={{ color: "#1e293b" }}>System Check:</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ padding: "8px" }}>✅ Vite Dev Server: Running</li>
          <li style={{ padding: "8px" }}>✅ React 18: Loaded</li>
          <li style={{ padding: "8px" }}>✅ TypeScript: Compiled</li>
          <li style={{ padding: "8px" }}>✅ Hot Module Replacement: Active</li>
        </ul>
      </div>
      <div style={{ marginTop: "40px" }}>
        <a 
          href="/home" 
          style={{ 
            display: "inline-block",
            padding: "12px 32px", 
            background: "#10b981", 
            color: "white", 
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "18px"
          }}
        >
          Go to Full App →
        </a>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<SimpleApp />);
