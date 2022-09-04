import type { NextPage } from "next";
import Link from "next/link";

const WorkoutPage: NextPage = () => {
  return (
    <>
      <Link href="/">Home</Link>
      <div>Gonna work out, are you?</div>
    </>
  );
};

export default WorkoutPage;
