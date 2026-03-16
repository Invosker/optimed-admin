import React, { useState } from "react";

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Accordion = ({ title, children, className }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ul className={`col-span-full w-full mx-auto divide-y ${className}`}>
      <li>
        <details className="group">
          <summary
            className="grid grid-cols-12 items-center content-center gap-3 px-2 py-3 font-medium marker:content-none hover:cursor-pointer"
            onClick={toggleAccordion}
          >
            <span className="col-span-11 flex items-center">{title}</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-90" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </summary>
          <article className="px-4 pb-4">{children}</article>
        </details>
      </li>
    </ul>
  );
};

export default Accordion;
