import Image from "next/image";

type LockAnimationProps = {
  size?: number;
  className?: string;
};

const LockAnimation = (props: LockAnimationProps) => {
  const { size = 80, className } = props;

  return (
    <Image
      id="step-0"
      width={size}
      height={size}
      src={"/LinkLockerLogo.png"}
      alt="logo"
      style={{ height: size, width: size }}
      className="animate-spin-slow cursor-pointer transition-all spin hover:animate-spin hover:scale-105 active:scale-100"
    />
  );
};

export default LockAnimation;
