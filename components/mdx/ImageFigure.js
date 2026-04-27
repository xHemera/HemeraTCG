export default function ImageFigure({ src, alt = '', caption, className = '' }) {
  return (
    <figure className={`my-6 ${className}`.trim()}>
      <img src={src} alt={alt} className="w-full rounded-xl border border-white/10 shadow-lg" />
      {caption ? <figcaption className="mt-2 text-center text-sm text-white/60">{caption}</figcaption> : null}
    </figure>
  );
}
