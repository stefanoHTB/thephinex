import { LoaderFunction, json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

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
    console.log("hit --- status export result--------------bubub");
    const data = await response.json();
    console.log(data, "status operation");

    //update db createjob

    return json(await data.data.currentBulkOperation);
  }

  return null;
};
