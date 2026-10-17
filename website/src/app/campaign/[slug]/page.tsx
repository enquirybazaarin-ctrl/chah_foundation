import { redirect } from "next/navigation";

interface CampaignProps {
  params: Promise<{ slug: string }>;
}

const CAMPAIGN_MAP: Record<string, string> = {
  // Changes Elder Life
  "eyJpdiI6IkIyZ21vOEFHRS9oeHNDNmwwYkF5aHc9PSIsInZhbHVlIjoiMTBpTklCYlc1SVRYbldCaDVFQ0NzUT09IiwibWFjIjoiODI2NWM4MWUxNjk1YmE4NmEzMzYwYTRiZmM3YWZhMjI2MmIzNWFlOTQ3MzM0ZGIxNjRjYmVlZDE3OWU4ZjdmYSIsInRhZyI6IiJ9": "changes-elder-life",
  "changes-elder-life": "changes-elder-life",

  // Hungry Mitao
  "eyJpdiI6IndUS29uU3c2UFVzOHUxa2taODhXU0E9PSIsInZhbHVlIjoid2traXFrMHBOQWc3eFRVZkhYdFBLZz09IiwibWFjIjoiZTAzNjU5Y2YxMTk3YTVmMjY4YzU3MjQ5YjYyOWNlZWIxNjE2YWE0OWRiZGEzNTQyZDRiYTY2ODlhNDFmNzJhNyIsInRhZyI6IiJ9": "hungry-mitao",
  "hungry-mitao": "hungry-mitao"
};

export default async function LegacyCampaignPage({ params }: CampaignProps) {
  const { slug } = await params;
  const target = CAMPAIGN_MAP[slug] || slug;
  redirect(`/campaigns/${target}`);
}
