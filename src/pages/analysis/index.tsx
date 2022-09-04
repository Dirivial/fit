import type { NextPage } from "next";
import Link from "next/link";

const AnalyzePage: NextPage = () => {
  return (
    <>
      <Link href="/">Home</Link>
      <div className="bg-orange-200">Gonna analyze your workouts, are you?</div>
    </>
  );
};

export default AnalyzePage;
