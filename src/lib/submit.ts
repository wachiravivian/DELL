export type RequestPayload = {
  type: "installation" | "support" | "enquiry";
  name: string;
  phone: string;
  email?: string;
  [key: string]: string | undefined;
};

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "/api/ticket.php";
const DEMO = process.env.NEXT_PUBLIC_FORM_DEMO === "true";

export async function submitRequest(data: RequestPayload): Promise<{ reference: string }> {
    if (DEMO) {
    console.log("TEST MODE: nothing is sent", data);
    await new Promise((r) => setTimeout(r, 800));
    return { reference: "" };
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, page: window.location.href }),
  });
  if (!res.ok) throw new Error("Request failed");
  const json = await res.json();
  return { reference: String(json.reference ?? "") };
}
export type FeedbackPayload = {
  name?: string;
  contact?: string;
  installation?: string;
  site_visit?: string;
  call_centre?: string;
  issue_resolution?: string;
  recommend: string;
  comments?: string;
};

const FEEDBACK_ENDPOINT = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT ?? "/api/feedback.php";

export async function submitFeedback(data: FeedbackPayload): Promise<void> {
  if (DEMO) {
    console.log("DEMO feedback (nothing is sent):", data);
    await new Promise((r) => setTimeout(r, 800));
    return;
  }

  const res = await fetch(FEEDBACK_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Request failed");
}