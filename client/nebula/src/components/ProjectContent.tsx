/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";

interface BlockProps {
  type: string;
  props: {
    textColor?: string;
    backgroundColor?: string;
    textAlignment?: string;
    level?: number;
    url?: string;
    caption?: string;
    listType?: "numbered" | "bulleted";
  };
  content: any[];
  children: any[];
}

const ProjectContent = ({ content }: { content: string }) => {
  const blocks = useMemo(() => {
    try {
      return JSON.parse(content).flat();
    } catch (error) {
      console.error("Error parsing content:", error);
      return [];
    }
  }, [content]);

  const renderTextContent = (content: any[]) => {
    return content.map((item, index) => {
      if (item.type === "text") {
        let className = "";
        if (item.styles) {
          if (item.styles.bold) className += "font-bold ";
          if (item.styles.italic) className += "italic ";
          if (item.styles.underline) className += "underline ";
          if (item.styles.strikethrough) className += "line-through ";
          if (item.styles.code)
            className += "font-mono bg-gray-100 rounded px-1 ";
        }
        return (
          <span key={index} className={className || undefined}>
            {item.text}
          </span>
        );
      }
      return null;
    });
  };

  const renderBlock = (block: BlockProps) => {
    const alignment = block.props.textAlignment || "left";
    const alignmentClass = `text-${alignment}`;

    switch (block.type) {
      case "heading": {
        const level = block.props.level || 1;
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
        const sizeClass =
          level === 1 ? "text-4xl" : level === 2 ? "text-3xl" : "text-2xl";

        return (
          <HeadingTag
            className={`font-bold ${sizeClass} my-4 ${alignmentClass}`}
          >
            {renderTextContent(block.content)}
          </HeadingTag>
        );
      }

      case "paragraph":
        if (block.content.length === 0) {
          return <div className="h-4" />; // Empty paragraph as spacing
        }
        return (
          <p className={`my-3 ${alignmentClass}`}>
            {renderTextContent(block.content)}
          </p>
        );

      case "image":
        return (
          <figure className="my-6">
            <img
              src={block.props.url}
              alt={block.props.caption || ""}
              className="w-auto rounded-lg object-cover"
            />
            {block.props.caption && (
              <figcaption className="mt-2 text-center text-sm text-gray-600">
                {block.props.caption}
              </figcaption>
            )}
          </figure>
        );

      case "list": {
        const ListTag = block.props.listType === "numbered" ? "ol" : "ul";
        return (
          <ListTag
            className={`my-3 ${block.props.listType === "numbered" ? "list-decimal" : "list-disc"} ml-6`}
          >
            {block.content.map((item, index) => (
              <li key={index}>{renderTextContent(item.content)}</li>
            ))}
          </ListTag>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="max-w-none">
      {blocks.map((block: BlockProps, index: number) => (
        <div key={index}>{renderBlock(block)}</div>
      ))}
    </div>
  );
};

export default ProjectContent;
