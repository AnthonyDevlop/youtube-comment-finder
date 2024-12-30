import type { MDXComponents } from "mdx/types";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h2: ({ children }) => (
      <h2 className="mt-12 text-2xl font-bold tracking-tight text-gray-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 text-xl font-bold tracking-tight text-gray-900">
        {children}
      </h3>
    ),
    p: ({ children }) => <p className="mb-4 mt-2">{children}</p>,
    ul: ({ children }) => (
      <ul className="mt-8 space-y-8 text-gray-600">{children}</ul>
    ),
    li: ({ children }) => <li className="">{children}</li>,
    ...components,
  };
}
