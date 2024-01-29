import { LoaderFunction } from "@remix-run/node";
import { json, useFetcher, useLoaderData } from "@remix-run/react";
import { Banner, Card, Layout, Page, ProgressBar } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { authenticate } from "~/shopify.server";
import Papa from "papaparse";
import axios from "axios";

type BulkOperation = {
  id: String;
  url: String;
  status: String;
  completedAt: String;
  startedAt: String;
  format: String;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
  query {
    currentBulkOperation {
      id
      status
      errorCode
      createdAt
      completedAt
      objectCount
      fileSize
      url
      partialDataUrl
    }
  }
`
  );
  if (response.ok) {
    console.log("hit --- status export result");
    const data = await response.json();
    console.log(data, "status operation");

    return json(await data.data.currentBulkOperation);
  }

  return null;
};

const ExportResult = () => {
  const data: BulkOperation = useLoaderData<typeof loader>();
  // console.log(data, "currentBulkOperation");

  //---------------------------------------------------polling
  const [pollingData, setPollingData] = useState(data);
  const [shouldPoll, setShouldPoll] = useState(true);
  const [readyUrl, setReadyUrl] = useState("");

  useEffect(() => setPollingData(data), [data]);

  const fetcher = useFetcher();
  const resultsFetcher = useFetcher();

  //-------------------------------------------------------------------------

  // 1) Get fresh data every 30 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && shouldPoll) {
        fetcher.load("/app/exportresult");
      }
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [shouldPoll, fetcher.load]);

  // 2) When the fetcher comes back with new data, update our `data` state.
  useEffect(() => {
    if (fetcher.data) {
      const { status, id, url, completedAt } = fetcher.data as BulkOperation;
      const numericId = id.match(/\d+/)![0];
      setReadyUrl(url as string);

      setPollingData(fetcher.data as BulkOperation);

      if (status === "COMPLETED") {
        setShouldPoll(false);
        console.log("polling stop");

        //--------------get data function (PRODUCTION)

        // const formData = new FormData();
        // formData.set("status", status as string);
        // formData.set("id", numericId as string);
        // formData.set("completedAt", completedAt as string);
        // formData.set("url", url as string);

        // resultsFetcher.submit(formData, {
        //   action: "/app/getandupdateexport",
        //   method: "post",
        // });

        // console.log(resultsFetcher.data, "fifi");
      }
    }
  }, [fetcher.data]);

  const downloadCSV = async () => {
    try {
      const response = await axios.get(readyUrl);

      const lines = response.data.split("\n");

      const jsonArray = lines
        .map((line: any) => {
          try {
            return JSON.parse(line);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
          }
        })
        .filter(Boolean);

      // Convert JSON to CSV
      const csvData = Papa.unparse(jsonArray);

      // Create a Blob object with the CSV data
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      // Set the file name
      link.download = "output.csv";

      // Append the link to the document and trigger the click event
      document.body.appendChild(link);
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  return (
    <Page>
      <ui-title-bar title="Export: ">
        <button variant="breadcrumb">Bulky</button>
        <button>Back</button>
        <button variant="primary">Download Exported File</button>
      </ui-title-bar>

      {pollingData.status === "RUNNING" && (
        <Layout>
          <Layout.Section>
            <Banner title="Export in Progress...">
              <ProgressBar progress={75} />
            </Banner>
            <br />
            <Card>
              <p>in progress</p>
              <p>ID: {pollingData.id}</p>
              <p>Status: {pollingData.status}</p>
              <hr />
              <p>URL: {pollingData.url}</p>
            </Card>
          </Layout.Section>
        </Layout>
      )}

      {pollingData.status === "COMPLETED" && (
        <Layout>
          <Layout.Section>
            <Banner
              title="Export Finished"
              tone="success"
              action={{
                content: "Download Exported File",
                onAction: downloadCSV,
              }}
            />
            <br />
            <Card>
              <p>completed</p>
              <p>ID: {pollingData.id}</p>
              <p>Status: {pollingData.status}</p>
              {/* <p>URL: {pollingData.url}</p> */}
              <button onClick={downloadCSV}>download</button>
            </Card>
          </Layout.Section>
        </Layout>
      )}
    </Page>
  );
};

export default ExportResult;
