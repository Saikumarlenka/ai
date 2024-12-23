import React from "react";
import {   FaCopy,  } from "react-icons/fa";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { CopyToClipboard } from 'react-copy-to-clipboard';
export const classifyAndFormat = (content) => {
    const lines = content.split('\n');
    const formattedOutput = [];
    let inCodeBlock = false;
    let language = null;
    let codeLines = [];
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
  
      // Handle code block start or end
      if (/^\s*```/.test(line)) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          const match = line.match(/^\s*```(\w+)?/);
          language = match && match[1] ? match[1] : 'text';
        } else {
          inCodeBlock = false;
          formattedOutput.push(
            <div key={formattedOutput.length} className="my-4">
              <div className="bg-gray-800 p-2 rounded-t-lg flex justify-between items-center text-white">
                <span className="text-white text-sm">{language || 'Code'}</span>
                <CopyToClipboard text={codeLines.join('\n')}>
                  <button className="text-white hover:text-gray-200">
                    <FaCopy />
                  </button>
                </CopyToClipboard>
              </div>
              <SyntaxHighlighter
                language={language}
                style={atomDark}
                customStyle={{ borderRadius: '0 0 8px 8px', margin: 0 }}
              >
                {codeLines.join('\n')}
              </SyntaxHighlighter>
            </div>
          );
          codeLines = [];
        }
      } else if (inCodeBlock) {
        codeLines.push(line);
      } else {
        // Handle bold text (**bold**)
        const boldPattern = /\*\*(.+?)\*\*/g;
  
        // Handle inline code (`code`)
        const codePattern = /`([^`]*)`/g;
  
        if (boldPattern.test(line) || codePattern.test(line)) {
          // Replace bold text and code snippets with respective styles
          const highlightedContent = line
            .replace(boldPattern, '<span class="font-extrabold text-white">$1</span>')
            .replace(
              codePattern,
              '<span class="bg-grey-400 text-gray-200 px-1 py-0.5 rounded">$1</span>'
            );
  
          formattedOutput.push(
            <p
              key={formattedOutput.length}
              className="white mt-2"
              dangerouslySetInnerHTML={{ __html: highlightedContent }}
            />
          );
        } else if (/^\*\s.+/.test(line)) {
          // Convert single star at the start to a list item
          formattedOutput.push(
            <ul key={formattedOutput.length} className="text-white list-disc pl-6 mt-2">
              <li>{line.replace(/^\*\s/, '').trim()}</li>
            </ul>
          );
        } else if (/^\*\*\*.+/.test(line)) {
          formattedOutput.push(
            <h3 key={formattedOutput.length} className="text-blue-400 text-lg font-semibold mt-4">
              {line.replace(/^\*\*\*/, '').trim()}
            </h3>
          );
        } else if (/^\*\*.+/.test(line)) {
          formattedOutput.push(
            <h2 key={formattedOutput.length} className="text-blue-400 text-lg font-semibold mt-4">
              {line.replace(/^\*\*/, '').trim()}</h2>
          );
        } else if (line.trim()) {
          formattedOutput.push(
            <p key={formattedOutput.length} className="text-white">
              {line.trim()}
            </p>
          );
        }
      }
    }
  
    // Handle any remaining code lines
    if (inCodeBlock && codeLines.length) {
      formattedOutput.push(
        <div key={formattedOutput.length} className="my-4">
          <div className="bg-gray-800 p-2 rounded-t-lg flex justify-between items-center">
            <span className="text-white text-sm">{language || 'Code'}</span>
            <CopyToClipboard text={codeLines.join('\n')}>
              <button className="text-white hover:text-gray-200">
                <FaCopy />
              </button>
            </CopyToClipboard>
          </div>
          <SyntaxHighlighter
            language={language}
            style={atomDark}
            customStyle={{ borderRadius: '0 0 8px 8px', margin: 0 }}
          >
            {codeLines.join('\n')}
          </SyntaxHighlighter>
        </div>
      );
    }
  
    return formattedOutput;
  };