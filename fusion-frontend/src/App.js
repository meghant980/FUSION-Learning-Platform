
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* CORE PAGES */
import Home from "./pages/home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudentFeedback from "./pages/StudentFeedback";
import SetPassword from "./pages/SetPassword";
import AssignmentResultTable from "./pages/AssignmentResultTable";
import StudentSubjective from "./pages/StudentSubjective";
import TeacherSubjectiveAssignment from "./pages/TeacherSubjectiveAssignment";

/* STUDENT LEARNING - C AND C++ */
import LearnC from "./pages/LearnC";
import LearnCpp from "./pages/LearnCpp";

/* STUDENT LEARNING - JAVA */
import LearnJava from "./pages/LearnJava";
import JavaUnit1 from "./pages/JavaUnit1";
import JavaUnit2 from "./pages/JavaUnit2";
import JavaUnit3 from "./pages/JavaUnit3";
import JavaUnit4 from "./pages/JavaUnit4";
import JavaUnitCoding from "./pages/JavaUnitCoding";

/* STUDENT LEARNING - PYTHON */
import LearnPython from "./pages/LearnPython";
import PythonUnit1 from "./pages/PythonUnit1";
import PythonUnit2 from "./pages/PythonUnit2";
import PythonUnit3 from "./pages/PythonUnit3";
import PythonUnit4 from "./pages/PythonUnit4";
import PythonUnitCoding from "./pages/PythonUnitCoding";

/* STUDENT LEARNING - JAVASCRIPT */
import LearnJavaScript from "./pages/LearnJavaScript";
import AllLanguagePractice from "./pages/AllLanguagePractice";
import JavaScriptUnit1 from "./pages/JavaScriptUnit1";
import JavaScriptUnit2 from "./pages/JavaScriptUnit2";
import JavaScriptUnit3 from "./pages/JavaScriptUnit3";
import JavaScriptUnit4 from "./pages/JavaScriptUnit4";
import JavaScriptUnitCoding from "./pages/JavaScriptUnitCoding";

/* SHARED STUDENT MATERIALS */
import StudentAdditionalLanguageMaterials from "./pages/StudentAdditionalLanguageMaterials";

/* STUDENT C UNIT 1 */
import CUnit1 from "./pages/CUnit1";
import CUnit1Ppt from "./pages/CUnit1Ppt";
import CUnit1Assignments from "./pages/CUnit1Assignments";
import CUnit1Coding from "./pages/CUnit1Coding";

/* STUDENT C UNIT 2 */
import CUnit2 from "./pages/CUnit2";
import CUnit2Coding from "./pages/CUnit2Coding";
import CUnit2Ppt from "./pages/CUnit2Ppt";

/* STUDENT C UNIT 3 */
import CUnit3 from "./pages/CUnit3";
import CUnit3Ppt from "./pages/CUnit3Ppt";
import CUnit3Coding from "./pages/CUnit3Coding";

/* STUDENT C UNIT 4 */
import CUnit4 from "./pages/CUnit4";
import CUnit4Ppt from "./pages/CUnit4Ppt";
import CUnit4Coding from "./pages/CUnit4Coding";

import CNotes from "./pages/CNotes";
import CPPTs from "./pages/CPpts";
import CAssignments from "./pages/CAssignments";
import CCodingPractice from "./pages/CCodingPractices";
import StudentNotes from "./pages/StudentNotes";
import LanguageNotes from "./pages/LanguageNotes";

/* TEACHER DASHBOARD */
import Register from "./pages/Register";
import TeacherSignup from "./pages/TeacherSignup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFeedback from "./pages/AdminFeedback";
import TeacherDashboard from "./pages/TeacherDashboard";
import ManageCLanguage from "./pages/ManageCLanguage";
import ManageCppLanguage from "./pages/ManageCppLanguage";
import TeacherCodingHome from "./pages/TeacherCodingHome";
import TeacherCodingResults from "./pages/TeacherCodingResults";
import TeacherAdditionalLanguageCoding from "./pages/TeacherAdditionalLanguageCoding";
import TeacherAdditionalLanguageHome from "./pages/TeacherAdditionalLanguageHome";
import TeacherAdditionalLanguageUnit from "./pages/TeacherAdditionalLanguageUnit";
import TeacherAdditionalLanguageUpload from "./pages/TeacherAdditionalLanguageUpload";

