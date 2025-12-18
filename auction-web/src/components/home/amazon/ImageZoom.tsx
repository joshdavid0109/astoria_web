const ImageZoom = ({ src }: { src?: string }) => {
  if (!src) return null;

  return (
    <div className="group relative overflow-hidden border bg-white">
      <img
        src={src}
        alt=""
        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );
};

export default ImageZoom;
