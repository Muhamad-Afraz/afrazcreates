import Reveal from "./Reveal";

type SectionHeadingProps = {
  index: string;
  label: string;
  title: string;
  highlight: string;
};

export default function SectionHeading({
  index,
  label,
  title,
  highlight,
}: SectionHeadingProps) {
  return (
    <Reveal className="mb-8 sm:mb-10">
      <p className="mb-2 font-mono text-sm uppercase tracking-[0.3em] text-primary">
        <span className="text-secondary">{index}.</span> {label}
      </p>
      <h2 className="text-3xl font-extrabold sm:text-4xl">
        {title} <span className="gradient-text">{highlight}</span>
      </h2>
    </Reveal>
  );
}
