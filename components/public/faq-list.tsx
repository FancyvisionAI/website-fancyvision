"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

type Faq = { id: string; question: string; answer: string };

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <Accordion.Root type="single" collapsible className="border-t border-[#dfe7f4]">
      {items.map((item, index) => (
        <Accordion.Item key={item.id} value={item.id} className="border-b border-[#dfe7f4]">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center gap-5 py-6 text-left md:py-8">
              <span className="text-xs tabular-nums text-black/40">0{index + 1}</span>
              <span className="flex-1 text-lg font-semibold tracking-[-0.025em] md:text-2xl">
                {item.question}
              </span>
              <span className="grid size-10 place-items-center">
                <Plus className="size-4 transition group-data-[state=open]:rotate-45" />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-none data-[state=open]:animate-none">
            <p className="max-w-3xl pb-8 pl-10 pr-12 text-base leading-7 text-black/60 md:text-lg">
              {item.answer}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
