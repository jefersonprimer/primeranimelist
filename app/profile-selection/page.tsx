import ProfileSelectionClient from "./ProfileSelectionClient";

export async function generateMetadata(props: { params: { locale: string } }) {
  const params = await props.params;
  await params;
  return {
    title: "Who's watching? - Crunchyroll",
    description: "Choose a profile to continue",
  };
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ProfileSelectionPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex justify-center items-center flex-1 flex-col py-10 w-full max-w-[1200px] mx-auto px-4 relative z-10">
        <ProfileSelectionClient locale={locale} />
      </div>
    </div>
  );
}
