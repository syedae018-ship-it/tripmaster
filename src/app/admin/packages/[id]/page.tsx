import { redirect } from "next/navigation";

export default async function AdminPackageIdPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  redirect(`/admin/packages/${id}/edit`);
}