/* TEACHER C UNIT 1 */
import TeacherUnit1 from "./pages/TeacherUnit1";
import TeacherUnit1Assignment from "./pages/TeacherUnit1Assignment";
import TeacherUnit1Coding from "./pages/TeacherUnit1Coding";
import TeacherUnit1UploadNotes from "./pages/TeacherUnit1UploadNotes";
import TeacherUnit1UploadPPT from "./pages/TeacherUnit1UploadPPT";

/* TEACHER C UNIT 2 */
import TeacherUnit2 from "./pages/TeacherUnit2";
import TeacherUnit2Assignment from "./pages/TeacherUnit2Assignment";
import TeacherUnit2Results from "./pages/TeacherUnit2Results";
import TeacherUnit2Coding from "./pages/TeacherUnit2Coding";
import TeacherUnit2ManageAssignments from "./pages/TeacherUnit2ManageAssignments";
import TeacherUnit2UploadNotes from "./pages/TeacherUnit2UploadNotes";
import TeacherUnit2UploadPPT from "./pages/TeacherUnit2UploadPPT";

/* TEACHER C UNIT 3 */
import TeacherUnit3 from "./pages/TeacherUnit3";
import TeacherUnit3Assignment from "./pages/TeacherUnit3Assignment";
import TeacherUnit3ManageAssignments from "./pages/TeacherUnit3ManageAssignments";
import TeacherUnit3Results from "./pages/TeacherUnit3Results";
import TeacherUnit3Coding from "./pages/TeacherUnit3Coding";
import TeacherUnit3UploadNotes from "./pages/TeacherUnit3UploadNotes";
import TeacherUnit3UploadPPT from "./pages/TeacherUnit3UploadPPT";

/* TEACHER C UNIT 4 */
import TeacherUnit4 from "./pages/TeacherUnit4";
import TeacherUnit4UploadNotes from "./pages/TeacherUnit4UploadNotes";
import TeacherUnit4UploadPPT from "./pages/TeacherUnit4UploadPPT";
import TeacherUnit4Assignment from "./pages/TeacherUnit4Assignment";
import TeacherUnit4Coding from "./pages/TeacherUnit4Coding";

/* TEACHER C++ UNIT 1 */
import TeacherCppUnit1 from "./pages/TeacherCppUnit1";
import TeacherCppUnit1UploadNotes from "./pages/TeacherCppUnit1UploadNotes";
import TeacherCppUnit1UploadPPT from "./pages/TeacherCppUnit1UploadPPT";
import TeacherCppUnit1Coding from "./pages/TeacherCppUnit1Coding";
import TeacherCppUnit1Assignment from "./pages/TeacherCppUnit1Assignment";

/* TEACHER C++ UNIT 2 */
import TeacherCppUnit2 from "./pages/TeacherCppUnit2";
import TeacherCppUnit2UploadNotes from "./pages/TeacherCppUnit2UploadNotes";
import TeacherCppUnit2UploadPPT from "./pages/TeacherCppUnit2UploadPPT";
import TeacherCppUnit2Assignment from "./pages/TeacherCppUnit2Assignment";
import TeacherCppUnit2Coding from "./pages/TeacherCppUnit2Coding";

/* TEACHER C++ UNIT 3 */
import TeacherCppUnit3 from "./pages/TeacherCppUnit3";
import TeacherCppUnit3UploadNotes from "./pages/TeacherCppUnit3UploadNotes";
import TeacherCppUnit3UploadPPT from "./pages/TeacherCppUnit3UploadPPT";
import TeacherCppUnit3Assignment from "./pages/TeacherCppUnit3Assignment";
import TeacherCppUnit3Coding from "./pages/TeacherCppUnit3Coding";

/* TEACHER C++ UNIT 4 */
import TeacherCppUnit4 from "./pages/TeacherCppUnit4";
import TeacherCppUnit4UploadNotes from "./pages/TeacherCppUnit4UploadNotes";
import TeacherCppUnit4UploadPPT from "./pages/TeacherCppUnit4UploadPPT";
import TeacherCppUnit4Assignment from "./pages/TeacherCppUnit4Assignment";
import TeacherCppUnit4Coding from "./pages/TeacherCppUnit4Coding";

import TeacherCodingQuestionResults from "./pages/TeacherCodingQuestionResults";

