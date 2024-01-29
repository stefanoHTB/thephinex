import { useFetcher, useNavigate, useSubmit } from "@remix-run/react";
import { DropZone, LegacyStack, Thumbnail, Text } from "@shopify/polaris";
import { NoteIcon } from "@shopify/polaris-icons";
import Papa from "papaparse";
import { useState, useCallback } from "react";

export function CustomDropZone() {
  const [files, setFiles] = useState<File[]>([]);
  console.log(files, "filesssss");
  const [jsonData, setJsonData] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetcher = useFetcher();

  console.log(jsonData, "ddidjd");

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) => {
      setFiles((files) => [...files, ...acceptedFiles]);

      acceptedFiles.forEach((file) => {
        // Parse CSV content to JSON using papaparse
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            setJsonData((data) => [...data, ...result.data]);
          },
        });
      });

      // const submit = useSubmit();

      const formData = new FormData();
      formData.set("importfields", JSON.stringify(jsonData));

      // submit(formData, {
      //   replace: true,
      //   action: "/app/importform",
      //   method: "post",
      //   navigate: true,
      // });

      navigate("/app/importform", { state: { jsonData } });
    },
    []
  );

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <div style={{ padding: "0" }}>
      <LegacyStack vertical>
        {files.map((file, index) => (
          <LegacyStack alignment="center" key={index}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={
                validImageTypes.includes(file.type)
                  ? window.URL.createObjectURL(file)
                  : NoteIcon
              }
            />
            <div>
              {file.name}{" "}
              <Text variant="bodySm" as="p">
                {file.size} bytes
              </Text>
            </div>
          </LegacyStack>
        ))}
      </LegacyStack>
    </div>
  );

  return (
    <DropZone onDrop={handleDropZoneDrop}>
      {uploadedFiles}
      {fileUpload}
    </DropZone>
  );
}
