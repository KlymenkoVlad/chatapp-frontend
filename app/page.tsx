import Image from "next/image";
import Link from "next/link";
import {
  MdAccessTime,
  MdArrowForward,
  MdOutlineStarPurple500,
  MdSend,
  MdSignalWifi3BarLock,
  MdStar,
  MdStarBorder,
} from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

{
  /* <div>
<h3 className="text-xl font-bold">4.8/5</h3>
<div>
  <div className="flex items-center text-xl text-yellow-500">
    <MdStar />
    <MdStar />
    <MdStar />
    <MdStar />
    <MdStar className="text-gray-300" />
    <span className="ml-2 text-black">Rating</span>
  </div>
</div>
</div> */
}

export default function Home() {
  return (
    <div className="px-4 py-3 ms:px-12">
      <header className="flex items-center justify-between">
        <Link
          href="/chat"
          className="text-3xl font-bold text-blue-600 transition-colors hover:text-blue-700"
        >
          Newchat
        </Link>
        <nav className="hidden justify-around space-x-6 font-semibold sm:flex md:space-x-16">
          <Link
            className="transition-colors hover:text-blue-700"
            href={"/about"}
          >
            About
          </Link>
          <Link
            className="transition-colors hover:text-blue-700"
            href={"contact"}
          >
            Contact
          </Link>
          <Link className="transition-colors hover:text-blue-700" href={"blog"}>
            Blog
          </Link>
        </nav>
        <Link
          className="hidden rounded-md bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700 sm:block"
          href={"/chat"}
        >
          Get started for free
        </Link>

        <button
          className="block text-2xl transition-colors hover:text-gray-800 sm:hidden"
          type="button"
        >
          <RxHamburgerMenu />
        </button>
      </header>
      <main className="mt-12">
        <div className="flex flex-col items-center justify-around space-x-2 md:flex-row">
          <div className="min-w-[300px] md:max-w-[550px]">
            <div className="space-y-6">
              <p className="text-pretty text-4xl font-semibold lg:text-5xl">
                Start chatting with anyone, anytime, anywhere with Newchat
              </p>
              <p className="max-w-[500px]">
                Great software that allows you to chat from any place at any
                time without any interruption.
              </p>
              <Link
                className="flex w-64 items-center justify-center rounded-md bg-blue-600 p-3 text-center text-white transition-colors hover:bg-blue-700"
                href={"/chat"}
              >
                Get started for free <MdArrowForward className="ml-1" />
              </Link>
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  <Image
                    src={"/avatar1.png"}
                    width={48}
                    height={48}
                    className="z-20 h-14 w-14 rounded-full border-4 border-white"
                    alt="Avatar of user"
                  />
                  <Image
                    src={"/avatar2.png"}
                    width={48}
                    height={48}
                    className="z-10 h-14 w-14 rounded-full border-4 border-white"
                    alt="Avatar of user"
                  />
                  <Image
                    src={"/avatar3.png"}
                    width={48}
                    height={48}
                    className="h-14 w-14 rounded-full border-4 border-white"
                    alt="Avatar of user"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">2,291</h3>
                  <h4 className="font-light">Happy Customers</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-20 flex items-center justify-center md:mt-0">
            <Image
              alt="Woman reading text message"
              className="absolute z-10 w-[450px]"
              src="/smiling-woman-using-mobile-phone-shopping-online-reading-text-message.png"
              width={667}
              height={747}
            />
            <div className="h-[280px] w-[280px] rounded-full bg-blue-600 ms:h-[346px] ms:w-[346px] lg:h-[446px] lg:w-[446px]">
              <div className="absolute bottom-7 left-7 h-[280px] w-[280px] rounded-full border-4 border-black ms:h-[346px] ms:w-[346px] lg:h-[446px] lg:w-[446px]"></div>
            </div>
            <div className="absolute bottom-5 right-2 z-20 flex w-60 items-center space-x-3 rounded-md bg-white p-2 opacity-90 backdrop-blur-sm">
              <Image
                src="/jenny-wilson.png"
                alt=""
                width={48}
                height={48}
                quality={100}
                className="h-10 w-10 blur-sm"
              />
              <div className="space-y-1">
                <h4 className="font-semibold">Jenny Wilson</h4>
                <p className="text-xs">
                  One of the best chatting app I have ever used.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h1 className="mt-24 text-center text-4xl font-bold">
            Features for a better experience
          </h1>

          <div className="mt-24 flex w-full flex-wrap justify-around gap-y-6">
            <div className="flex w-full justify-center space-x-4 sm:w-auto">
              <div className="flex h-16 min-w-16 items-center justify-center rounded-full bg-blue-200">
                <MdSend className="h-7 w-7 text-blue-600" />
              </div>
              <div className="w-80 space-y-3">
                <h4 className="text-lg font-semibold">Fast messaging</h4>
                <p>
                  Instant delivery with low latency for smooth, real-time
                  conversations.
                </p>
              </div>
            </div>
            <div className="flex w-full justify-center space-x-4 sm:w-auto">
              <div className="flex h-16 min-w-16 items-center justify-center rounded-full bg-blue-200">
                <MdSignalWifi3BarLock className="h-7 w-7 text-blue-600 sm:h-7 sm:w-7" />
              </div>
              <div className="w-80 space-y-3">
                <h4 className="text-lg font-semibold">Keep safe & private</h4>
                <p>Your conversations stay secure and confidential.</p>
              </div>
            </div>
            <div className="flex w-full justify-center space-x-4 sm:w-auto">
              <div className="flex h-16 min-w-16 items-center justify-center rounded-full bg-blue-200">
                <MdAccessTime className="h-7 w-7 text-blue-600" />
              </div>
              <div className="w-80 space-y-3">
                <h4 className="text-lg font-semibold">Save your time</h4>
                <p>
                  This software is very easy for you to manage. You can use it
                  as you wish.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mx-4 mt-24 flex overflow-hidden bg-blue-500 px-8 py-24 ms:-mx-12 md:px-16">
          <div className="absolute -left-96 -top-96 z-0 h-[500px] w-[500px] rounded-full border-4 opacity-50"></div>
          <div className="absolute -left-96 -top-96 z-0 h-[550px] w-[550px] rounded-full border-4 opacity-50"></div>
          <div className="absolute -left-96 -top-96 z-0 h-[630px] w-[630px] rounded-full border-4 opacity-50"></div>
          <div className="absolute -left-96 -top-96 z-0 h-[700px] w-[700px] rounded-full border-4 opacity-50"></div>

          <div className="z-10">
            <h2 className="text-center text-3xl font-semibold text-white">
              Our blessed client said about us 😍
            </h2>

            <div className="mt-16 flex flex-wrap justify-around space-y-16 sm:flex-nowrap sm:space-x-6 sm:space-y-0 md:space-x-16">
              <div className="sm:w-1/2">
                <div className="space-y-3 rounded-md bg-white px-6 py-5 text-center lg:px-12">
                  <h5 className="text-lg font-semibold text-blue-700">
                    “Incredible Experience”
                  </h5>
                  <p className="text-gray-600">
                    We had an incredible experience working with Newchat and
                    were impressed they made such a big difference in only three
                    weeks. Our grandparents is so grateful for the wonderful
                    improvements they made and their ability to get familiar
                    with the concept so quickly.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-center space-x-4 text-white">
                  <Image
                    src="/review-avatar1.png"
                    alt="Reviewer's avatar"
                    className="rounded-full"
                    width={48}
                    height={48}
                  />
                  <div>
                    <h6 className="text-lg font-semibold">Ethan Caldwell</h6>
                    <p className="text-sm font-light">CEO, ABC Corporation</p>
                  </div>
                </div>
              </div>
              <div className="sm:w-1/2">
                <div className="space-y-3 rounded-md bg-white px-6 py-5 text-center lg:px-12">
                  <h5 className="text-lg font-semibold text-blue-700">
                    “Dependable, Responsive, Professional”
                  </h5>
                  <p className="text-gray-600">
                    Newmarket is looking magnificent! Every time I use this app
                    I feel how much works were put in this project. I'm very
                    glad, that i can use it and I always try to share it with
                    another people. I look forward to the next big updates.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-center space-x-4 text-white">
                  <Image
                    src="/review-avatar2.png"
                    alt="Reviewer's avatar"
                    width={48}
                    className="rounded-full"
                    height={48}
                  />
                  <div>
                    <h6 className="text-lg font-semibold">Sophie Harrington</h6>
                    <p className="text-sm font-light">
                      Business Strategy and Consulting
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="my-24 flex flex-col items-center justify-center space-y-16">
          <h2 className="max-w-[800px] text-center text-3xl font-bold">
            Ready to improve your chatting experience? Start with Newchat,
            become faster every second
          </h2>

          <Link
            className="mx-auto flex w-64 items-center justify-center rounded-md bg-blue-600 p-3 text-center text-white transition-colors hover:bg-blue-700"
            href={"/chat"}
          >
            Start chatting now
          </Link>
        </section>
      </main>

      <footer className="">
        <div className="-mx-4 h-px bg-gray-200 ms:-mx-12"></div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-16 gap-y-6 text-gray-400 lg:flex-row">
          <h6>© Copyright 2024, All Rights Reserved</h6>
          <h6>Newmarket</h6>
          <h6>Privacy Policy Terms & Conditions</h6>
        </div>
      </footer>
    </div>
  );
}
