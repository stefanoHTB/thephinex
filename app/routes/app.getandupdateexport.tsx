import { ActionFunction, json } from "@remix-run/node";
import { updateJob } from "~/models/jobs.server";
import axios from "axios";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const status = formData.get("status");
  const id = formData.get("id");
  const url = formData.get("url");
  const completedAt = formData.get("completedAt");

  const resUrl = await axios.get(url as string);
  console.log(resUrl, "-----------resUrl");
  //gooooood

  //   const parser = new Parser();
  //   const csv = parser.parse(resUrl);
  //   console.log(csv, "---------csv---------");

  //   const jsonData = extractArrayOfObjects(resUrl);
  //   console.log(jsonData, "-----------jsonData");

  const response = await updateJob({
    id: id,
    status: status,
    url: url,
    finishedAt: completedAt,
  });

  if (response) {
    return json(response);
  }

  return null;
};
