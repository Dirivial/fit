import Link from "next/link";

type HomeHeaderType = {
  size: string;
};

const HomeHeader = ({ size }: HomeHeaderType) => {
  return (
    <h1
      className={
        size +
        " leading-normal hover:cursor-pointer font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-green-400 via-violet-800 to-indigo-500"
      }
    >
      <Link href="/" className="">
        Fit.Dirivial
      </Link>
    </h1>
  );
};

export default HomeHeader;
