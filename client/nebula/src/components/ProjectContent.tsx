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
          <span key={index} className={className.trim() || undefined}>
            {item.text}
          </span>
        );
      }
      return null;
    });
  };

  // Group consecutive bulletListItems and numberedListItems together
  const groupedBlocks = useMemo(() => {
    const grouped: BlockProps[][] = [];
    let currentGroup: BlockProps[] = [];
    let currentType: string | null = null;

    blocks.forEach((block: any) => {
      if (
        (block.type === "bulletListItem" ||
          block.type === "numberedListItem") &&
        block.type === currentType
      ) {
        currentGroup.push(block);
      } else if (
        block.type === "bulletListItem" ||
        block.type === "numberedListItem"
      ) {
        if (currentGroup.length > 0) {
          grouped.push(currentGroup);
        }
        currentGroup = [block];
        currentType = block.type;
      } else {
        if (currentGroup.length > 0) {
          grouped.push(currentGroup);
          currentGroup = [];
        }
        grouped.push([block]);
        currentType = null;
      }
    });

    if (currentGroup.length > 0) {
      grouped.push(currentGroup);
    }

    return grouped;
  }, [blocks]);

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
          return <div className="h-4" />;
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

      case "bulletListItem":
      case "numberedListItem":
        return <li className="ml-2">{renderTextContent(block.content)}</li>;

      default:
        return null;
    }
  };

  const renderBlockGroup = (blocks: BlockProps[]) => {
    if (!blocks.length) return null;

    // If it's a list group
    if (blocks[0].type === "bulletListItem") {
      return (
        <ul className="list-disc ml-6 my-3">
          {blocks.map((block, index) => (
            <div key={index}>{renderBlock(block)}</div>
          ))}
        </ul>
      );
    }

    if (blocks[0].type === "numberedListItem") {
      return (
        <ol className="list-decimal ml-6 my-3">
          {blocks.map((block, index) => (
            <div key={index}>{renderBlock(block)}</div>
          ))}
        </ol>
      );
    }

    // For non-list blocks
    return blocks.map((block, index) => (
      <div key={index}>{renderBlock(block)}</div>
    ));
  };

  return (
    <div className="max-w-none">
      {groupedBlocks.map((group, index) => (
        <div key={index}>{renderBlockGroup(group)}</div>
      ))}
    </div>
  );
};

export default ProjectContent;
