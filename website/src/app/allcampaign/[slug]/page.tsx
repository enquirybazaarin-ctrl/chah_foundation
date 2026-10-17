import { redirect } from "next/navigation";

interface AllCampaignProps {
  params: Promise<{ slug: string }>;
}

const ALLCAMPAIGN_MAP: Record<string, string> = {
  // Child Education
  "eyJpdiI6IkY1b2NPL1djM0RTUnNMMXRGTDlwSXc9PSIsInZhbHVlIjoibzhmdlg0RzB3ejR4Q2ZYcFdKd0lYZz09IiwibWFjIjoiZDJmZjA4MGM2NGRkMzBiNzhmYTZjYzlkYWI2ODFkOGRjNDc0ZTFkNjIzYWE1NzcyYzRjOTkxZDMxOTA5MmQ4NyIsInRhZyI6IiJ9": "child-education",
  "child-education": "child-education",

  // Health is Wealth
  "eyJpdiI6InFhblhjS3hna3JxTGgrYVRaanVUTGc9PSIsInZhbHVlIjoiUXV5dnVRRmZtejEyZ3p5TGx5NTlxdz09IiwibWFjIjoiNWFiYzNjNDUxOTE3ZGExYjFhYzAxZWEyYmVkYWE2OWZlZmZiNDBjNTk3MmUwZWY2NmY1ZGVjYzQwNDEzZjNlZSIsInRhZyI6IiJ9": "health-is-wealth",
  "health-is-wealth": "health-is-wealth"
};

export default async function LegacyAllCampaignPage({ params }: AllCampaignProps) {
  const { slug } = await params;
  const target = ALLCAMPAIGN_MAP[slug] || "child-education";
  redirect(`/campaigns/${target}`);
}
