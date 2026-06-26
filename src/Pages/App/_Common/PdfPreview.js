import {
  EyeOutlined,
  LeftCircleFilled,
  LeftOutlined,
  RightCircleFilled,
  RightSquareTwoTone,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import "react-pdf/dist/umd/Page/AnnotationLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfPreview = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // useEffect(() => {
  //   setPageNumber(1);
  // }, [file]);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  useEffect(() => {
    console.log(file);
  }, []);

  return (
    <>
      <div
        className="box text-center "
        style={{
          height: "600px",
          overflow: "scroll",
          textAlign: "center",
          alignment: "center",
          backgroundColor: "#eee",
          paddingLeft: "20px",
          paddingRight: "20px",
          // marginTop: "80px",
        }}
      >
        {(file && (
          <>
            <div
              className="ml-auto mr-auto bg-success pt-1 pb-1"
              style={{
                width: "200px",
                position: "sticky",
                top: 36,
                zIndex: 99,
              }}
            >
              <Pager
                pageNumber={pageNumber}
                numPages={numPages}
                setPageNumber={setPageNumber}
              />
            </div>{" "}
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              className="box bg-white"
              noData="Please select a file"
              loading={<h2>Loading PDF Preview</h2>}
            >
              <Page pageNumber={pageNumber} scale={1.0} />
            </Document>
            {/* <div className="ml-auto mr-auto bg-success pt-1 pb-1" style={{ width: "200px", position: "relative" }}>
              <Pager pageNumber={pageNumber} numPages={numPages} setPageNumber={setPageNumber} />
            </div> */}
          </>
        )) || (
          <>
            <div
              style={{
                fontSize: "44px",
                fontWeight: "bold",
                color: "#bbb",
                marginTop: "40px",
              }}
            >
              SELECT A DOCUMENT <br />
              <span className="text-white text-outline">TO PREVIEW </span>
              <br />
              <EyeOutlined className="text-primary" />
              <br />
              ITS CONTENTS
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PdfPreview;

const Pager = ({ pageNumber, setPageNumber, numPages }) => {
  return (
    <>
      <LeftCircleFilled
        style={{ fontSize: "24px", cursor: "pointer" }}
        className={`mr-auto ${pageNumber === 1 ? "text-disabled" : ""}`}
        onClick={() => {
          if (pageNumber > 1) setPageNumber(pageNumber - 1);
        }}
      />
      &nbsp;&nbsp; Page &nbsp;&nbsp; <b>{pageNumber}</b> &nbsp;&nbsp; of
      &nbsp;&nbsp; <b>{numPages}</b> &nbsp;&nbsp;
      <RightCircleFilled
        disabled={pageNumber === numPages}
        style={{ fontSize: "24px", cursor: "pointer" }}
        className={`ml-auto ${pageNumber === numPages ? "text-disabled" : ""}`}
        onClick={() => {
          if (pageNumber < numPages) setPageNumber(pageNumber + 1);
        }}
      />
    </>
  );
};
