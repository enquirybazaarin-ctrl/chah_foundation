import { redirect } from "next/navigation";

interface WorkDetailProps {
  params: Promise<{ slug: string }>;
}

const LEGACY_MAP: Record<string, string> = {
  "eyJpdiI6Ii9TVmtJcWhVV2VxdzI3SkU2ZG9jWGc9PSIsInZhbHVlIjoiczFNN1hhT1Y1cUNrSnVTd3hzdnRIdz09IiwibWFjIjoiOTBlODBiY2U5YmQ5OTkzNWNhMzgwOTE1NjY2YWUxZjM4ZWY4N2U3ZjQwYWQ5ZjQ3MThjNzNmODk5ZjU3ZmQyNCIsInRhZyI6IiJ9": "education-support-drive",
  "eyJpdiI6IjdENW40QVY2TGRxKzh3QjBJc0xTcnc9PSIsInZhbHVlIjoibEtFZUtPNTAreUd6ZEpvUE0ybjEyZz09IiwibWFjIjoiNGM0MjgxYzcwY2EzNTFmZjMyNTJjYjlmMmY0Y2RjY2VmNWE5OTk4OWY4OWE3OTk3MGJjMWVmMWM5MGY3ZDNlYyIsInRhZyI6IiJ9": "health-support-drive",
  "eyJpdiI6IktieGIxL2JMd08yaFFLMk10RGtKVVE9PSIsInZhbHVlIjoiNnJGa1ViQkprVXRGT1A3QXUzVzI4QT09IiwibWFjIjoiMmU2NTJlMWZlMTY4NTg0Y2ZiYjQzZDg5MDM5NTljMTVhNzY3YWJmM2M4NTUxOTYyYzQ5ODNmMGE2YzcwNzkyNSIsInRhZyI6IiJ9": "dog-food-donation-drive",
  "eyJpdiI6IjNLQVdNSjBoZ3JWVTRjSkpDaC92S3c9PSIsInZhbHVlIjoieHI4V01ybE1XM0dRU2hhbk80c1ZNQT09IiwibWFjIjoiM2NkYzNmZDA2OGYzMzkzNWQ4ZTUwMWQ4NWNmNzljNWE5M2YzN2E1NmM1MjJhN2NjNWUzYWIwNDJiNjY5ZGNiYyIsInRhZyI6IiJ9": "celebrations",
  "eyJpdiI6ImxsM1VuTkF0MXh2c3JFcXhZbjk1ZFE9PSIsInZhbHVlIjoiK3Y2TGw0TlVScjAvMzAvMlFYbisyZz09IiwibWFjIjoiYTkyMzQ1ZDkzMjc2ZmE0MGM1OTA0ZmI4MzgyODNmOWU5M2UzN2EyMGU0ZTEyNDlkZDk1MTJmOGIxNzY0MTU3MSIsInRhZyI6IiJ9": "blanket-donation-drive",
  "eyJpdiI6IlptQzk1Y05KZURGODhDSGxjc2tCQlE9PSIsInZhbHVlIjoiNVFBQ0hGbTEyNGMyZmtMS0RxdU9FZz09IiwibWFjIjoiYzk5MzIwMDFiMmM1NGJjNjcwODAwNDgwYjAzZWI3NjdiMDYxYjgzYmU4MGZlNThhMzgyMTFiNjM2YjRkY2Q5NyIsInRhZyI6IiJ9": "women-empowerment-drive",
  "eyJpdiI6InRvcGsrYnMrVkxvZXVta3k1eFJkY0E9PSIsInZhbHVlIjoiZHVLck1qWFZUdUEzeXk5ejBYMyszUT09IiwibWFjIjoiMWU0ZjVhM2RlMGFmYjA0ZjgwOTM3ZWQyNjdhZjU1NDZjNmU4NDY2NzI0N2NiODczMzE2OWM3MDc4YmYzN2Y0NiIsInRhZyI6IiJ9": "environment-drive",
  "eyJpdiI6ImdxUG12R25BQ3BidG1DTlZoL2h6MEE9PSIsInZhbHVlIjoiNm8zZzRKcndJeE1HTnMyOXlwdC8zdz09IiwibWFjIjoiYTY5MDAwZGViZWI3YzcwN2NlMmI0YjJiYTAwYTkyNDY5YjQwZjkxMmNhZDJiYjg0NWMwZjAzYjQ4NWRlMzdiNCIsInRhZyI6IiJ9": "help-for-the-blind-drive",
  "eyJpdiI6Imh5dUJ6ZGJQWFhLejQrMnNSbmNWN1E9PSIsInZhbHVlIjoiLzlOaTF1bjQ0NTZKWlQ5Qmt0dGxiQT09IiwibWFjIjoiYTE5NWUxZWQzZGU3ZTJmODI5ZTViOTUyMzE0ODc5MjA2ZDBhMGM5Y2ViYzFjMDUxOGVmNzkwMDk0NWUzMTQ1NSIsInRhZyI6IiJ9": "old-age-support-drive",
  "eyJpdiI6ImJITjZiekp2SVA5WDcyYUhVZ2lZOFE9PSIsInZhbHVlIjoiU1ZRaWcvUW10NHJrQkQ3cTVNbjhyZz09IiwibWFjIjoiN2M0ZWMwMzBlMjFmYTEzNWJhYzg5NGYxODRhOGYyMmEwYTNmZjUwYmQ5NjM1ZThiNjM5NmZkMDYwNGIzYjA4YiIsInRhZyI6IiJ9": "food-distribution-outside-the-hospital",
};

export default async function LegacyWorkDetailPage({ params }: WorkDetailProps) {
  const { slug } = await params;
  const targetSlug = LEGACY_MAP[slug] || slug;

  if (targetSlug && targetSlug !== slug) {
    redirect(`/programs/${targetSlug}`);
  }

  // Fallback to programs index
  redirect(`/programs/${targetSlug || ""}`);
}