/* ASSIGNMENTS */
import CreateAssignment from "./pages/CreateAssignment";
import ManageAssignments from "./pages/ManageAssignments";
import AssignmentResults from "./pages/AssignmentResults";

/* SUBJECTIVE ASSIGNMENTS */
import CreateSubjective from "./pages/CreateSubjective";
import ManageSubjective from "./pages/ManageSubjective";
import SubjectiveResults from "./pages/SubjectiveResults";

/* FILE UPLOADS */
import ViewUploads from "./pages/ViewUploads";

/* PERFORMANCE */
import TrackPerformance from "./pages/TrackPerformance";
import TrackAssignments from "./pages/TrackAssignments";
import TeacherAssignment from "./pages/TeacherAssignment";
import StudentAssignment from "./pages/StudentAssignment";

/* SUBMISSIONS */
import SubmissionResult from "./pages/SubmissionResult";
import SubmissionHistory from "./pages/SubmissionHistory";

/* MISC */
import Leaderboard from "./leaderboard.jsx";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* DASHBOARDS */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feedback" element={<StudentFeedback />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-feedback" element={<AdminFeedback />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher-signup" element={<TeacherSignup />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

        {/* GENERAL RESULTS */}
        <Route
          path="/teacher/assignment-results/:assignmentId"
          element={<AssignmentResultTable />}
        />

        {/* STUDENT SUBJECTIVE - C AND C++ */}
        <Route
          path="/learn-c/unit/:unit/subjective"
          element={<StudentSubjective />}
        />
        <Route
          path="/learn-cpp/unit/:unit/subjective"
          element={<StudentSubjective />}
        />

        {/* STUDENT SUBJECTIVE - JAVA, PYTHON, JAVASCRIPT */}
        <Route
          path="/learn/:language/unit/:unit/subjective"
          element={<StudentSubjective />}
        />

        {/* TEACHER SUBJECTIVE - EXISTING C ROUTES */}
        <Route
          path="/teacher/unit1/subjective"
          element={<TeacherSubjectiveAssignment />}
        />
        <Route
          path="/teacher/unit2/subjective"
          element={<TeacherSubjectiveAssignment />}
        />
        <Route
          path="/teacher/unit3/subjective"
          element={<TeacherSubjectiveAssignment />}
        />
        <Route
          path="/teacher/unit4/subjective"
          element={<TeacherSubjectiveAssignment />}
        />

        <Route
          path="/teacher/unit1/subjective/manage"
          element={<ManageSubjective />}
        />
        <Route
          path="/teacher/unit2/subjective/manage"
          element={<ManageSubjective />}
        />
        <Route
          path="/teacher/unit3/subjective/manage"
          element={<ManageSubjective />}
        />
        <Route
          path="/teacher/unit4/subjective/manage"
          element={<ManageSubjective />}
        />

        <Route
          path="/teacher/unit1/subjective/create"
          element={<CreateSubjective />}
        />
        <Route
          path="/teacher/unit2/subjective/create"
          element={<CreateSubjective />}
        />
        <Route
          path="/teacher/unit3/subjective/create"
          element={<CreateSubjective />}
        />
        <Route
          path="/teacher/unit4/subjective/create"
          element={<CreateSubjective />}
        />

        <Route
          path="/teacher/unit/:unit/subjective/results"
          element={<SubjectiveResults />}
        />

        {/* TEACHER SUBJECTIVE - JAVA, PYTHON, JAVASCRIPT */}
        <Route
          path="/teacher/:language/unit/:unit/subjective"
          element={<TeacherSubjectiveAssignment />}
        />
        <Route
          path="/teacher/:language/unit/:unit/subjective/create"
          element={<CreateSubjective />}
        />
        <Route
          path="/teacher/:language/unit/:unit/subjective/manage"
          element={<ManageSubjective />}
        />
        <Route
          path="/teacher/:language/unit/:unit/subjective/results"
          element={<SubjectiveResults />}
        />

        <Route path="/practice/all-languages" element={<AllLanguagePractice />} />

        {/* EXISTING C AND C++ LEARNING */}
        <Route path="/learn-c" element={<LearnC />} />
        <Route path="/learn-cpp" element={<LearnCpp />} />

        {/* JAVA COURSE OVERVIEW */}
        <Route path="/learn/java" element={<LearnJava />} />

        {/* JAVA UNIT DASHBOARDS */}
        <Route path="/learn/java/unit1" element={<JavaUnit1 />} />
        <Route path="/learn/java/unit2" element={<JavaUnit2 />} />
        <Route path="/learn/java/unit3" element={<JavaUnit3 />} />
        <Route path="/learn/java/unit4" element={<JavaUnit4 />} />

        {/* JAVA CODING - ALL FOUR UNITS */}
        <Route
          path="/learn/java/unit/:unit/coding"
          element={<JavaUnitCoding />}
        />

        {/* PYTHON COURSE OVERVIEW */}
        <Route path="/learn/python" element={<LearnPython />} />

        {/* PYTHON UNIT DASHBOARDS */}
        <Route path="/learn/python/unit1" element={<PythonUnit1 />} />
        <Route path="/learn/python/unit2" element={<PythonUnit2 />} />
        <Route path="/learn/python/unit3" element={<PythonUnit3 />} />
        <Route path="/learn/python/unit4" element={<PythonUnit4 />} />

        {/* PYTHON CODING - ALL FOUR UNITS */}
        <Route
          path="/learn/python/unit/:unit/coding"
          element={<PythonUnitCoding />}
        />

        {/* JAVASCRIPT COURSE OVERVIEW */}
        <Route path="/learn/javascript" element={<LearnJavaScript />} />

        {/* JAVASCRIPT UNIT DASHBOARDS */}
        <Route
          path="/learn/javascript/unit1"
          element={<JavaScriptUnit1 />}
        />
        <Route
          path="/learn/javascript/unit2"
          element={<JavaScriptUnit2 />}
        />
        <Route
          path="/learn/javascript/unit3"
          element={<JavaScriptUnit3 />}
        />
        <Route
          path="/learn/javascript/unit4"
          element={<JavaScriptUnit4 />}
        />

        {/* JAVASCRIPT CODING - ALL FOUR UNITS */}
        <Route
          path="/learn/javascript/unit/:unit/coding"
          element={<JavaScriptUnitCoding />}
        />

        {/* STUDENT NOTES AND PPT - JAVA, PYTHON, JAVASCRIPT */}
        <Route
          path="/learn/:language/unit/:unit/materials"
          element={<StudentAdditionalLanguageMaterials />}
        />

        {/* TOPIC-WISE THEORY NOTES - SEPARATE FROM TEACHER-UPLOADED NOTES */}
        <Route
          path="/learn/:language/unit/:unit/topics"
          element={<LanguageNotes />}
        />

        {/* STUDENT C UNIT 1 */}
        <Route path="/learn-c/unit1" element={<CUnit1 />} />
        <Route
          path="/learn-c/unit1/notes"
          element={<Navigate to="/student/notes/c/1" replace />}
        />
        <Route path="/learn-c/unit1/ppt" element={<CUnit1Ppt />} />
        <Route
          path="/learn-c/unit1/assignments"
          element={<CUnit1Assignments />}
        />
        <Route path="/learn-c/unit1/coding" element={<CUnit1Coding />} />

        {/* STUDENT C++ UNIT 1 */}
        <Route path="/learn-cpp/unit1" element={<CUnit1 />} />
        <Route
          path="/learn-cpp/unit1/notes"
          element={<Navigate to="/student/notes/cpp/1" replace />}
        />
        <Route path="/learn-cpp/unit1/ppt" element={<CUnit1Ppt />} />
        <Route path="/learn-cpp/unit1/coding" element={<CUnit1Coding />} />

        {/* STUDENT C UNIT 2 */}
        <Route path="/learn-c/unit2" element={<CUnit2 />} />
        <Route path="/learn-c/unit2/ppt" element={<CUnit2Ppt />} />
        <Route path="/learn-c/unit2/coding" element={<CUnit2Coding />} />
        <Route
          path="/learn-c/unit2/notes"
          element={<Navigate to="/student/notes/c/2" replace />}
        />

        {/* STUDENT C++ UNIT 2 */}
        <Route path="/learn-cpp/unit2" element={<CUnit2 />} />
        <Route path="/learn-cpp/unit2/ppt" element={<CUnit2Ppt />} />
        <Route path="/learn-cpp/unit2/coding" element={<CUnit2Coding />} />
        <Route
          path="/learn-cpp/unit2/notes"
          element={<Navigate to="/student/notes/cpp/2" replace />}
        />

        {/* STUDENT C UNIT 3 */}
        <Route path="/learn-c/unit3" element={<CUnit3 />} />
        <Route path="/learn-c/unit3/ppt" element={<CUnit3Ppt />} />
        <Route path="/learn-c/unit3/coding" element={<CUnit3Coding />} />
        <Route
          path="/learn-c/unit3/notes"
          element={<Navigate to="/student/notes/c/3" replace />}
        />

        {/* STUDENT C++ UNIT 3 */}
        <Route path="/learn-cpp/unit3" element={<CUnit3 />} />
        <Route path="/learn-cpp/unit3/ppt" element={<CUnit3Ppt />} />
        <Route path="/learn-cpp/unit3/coding" element={<CUnit3Coding />} />
        <Route
          path="/learn-cpp/unit3/notes"
          element={<Navigate to="/student/notes/cpp/3" replace />}
        />

        {/* STUDENT C UNIT 4 */}
        <Route path="/learn-c/unit4" element={<CUnit4 />} />
        <Route path="/learn-c/unit4/ppt" element={<CUnit4Ppt />} />
        <Route path="/learn-c/unit4/coding" element={<CUnit4Coding />} />
        <Route
          path="/learn-c/unit4/notes"
          element={<Navigate to="/student/notes/c/4" replace />}
        />
        <Route
          path="/unit4/coding"
          element={<Navigate to="/learn-c/unit4/coding" replace />}
        />

        {/* STUDENT C++ UNIT 4 */}
        <Route path="/learn-cpp/unit4" element={<CUnit4 />} />
        <Route path="/learn-cpp/unit4/ppt" element={<CUnit4Ppt />} />
        <Route path="/learn-cpp/unit4/coding" element={<CUnit4Coding />} />
        <Route
          path="/learn-cpp/unit4/notes"
          element={<Navigate to="/student/notes/cpp/4" replace />}
        />

        {/* UNIVERSAL STUDENT NOTES */}
        <Route
          path="/student/notes/:subject/:unitId"
          element={<StudentNotes />}
        />

        {/* GENERAL STUDENT PAGES */}
        <Route path="/notes" element={<CNotes />} />
        <Route path="/ppts" element={<CPPTs />} />
        <Route path="/assignments" element={<CAssignments />} />
        <Route path="/coding" element={<CCodingPractice />} />

        {/* TEACHER LANGUAGE MANAGEMENT - C AND C++ */}
        <Route path="/teacher/manage-c" element={<ManageCLanguage />} />
        <Route path="/teacher/manage-cpp" element={<ManageCppLanguage />} />

        {/* TEACHER LANGUAGE SELECTION - JAVA, PYTHON, JAVASCRIPT */}
        <Route
          path="/teacher/:language"
          element={<TeacherAdditionalLanguageHome />}
        />

        {/* TEACHER UNIT DASHBOARD - JAVA, PYTHON, JAVASCRIPT */}
        <Route
          path="/teacher/:language/unit/:unit"
          element={<TeacherAdditionalLanguageUnit />}
        />

        {/* TEACHER NOTES AND PPT UPLOAD - JAVA, PYTHON, JAVASCRIPT */}
        <Route
          path="/teacher/:language/unit/:unit/upload-notes"
          element={<TeacherAdditionalLanguageUpload />}
        />
        <Route
          path="/teacher/:language/unit/:unit/upload-ppt"
          element={<TeacherAdditionalLanguageUpload />}
        />

        {/* TEACHER CODING HOME AND RESULTS */}
        <Route path="/teacher/coding" element={<TeacherCodingHome />} />
        <Route path="/teacher/coding/add" element={<TeacherCodingHome />} />
        <Route
          path="/teacher/coding/results"
          element={<TeacherCodingResults />}
        />

        {/* LEGACY ADDITIONAL-LANGUAGE CODING ROUTES */}
        <Route
          path="/teacher/coding/java"
          element={<TeacherAdditionalLanguageCoding language="java" />}
        />
        <Route
          path="/teacher/coding/python"
          element={<TeacherAdditionalLanguageCoding language="python" />}
        />
        <Route
          path="/teacher/coding/javascript"
          element={<TeacherAdditionalLanguageCoding language="javascript" />}
        />

        {/* UNIT-WISE ADDITIONAL-LANGUAGE CODING */}
        <Route
          path="/teacher/:language/unit/:unit/coding"
          element={<TeacherAdditionalLanguageCoding />}
        />

        {/* TEACHER C UNIT 1 */}
        <Route path="/teacher/unit1" element={<TeacherUnit1 />} />
        <Route
          path="/teacher/unit1/assignments"
          element={<TeacherUnit1Assignment />}
        />
        <Route
          path="/teacher/unit1/manage-assignments"
          element={<ManageAssignments />}
        />
        <Route
          path="/teacher/unit1/results"
          element={<AssignmentResults />}
        />
        <Route
          path="/teacher/unit1/coding"
          element={<TeacherUnit1Coding />}
        />
        <Route
          path="/teacher/unit1/upload-notes"
          element={<TeacherUnit1UploadNotes course="c" unit={1} />}
        />
        <Route
          path="/teacher/unit1/upload-ppt"
          element={<TeacherUnit1UploadPPT />}
        />

        {/* TEACHER C UNIT 2 */}
        <Route path="/teacher/unit2" element={<TeacherUnit2 />} />
        <Route
          path="/teacher/unit2/assignments"
          element={<TeacherUnit2Assignment />}
        />
        <Route
          path="/teacher/unit2/assignment-manage"
          element={<TeacherUnit2ManageAssignments />}
        />
        <Route
          path="/teacher/unit2/results"
          element={<TeacherUnit2Results />}
        />
        <Route
          path="/teacher/unit2/results/:assignmentId"
          element={<AssignmentResultTable />}
        />
        <Route
          path="/teacher/unit2/coding"
          element={<TeacherUnit2Coding />}
        />
        <Route
          path="/teacher/unit2/upload-ppt"
          element={<TeacherUnit2UploadPPT />}
        />
        <Route
          path="/teacher/unit2/upload-notes"
          element={<TeacherUnit2UploadNotes course="c" unit={2} />}
        />

        {/* TEACHER C UNIT 3 */}
        <Route path="/teacher/unit3" element={<TeacherUnit3 />} />
        <Route
          path="/teacher/unit3/coding"
          element={<TeacherUnit3Coding />}
        />
        <Route
          path="/teacher/unit3/upload-notes"
          element={<TeacherUnit3UploadNotes course="c" unit={3} />}
        />
        <Route
          path="/teacher/unit3/upload-ppt"
          element={<TeacherUnit3UploadPPT />}
        />
        <Route
          path="/teacher/unit3/assignments"
          element={<TeacherUnit3Assignment />}
        />
        <Route
          path="/teacher/unit3/manage-assignments"
          element={<TeacherUnit3ManageAssignments />}
        />
        <Route
          path="/teacher/unit3/results"
          element={<TeacherUnit3Results />}
        />
        <Route
          path="/teacher/unit/:unit/coding/add"
          element={<TeacherUnit3Coding />}
        />
        <Route
          path="/teacher/unit/:unit/coding/results"
          element={<TeacherCodingResults />}
        />
        <Route
          path="/teacher/unit3/uploadNotes"
          element={<Navigate to="/teacher/unit3/upload-notes" replace />}
        />

        {/* TEACHER C UNIT 4 */}
        <Route path="/teacher/unit4" element={<TeacherUnit4 />} />
        <Route
          path="/teacher/unit4/upload-notes"
          element={<TeacherUnit4UploadNotes course="c" unit={4} />}
        />
        <Route
          path="/teacher/unit4/upload-ppt"
          element={<TeacherUnit4UploadPPT />}
        />
        <Route
          path="/teacher/unit4/assignments"
          element={<TeacherUnit4Assignment />}
        />
        <Route
          path="/teacher/unit4/coding"
          element={<TeacherUnit4Coding />}
        />

        {/* TEACHER C++ UNIT 1 */}
        <Route path="/teacher/cpp/unit1" element={<TeacherCppUnit1 />} />
        <Route
          path="/teacher/cpp/unit1/upload-notes"
          element={<TeacherCppUnit1UploadNotes />}
        />
        <Route
          path="/teacher/cpp/unit1/upload-ppt"
          element={<TeacherCppUnit1UploadPPT />}
        />
        <Route
          path="/teacher/cpp/unit1/coding"
          element={<TeacherCppUnit1Coding />}
        />
        <Route
          path="/teacher/cpp/unit1/assignments"
          element={<TeacherCppUnit1Assignment />}
        />
        <Route
          path="/teacher/cpp/unit1/assignment-manage"
          element={<ManageAssignments />}
        />
        <Route
          path="/teacher/cpp/unit1/results"
          element={<AssignmentResults />}
        />

        {/* TEACHER C++ UNIT 2 */}
        <Route path="/teacher/cpp/unit2" element={<TeacherCppUnit2 />} />
        <Route
          path="/teacher/cpp/unit2/upload-notes"
          element={<TeacherCppUnit2UploadNotes />}
        />
        <Route
          path="/teacher/cpp/unit2/upload-ppt"
          element={<TeacherCppUnit2UploadPPT />}
        />
        <Route
          path="/teacher/cpp/unit2/assignments"
          element={<TeacherCppUnit2Assignment />}
        />
        <Route
          path="/teacher/cpp/unit2/assignment-manage"
          element={<ManageAssignments />}
        />
        <Route
          path="/teacher/cpp/unit2/results"
          element={<AssignmentResults />}
        />
        <Route
          path="/teacher/cpp/unit2/coding"
          element={<TeacherCppUnit2Coding />}
        />

        {/* TEACHER C++ UNIT 3 */}
        <Route path="/teacher/cpp/unit3" element={<TeacherCppUnit3 />} />
        <Route
          path="/teacher/cpp/unit3/upload-notes"
          element={<TeacherCppUnit3UploadNotes />}
        />
        <Route
          path="/teacher/cpp/unit3/upload-ppt"
          element={<TeacherCppUnit3UploadPPT />}
        />
        <Route
          path="/teacher/cpp/unit3/assignments"
          element={<TeacherCppUnit3Assignment />}
        />
        <Route
          path="/teacher/cpp/unit3/assignment-manage"
          element={<ManageAssignments />}
        />
        <Route
          path="/teacher/cpp/unit3/results"
          element={<AssignmentResults />}
        />
        <Route
          path="/teacher/cpp/unit3/coding"
          element={<TeacherCppUnit3Coding />}
        />

        {/* TEACHER C++ UNIT 4 */}
        <Route path="/teacher/cpp/unit4" element={<TeacherCppUnit4 />} />
        <Route
          path="/teacher/cpp/unit4/upload-notes"
          element={<TeacherCppUnit4UploadNotes />}
        />
        <Route
          path="/teacher/cpp/unit4/upload-ppt"
          element={<TeacherCppUnit4UploadPPT />}
        />
        <Route
          path="/teacher/cpp/unit4/assignments"
          element={<TeacherCppUnit4Assignment />}
        />
        <Route
          path="/teacher/cpp/unit4/assignment-manage"
          element={<ManageAssignments />}
        />
        <Route
          path="/teacher/cpp/unit4/results"
          element={<AssignmentResults />}
        />
        <Route
          path="/teacher/cpp/unit4/coding"
          element={<TeacherCppUnit4Coding />}
        />

        {/* CODING QUESTION RESULTS - C */}
        <Route
          path="/teacher/unit/:unit/coding/results/:questionId"
          element={<TeacherCodingQuestionResults />}
        />

        {/* CODING QUESTION RESULTS - C++ */}
        <Route
          path="/teacher/cpp/unit/:unit/coding/results/:questionId"
          element={<TeacherCodingQuestionResults />}
        />

        {/* ASSIGNMENTS */}
        <Route
          path="/teacher/unit/:unit/create-assignment"
          element={<CreateAssignment />}
        />
        <Route
          path="/teacher/create-assignment"
          element={<CreateAssignment />}
        />

        {/* PERFORMANCE */}
        <Route path="/teacher-assignment" element={<TeacherAssignment />} />
        <Route path="/student-assignment" element={<StudentAssignment />} />
        <Route path="/track-performance" element={<TrackPerformance />} />
        <Route
          path="/track-performance/assignments"
          element={<TrackAssignments />}
        />

        {/* FILE UPLOADS */}
        <Route path="/view-uploads" element={<ViewUploads />} />

        {/* SUBMISSIONS */}
        <Route path="/submission/:id" element={<SubmissionResult />} />
        <Route path="/submissions" element={<SubmissionHistory />} />

        {/* LEADERBOARD */}
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "100px" }}>
              <h2>Page Not Found</h2>
              <a href="/" style={{ color: "blue" }}>
                Go Home
              </a>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
