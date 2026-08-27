import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "./Header";
import Footer from "./Footer";

export default function LegalLayout({ markdown }: { markdown: string }) {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="bg-bg py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/"
            className="inline-block mb-8 text-sm font-semibold hover:underline"
            style={{ color: "#1857B8" }}
          >
            → חזרה לדף הבית
          </Link>
          <article className="legal-doc">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // GFM tables only ever produce column headers — mark them so
                // screen readers announce the header for each data cell.
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                th: ({ node, ...props }) => <th scope="col" {...props} />,
              }}
            >
              {markdown}
            </ReactMarkdown>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
