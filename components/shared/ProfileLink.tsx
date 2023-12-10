import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProfileLinkProps {
  imgUrl: string;
  href?: string;
  title: string;
}

const ProfileLink = ({ imgUrl, href, title }: ProfileLinkProps) => {
  return (
    <div className="flex-center gap-1">
      <Image
        className="self-start"
        src={imgUrl}
        alt="icon"
        width={20}
        height={20}
      />
      {href ? (
        <Link
          className="paragraph-medium text-accent-blue"
          href={href}
          target="_blank"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
