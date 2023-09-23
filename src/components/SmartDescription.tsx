import React, { FC } from "react";

interface Props {
  text: string;
}

const TextWithLinksAndBreaks: FC<Props> = ({ text }) => {
  const processedText = text
    .replace(/\\n/g, "\n")
    .replace(
      /https?:\/\/[^\s]+/g,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline">${url}</a>`
    );

  return (
    <div
      style={{ whiteSpace: "pre-line" }}
      dangerouslySetInnerHTML={{ __html: processedText }}
    />
  );
};

export default TextWithLinksAndBreaks;
