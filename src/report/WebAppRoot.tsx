import WebApp from "../WebApp";
import "./css/main.css";
import ReportApp from "./ReportApp";

function WebAppRoot() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "40px" }}>
        <WebApp />
      </div>

      <hr style={{ margin: "40px 0", border: "1px solid #ddd" }} />

      <div>
        <ReportApp />
      </div>
    </div>
  );
}

export default WebAppRoot;
