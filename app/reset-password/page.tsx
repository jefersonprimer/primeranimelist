import ResetPasswordForm from "./ResetPasswordForm";

export async function generateMetadata() {
  return {
    title: "Reset password",
    description: "Set a new password with your verification code.",
  };
}

export default async function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <ResetPasswordForm />
    </div>
  );
}
