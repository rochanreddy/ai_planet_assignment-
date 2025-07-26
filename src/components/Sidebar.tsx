import React from 'react';
import { MessageSquare, Database, Cpu, Monitor } from 'lucide-react';

const components = [
  {
    type: 'userQuery',
    label: 'User Query',
    icon: MessageSquare,
    description: 'Accepts user input and forwards to next component',
    color: 'from-green-400 to-green-600'
  },
  {
    type: 'knowledgeBase',
    label: 'Knowledge Base',
    icon: Database,
    description: 'Upload PDFs, extract text, and store embeddings',
    color: 'from-blue-400 to-blue-600'
  },
  {
    type: 'llmEngine',
    label: 'LLM Engine',
    icon: Cpu,
    description: 'Process queries with GPT/Gemini and web search',
    color: 'from-purple-400 to-purple-600'
  },
  {
    type: 'output',
    label: 'Output',
    icon: Monitor,
    description: 'Display responses in a chat-style interface',
    color: 'from-orange-400 to-orange-600'
  }
];

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  return (
    <div className="w-80 bg-gray-900 border-r border-gray-700 p-6 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Components</h2>
        <p className="text-gray-400 text-sm">Drag components to the canvas to build your workflow</p>
      </div>
      
      <div className="space-y-4">
        {components.map((component) => {
          const Icon = component.icon;
          return (
            <div
              key={component.type}
              draggable
              onDragStart={(event) => onDragStart(event, component.type)}
              className="bg-gray-800 rounded-lg p-4 cursor-move border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:scale-105 group"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${component.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{component.label}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{component.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-white font-medium mb-2">Quick Start</h3>
        <ol className="text-xs text-gray-400 space-y-1">
          <li>1. Drag components to canvas</li>
          <li>2. Connect them by dragging from handles</li>
          <li>3. Configure each component</li>
          <li>4. Click "Build Stack" to validate</li>
          <li>5. Start chatting with your workflow!</li>
        </ol>
      </div>
    </div>
  );
};