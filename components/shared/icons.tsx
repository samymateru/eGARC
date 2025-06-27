import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileImage,
} from "@fortawesome/free-solid-svg-icons";

export function PdfIcon() {
  return (
    <FontAwesomeIcon
      icon={faFilePdf}
      style={{ fontSize: "20px", color: "#e53e3e" }}
      aria-hidden="true"
    />
  );
}

export function WordIcon() {
  return (
    <FontAwesomeIcon
      icon={faFileWord}
      style={{ fontSize: "20px", color: "#3b82f6" }}
      aria-hidden="true"
    />
  );
}

export function ExcelIcon() {
  return (
    <FontAwesomeIcon
      icon={faFileExcel}
      style={{ fontSize: "20px", color: "#16a34a" }}
      aria-hidden="true"
    />
  );
}

export function ImageIcon() {
  return (
    <FontAwesomeIcon
      icon={faFileImage}
      style={{ fontSize: "20px", color: "#404040" }}
      aria-hidden="true"
    />
  );
}
