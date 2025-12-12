import React from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
};

const NextImage = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, fill, style, ...rest }, ref) => {
    const composedStyle = fill
      ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...(style || {}) }
      : style;
    return <img ref={ref} src={typeof src === "string" ? src : ""} alt={alt || ""} style={composedStyle} {...rest} />;
  }
);

NextImage.displayName = "NextImageMock";

export default NextImage;
