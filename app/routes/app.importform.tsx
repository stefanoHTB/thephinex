import { Page } from "@shopify/polaris";
import React from "react";
import { useLocation, useNavigation } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";

type Props = {};

export const action: ActionFunction = async ({ request }) => {
  //grab data here
  const formData = await request.formData();
  const importedDataJson = JSON.parse(formData.get("importfields") as string);
  console.log(importedDataJson, "importedDataJson---bububu");

  //pass it to json

  // submit it to new action
  return null;
};

const ImportForm = (props: Props) => {
  const { state } = useLocation();
  console.log(state, state);
  const navigation = useNavigation();
  console.log(navigation.state, "state attetetete");
  console.log(navigation.formData, "state attetetete");

  return <Page>ImportForm</Page>;
};

export default ImportForm;
