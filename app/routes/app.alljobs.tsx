import { ActionFunction } from "@remix-run/node";
import { Form, json, useActionData, useSubmit } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import React from "react";
import { authenticate } from "~/shopify.server";

type Props = {};

export const action: ActionFunction = async ({ request }) => {
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
    console.log("hit --- status");
    const data = await response.json();
    console.log(data, "status operation");

    return json({
      data: data.data,
    });
  }

  return null;
};

const AllJobs = (props: Props) => {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  console.log(actionData, "status");
  const status = () => submit({}, { replace: true, method: "POST" });

  return (
    <Page>
      <Form method="post" action="/app/alljobs">
        <button onClick={status}>Status</button>
      </Form>
    </Page>
  );
};

export default AllJobs;
