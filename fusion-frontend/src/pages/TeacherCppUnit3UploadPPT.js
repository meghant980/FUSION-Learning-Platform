import React from "react";
import UploadPage from "./UploadPage";

const pageStyle = {
  minHeight: "100vh",
  background: "#f5f7f3",
  padding: "30px 5%",
  fontFamily: "'DM Sans', Arial, sans-serif",
};

const headerStyle = {
  background: "#183c35",
  color: "#ffffff",
  padding: "25px 30px",
  borderRadius: "16px",
  marginBottom: "25px",
};

export default function TeacherCppUnit3UploadPPT() {
  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div
          style={{
            color: "#c5d6c8",
            fontSize: "13px",
            marginBottom: "8px",
          }}
        >
          TEACHER PANEL / C++ / UNIT 3
        </div>

        <h1 style={{ margin: 0, fontSize: "25px" }}>
          Upload C++ PPT
        </h1>

        <p style={{ color: "#dce8df", marginBottom: 0 }}>
          Add and manage presentation material for C++ Unit 3.
        </p>
      </div>

      <UploadPage
        unit={3}
        course="cpp"
        category="ppt"
        title="Upload C++ PPT (Unit 3)"
      />
    </div>
  );
}