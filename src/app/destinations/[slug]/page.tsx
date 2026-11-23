import { redirect } from "next/navigation";

export default async function DestinationSlugRedirect(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  redirect(`/packages/${slug}`);
}
