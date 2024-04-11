"use client";
import { useAction, useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { LuSendHorizonal } from "react-icons/lu";
import { PiComputerTowerBold } from "react-icons/pi";
import { api } from "../../convex/_generated/api";
import ReactMarkdown from "react-markdown";
export default function Home() {
  const [pending, setPending] = useState(false);
  const [content, setContent] = useState("");
  const messages = useQuery(api.messages.get);
  const generate = useAction(api.gemini.generate);
  function reply() {
    setPending(true);
    generate({ prompt: content }).then(() => {
      setPending(false);
    });
  }
  return (
    <main className="flex min-h-screen flex-col items-center p-20 container mx-auto">
      <h1 className="text-3xl font-bold">Startup Copilot</h1>
      <form className="flex my-8">
        <input
          onChange={(e) => {
            setContent(e.target.value);
          }}
          className="p-2 border rounded-md"
          type="text"
          placeholder="Enter your 💸 idea here..."
        />
        <button
          className={`transition-all p-2 ml-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 flex ${
            pending && "opacity-50"
          }`}
          type="submit"
          disabled={pending}
          onClick={reply}
        >
          {pending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 my-auto border-gray-400 mr-2" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <LuSendHorizonal className="mr-2 my-auto" />
              <span>Send</span>
            </>
          )}
        </button>
      </form>
      <div className="flex flex-col w-full">
        {messages?.map((msg) => (
          <div
            className="flex odd:bg-inherit even:bg-gray-100 py-4 px-2 even:border-y border-gray-400"
            key={msg._id}
          >
            <span className="mr-2 text-white">
              {msg.role === "model" ? (
                <div className="bg-pink-500 p-2 rounded-md">
                  <PiComputerTowerBold />
                </div>
              ) : (
                <div className="bg-sky-500 p-2 rounded-md">
                  <FaUser />
                </div>
              )}
            </span>
            <ReactMarkdown
              components={{
                ul: ({ children }) => (
                  <ul className="list-disc mb-4">{children}</ul>
                ),
                li: ({ children }) => <li className="ml-8">{children}</li>,
              }}
              className="flex flex-col"
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </main>
  );
}
