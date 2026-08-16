import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";
import SectionHeading from "./ui/SectionHeading";
import { ArrowUpRightIcon, InstagramIcon, MailIcon } from "./icons";
import { site } from "@/data/site";

export default function Contact() {
  const channels = [
    {
      href: `mailto:${site.socials.email}`,
      title: "Email",
      value: site.socials.email,
      Icon: MailIcon,
      hover: "hover:border-primary/50",
      glow: "group-hover:shadow-[0_0_40px_rgba(163,230,53,0.25)]",
    },
    {
      href: site.socials.instagram,
      title: "Instagram",
      value: `@${site.socials.instagram.split("/").filter(Boolean).pop()}`,
      Icon: InstagramIcon,
      hover: "hover:border-secondary/50",
      glow: "group-hover:shadow-[0_0_40px_rgba(132,204,22,0.25)]",
    },
  ];

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <SectionHeading index="05" label="Say hello" title="Get in" highlight="Touch" />

      <Reveal>
        <p className="mx-auto max-w-2xl text-center text-lg text-slate-400">
          Have a project in mind, a question, or just want to say hi? My inbox is always
          open — I usually reply within a day.
        </p>
      </Reveal>

      <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
        {channels.map((channel, i) => (
          <Reveal key={channel.title} delay={i * 0.12}>
            <a
              href={channel.href}
              target={channel.href.startsWith("mailto") ? undefined : "_blank"}
              rel={channel.href.startsWith("mailto") ? undefined : "noreferrer"}
              className="block h-full"
            >
              <TiltCard
                className={`card flex h-full flex-col items-center rounded-2xl p-7 text-center ${channel.hover} ${channel.glow}`}
              >
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary transition-transform duration-300 group-hover:scale-110">
                  <channel.Icon className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-semibold text-white">{channel.title}</h3>
                <p className="mt-2 break-all font-mono text-sm text-slate-400">
                  {channel.value}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                  Let&apos;s talk
                  <ArrowUpRightIcon className="h-4 w-4" />
                </span>
              </TiltCard>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
