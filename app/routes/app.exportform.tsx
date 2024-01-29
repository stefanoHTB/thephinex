import {
  Layout,
  Page,
  Card,
  LegacyCard,
  ResourceList,
  ResourceItem,
  Text,
  OptionList,
  Image,
} from "@shopify/polaris";
import { Button, Popover } from "@shopify/polaris";
import { useState, useCallback } from "react";
import type { ResourceListProps } from "@shopify/polaris";
import { ActionFunction, redirect } from "@remix-run/node";
import { Form, json, useActionData, useSubmit } from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import { createJob } from "~/models/jobs.server";
import { productsQuery } from "~/graphql/products";
import { customersQuery } from "~/graphql/customers";
import { ordersQuery } from "~/graphql/orders";
import { productsCustomQuery } from "~/graphql/customProducts";

type Props = {};

const items = [
  {
    id: "products",
    title: "Products",
  },
  {
    id: "customers",
    title: "Customers",
  },
  {
    id: "orders",
    title: "Orders",
  },
];
export const action: ActionFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const queryTarget = formData.get("queryTarget");
  const selectedProductFields = JSON.parse(
    formData.get("selectedFieldsProducts") as string
  );
  console.log(
    selectedProductFields,
    "selectedProductFields--------------------------"
  );

  const ddnew = productsCustomQuery(selectedProductFields);
  console.log(ddnew, "kuku----------");

  let selectedQuery;

  if (queryTarget === "products") {
    selectedQuery = productsQuery;
    // selectedQuery = ddnew;
  } else if (queryTarget === "customers") {
    selectedQuery = customersQuery;
  } else if (queryTarget === "orders") {
    selectedQuery = ordersQuery;
  }

  const response = await admin.graphql(`
  #graphql
    mutation {
        bulkOperationRunQuery(
    query: """
     ${selectedQuery}
 """
    ) {
    bulkOperation {
      id
      status
      query
      rootObjectCount
      type
      partialDataUrl
      objectCount
      fileSize
      createdAt
      url
    }
    userErrors {
      field
      message
    }
  }
} 
`);

  if (response.ok) {
    const data = await response.json();

    const { id, status, createdAt, completedAt, url } =
      data.data.bulkOperationRunQuery.bulkOperation;
    const numericId = id.match(/\d+/)[0];

    // console.log(id, numericId, status, "single valuess ------------");

    //create db createjob (type, endpoint, format)
    await createJob({
      id: numericId,
      status: status,
      type: "export",
      endpoint: "products",
      format: "cvs",
      startedAt: createdAt,
      finishedAt: completedAt,
      url: url,
    });
    console.log("created job -------");

    return redirect("/app/exportresult");
  }

  return null;
};

const ExportForm = (props: Props) => {
  //----------------- actionPopover --------------
  const [active, setActive] = useState(false);

  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);

  // console.log(selectedItems, "selectedItems");

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const activator = (
    <Button onClick={toggleActive} disclosure>
      Select Sheets
    </Button>
  );

  //----------------- end actionPopover --------------

  //----------------- beginning of popover --------------

  const [selectedBasic, setSelectedBasic] = useState<string[]>([]);
  // console.log(selectedBasic, "selectedBasic");

  //----------------- beginning of action form remix --------------

  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

  // console.log(actionData, "export form");

  const createExport = () => {
    const formData = new FormData();
    formData.set("queryTarget", selectedItems![0] as string);
    formData.set("selectedFieldsProducts", JSON.stringify(selectedBasic));

    submit(formData, {
      replace: true,
      method: "POST",
      action: "/app/exportform",
    });
  };

  //----------------- dynamic graphql query --------------

  // const [selectedQueryTarget, setSelectedQueryTarget] = useState<string | null>(
  //   null
  // );

  return (
    <Page>
      <ui-title-bar title="New Export">
        <button variant="breadcrumb">Home</button>
        <button
          onClick={() => {
            redirect("/app");
          }}
        >
          Back
        </button>
        <button variant="primary" onClick={createExport}>
          Export
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="p" fontWeight="bold">
              Format: CSV
            </Text>
          </Card>
          <br />
          <Card>
            {/* //-----------------POPOVER-------------------- */}
            <div style={{ position: "relative" }}>
              <Popover
                active={active}
                activator={activator}
                autofocusTarget="first-node"
                onClose={toggleActive}
                fullWidth
              >
                <LegacyCard>
                  {/* //-----------------RESOURCE LIST-------------------- */}
                  <ResourceList
                    resourceName={{ singular: "Entity", plural: "Entities" }}
                    items={items}
                    selectedItems={selectedItems}
                    onSelectionChange={setSelectedItems}
                    selectable
                    renderItem={(item) => {
                      const { id, title } = item;
                      return (
                        <ResourceItem
                          id={id}
                          onClick={(id) => {
                            //login to open card dynamically
                            console.log(id, "id");
                          }}
                          accessibilityLabel={`View details for ${title}`}
                          name={title}
                        >
                          <Text variant="bodyMd" fontWeight="bold" as="h3">
                            {title}
                          </Text>
                        </ResourceItem>
                      );
                    }}
                  />
                  {/* //-----------------RESOURCE LIST END-------------------- */}
                </LegacyCard>
              </Popover>
            </div>
            <br />
            {/* //-----------------POPOVER END----------------- */}
            <Layout>
              <Layout.Section>
                {selectedItems!.includes("products") && (
                  <Card>
                    <Layout>
                      <Layout.Section>
                        <h1>Products</h1>
                      </Layout.Section>
                      <Layout.Section>
                        <h1>Content</h1>
                        <LegacyCard>
                          <OptionList
                            title="Basic Columns"
                            onChange={setSelectedBasic}
                            options={[
                              { value: "id", label: "ID" },
                              { value: "handle", label: "Handle" },
                              { value: "command", label: "Command" },
                              { value: "title", label: "Title" },
                              { value: "bodyhtml", label: "Body HTML" },
                            ]}
                            selected={selectedBasic}
                            allowMultiple
                          />
                        </LegacyCard>
                      </Layout.Section>
                    </Layout>
                  </Card>
                )}
                {selectedItems!.includes("customers") && (
                  <Card>
                    <h1>Customers</h1>
                  </Card>
                )}
                {selectedItems!.includes("orders") && (
                  <Card>
                    <h1>Orders</h1>
                  </Card>
                )}
              </Layout.Section>
              <Layout.Section>
                {(!selectedItems || selectedItems.length === 0) && (
                  <div className="flex justify-center">
                    <div className="flex justify-center flex-col items-center">
                      <Image
                        className="w-64"
                        source={require("../assets/icon2.png")}
                        alt="Local Asset Image"
                      />
                      <h1>Choose data for your Export file...</h1>
                      <br />
                      <Button variant="primary" onClick={toggleActive}>
                        Select Sheets
                      </Button>
                    </div>
                  </div>
                )}
              </Layout.Section>
            </Layout>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ExportForm;
