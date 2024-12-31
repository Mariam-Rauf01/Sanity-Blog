import config from "@/sanity/config/client-config";
import { Blog } from "@/types/blog";
import { PortableText, PortableTextComponentProps, PortableTextBlock } from "@portabletext/react";
import { getImageDimensions } from "@sanity/asset-utils";
import urlBuilder from "@sanity/image-url";
import Image from "next/image";

// Define type for image component props
interface ImageComponentProps {
  value: {
    _key: string;
    alt?: string;
    asset: { _ref: string }; // Assuming asset contains _ref for the image
    width?: number;
    height?: number;
  };
  isInline: boolean;
}

// Lazy-loaded image component with a unique key
const ImageComponent = ({ value, isInline }: ImageComponentProps) => {
  const { width, height } = getImageDimensions(value);
  return (
    <div className="my-10 overflow-hidden rounded-[15px]" key={value._key}>  {/* Ensure unique key */}
      <Image
        src={urlBuilder(config)
          .image(value)
          .fit("max")
          .auto("format")
          .url() as string}
        width={width}
        height={height}
        alt={value.alt || "blog image"}
        loading="lazy"
        style={{
          display: isInline ? "inline-block" : "block",
          aspectRatio: width / height,
        }}
      />
    </div>
  );
};

// Fixing block components type compatibility
const components = {
    types: {
      image: ImageComponent,
    },
    block: {
      normal: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
        <p key={children?.toString()}>{children || 'Default content'}</p>
      ),
      heading1: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
        <h1 key={children?.toString()}>{children || 'Heading 1'}</h1>
      ),
      heading2: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
        <h2 key={children?.toString()}>{children || 'Heading 2'}</h2>
      ),
      heading3: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
        <h3 key={children?.toString()}>{children || 'Heading 3'}</h3>
      ),
    },
  };
  
// Define type for post prop in RenderBodyContent
interface RenderBodyContentProps {
  post: Blog;
}

const RenderBodyContent = ({ post }: RenderBodyContentProps) => {
  return (
    <div className="blog-content">
      {/* Render PortableText with components, ensuring each block is keyed */}
      <PortableText value={post?.body as PortableTextBlock[]} components={components} />
    </div>
  );
};

export default RenderBodyContent;
