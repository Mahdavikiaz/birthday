import BirthdayExperience from '@/components/birthday/BirthdayExperience';

// The page stays a Server Component; only the journey itself needs state.
export default function Page() {
  return (
    <main className="relative w-full">
      <BirthdayExperience />
    </main>
  );
}
