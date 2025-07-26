import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, Database, Cpu, Monitor } from 'lucide-react';

interface WorkflowNodeProps {
  data: {
    label: string;
    type: string;
    config?: Record<string, any>;
  };
  selected: boolean;
}

export const WorkflowNode: React.FC<WorkflowNodeProps> = ({ data, selected }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'userQuery': return MessageSquare;
      case 'knowledgeBase': return Database;
      case 'llmEngine': return Cpu;
      case 'output': return Monitor;
      default: return MessageSquare;
    }
  };

  const getGradient = () => {
    switch (data.type) {
      case 'userQuery': return 'from-green-400 to-green-600';
      case 'knowledgeBase': return 'from-blue-400 to-blue-600';
      case 'llmEngine': return 'from-purple-400 to-purple-600';
      case 'output': return 'from-orange-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const Icon = getIcon();
  const gradient = getGradient();

  return (
    <div className={`
      relative bg-gray-800 border-2 rounded-lg p-4 min-w-[200px] shadow-lg transition-all duration-200
      ${selected ? 'border-blue-500 shadow-blue-500/20' : 'border-gray-600 hover:border-gray-500'}
    `}>
      {/* Input Handle */}
      {data.type !== 'userQuery' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        />
      )}

      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-medium">{data.label}</h3>
          <p className="text-xs text-gray-400">
            {data.type === 'userQuery' && 'Input Component'}
            {data.type === 'knowledgeBase' && 'Vector Storage'}
            {data.type === 'llmEngine' && 'AI Processing'}
            {data.type === 'output' && 'Response Display'}
          </p>
        </div>
      </div>

      {/* Configuration Indicator */}
      {data.config && Object.keys(data.config).length > 0 && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      )}

      {/* Output Handle */}
      {data.type !== 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
        />
      )}
    </div>
  );
};