import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LeftSidebar = () => {
  return (
    <section className="left_sidebar">
      <nav className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center"
        >
          <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden">
            NoteCast
          </h1>
        </Link>

        {sidebarLinks.map((item) => {
          return (
            <Link key={item.route} href={item.route}>
              <p className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={23}
                  height={27}
                />
                <h1 className="text-24 font-extrabold text-white max-lg:hidden">
                  {item.label}
                </h1>
              </p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default LeftSidebar;
