
import React from "react";
import UploadPage from "./UploadPage";

const colors = {
  forest: "#183c35",
  background: "#f5f7f3",
  white: "#ffffff",
  border: "#dce5dc",
};

export default function TeacherCppUnit4UploadPPT() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        padding: "36px 5%",
        fontFamily: "'DM Sans', Arial, sans-serif",
        color: colors.forest,
      }}
    >
      <header
        style={{
          background: colors.forest,
          color: colors.white,
          padding: "30px 32px",
          borderRadius: "18px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#c5d5c5",
            marginBottom: "10px",
          }}
        >
          Fusion • Teacher Workspace • C++
        </div>

        <h1 style={{ fontSize: "28px", margin: 0, fontWeight: 700 }}>
          Upload PPT — Unit 4
        </h1>

        <p
          style={{
            color: "#d5e1d7",
            fontSize: "14px",
            marginTop: "10px",
            marginBottom: 0,
          }}
        >
          Add and manage C++ Unit 4 presentation materials for your students.
        </p>
      </header>

      <div
        style={{
          background: colors.white,
          border: `1px solid ${colors.border}`,
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 5px 18px rgba(24,60,53,0.04)",
        }}
      >
        <UploadPage
          unit={4}
          course="cpp"
          category="ppt"
          title="Upload C++ PPT (Unit 4)"
        />
      </div>
    </div>
  );
}
