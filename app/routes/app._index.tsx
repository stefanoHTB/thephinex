import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { Box, Button, Card, Icon, Layout, Page, Text } from "@shopify/polaris";
import { Link } from "@remix-run/react";
import { CircleDownIcon } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import { CustomDropZone } from "~/components/DropZone";
import { CustomCalledOutCard } from "~/components/CustomCalledOut";
import { Placeholder } from "~/components/Placeholder";

export default function Index() {
  return (
    <Page>
      <ui-title-bar title="Bulky"></ui-title-bar>
      <Layout>
        <Layout.Section>
          {/* <a href="shopify://admin/products" target="_top">Products page</a> */}
          <Card>
            <Text variant="headingMd" as="h4">
              Export
            </Text>
            <br />
            <Text as="h6">
              You will be able to select the particular data items to export.
            </Text>
            <br />
            <Link to="/app/exportform">
              <Button variant="primary">New Export</Button>
            </Link>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Text variant="headingMd" as="h4">
              Import
            </Text>
            <br />
            {/* <Icon source={CircleDownIcon}tone="base"/> */}
            <CustomDropZone />
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Box background="bg-fill-info" borderRadius="100">
              <Placeholder label="You have 0 scheduled jobs" />
            </Box>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Text variant="headingMd" as="h4">
            Help
          </Text>
          <br />
          <CustomCalledOutCard
            title={"Support"}
            illustration={""}
            primaryActionContent={"Contact Support"}
            primaryActionUrl={""}
            children={
              "If you have any questions, issues, missing features or concerns - don't guess, don't wait - contact us and we will help you."
            }
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
