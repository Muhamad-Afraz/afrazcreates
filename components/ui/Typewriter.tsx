"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  holdTime?: number;
};

export default function Typewriter({
  words,
  className = "",
  typingSpeed = 90,
  deletingSpeed = 40,
  holdTime = 1600,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    let delay: number;
    let nextText = text;
    let nextDeleting = deleting;
    let nextIndex = index;

    if (!deleting) {
      if (text.length < word.length) {
        delay = typingSpeed;
        nextText = word.slice(0, text.length + 1);
      } else {
        delay = holdTime;
        nextDeleting = true;
      }
    } else if (text.length > 0) {
      delay = deletingSpeed;
      nextText = word.slice(0, text.length - 1);
    } else {
      delay = 300;
      nextDeleting = false;
      nextIndex = (index + 1) % words.length;
    }

    const timer = setTimeout(() => {
      setText(nextText);
      setDeleting(nextDeleting);
      setIndex(nextIndex);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, words, typingSpeed, deletingSpeed, holdTime]);

  return (
    <span className={className}>
      {text}
      <span className="caret" aria-hidden="true" />
    </span>
  );
}
