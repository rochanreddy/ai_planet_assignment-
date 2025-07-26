import React, { useRef } from 'react';
import { X, Upload, Settings, Database, Cpu } from 'lucide-react';
import { ComponentData } from '../types/workflow';

interface ConfigPanelProps {
  selectedNode: ComponentData | null;
  onClose: () => void;
  onConfigChange: (config: Record<string, any>) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  selectedNode,
  onClose,
  onConfigChange
}) => {
  if (!selectedNode) return null;

  const handleInputChange = (key: string, value: any) => {
    onConfigChange({ ...selectedNode.config, [key]: value });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    // TODO: Implement file upload logic here
    // Example: onConfigChange({ ...selectedNode.config, files: Array.from(files) });
  };

  const renderConfig = () => {
    switch (selectedNode.type) {
      case 'userQuery':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Placeholder Text
              </label>
              <input
                type="text"
                value={selectedNode.config.placeholder || 'Enter your question...'}
                onChange={(e) => handleInputChange('placeholder', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Length
              </label>
              <input
                type="number"
                value={selectedNode.config.maxLength || 500}
                onChange={(e) => handleInputChange('maxLength', parseInt(e.target.value))}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'knowledgeBase':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload PDFs
              </label>
              <div
                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Drop PDF files here or click to browse</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Embedding Model
              </label>
              <select
                value={selectedNode.config.embeddingModel || 'openai'}
                onChange={(e) => handleInputChange('embeddingModel', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="openai">OpenAI text-embedding-ada-002</option>
                <option value="gemini">Google Gemini Embeddings</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Similarity Threshold
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedNode.config.threshold || 0.7}
                onChange={(e) => handleInputChange('threshold', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{selectedNode.config.threshold || 0.7}</span>
            </div>
          </div>
        );

      case 'llmEngine':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                LLM Provider
              </label>
              <select
                value={selectedNode.config.provider || 'openai'}
                onChange={(e) => handleInputChange('provider', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="openai">OpenAI GPT-4</option>
                <option value="gemini">Google Gemini Pro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Temperature
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={selectedNode.config.temperature || 0.7}
                onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{selectedNode.config.temperature || 0.7}</span>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedNode.config.useWebSearch || false}
                  onChange={(e) => handleInputChange('useWebSearch', e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700"
                />
                <span className="text-sm text-gray-300">Enable Web Search</span>
              </label>
            </div>
            {selectedNode.config.useWebSearch && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search Provider
                </label>
                <select
                  value={selectedNode.config.searchProvider || 'serpapi'}
                  onChange={(e) => handleInputChange('searchProvider', e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="serpapi">SerpAPI</option>
                  <option value="brave">Brave Search</option>
                </select>
              </div>
            )}
          </div>
        );

      case 'output':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Style
              </label>
              <select
                value={selectedNode.config.style || 'chat'}
                onChange={(e) => handleInputChange('style', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="chat">Chat Style</option>
                <option value="document">Document Style</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedNode.config.showTimestamp || true}
                  onChange={(e) => handleInputChange('showTimestamp', e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700"
                />
                <span className="text-sm text-gray-300">Show Timestamp</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedNode.config.allowFollowUp || true}
                  onChange={(e) => handleInputChange('allowFollowUp', e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700"
                />
                <span className="text-sm text-gray-300">Allow Follow-up Questions</span>
              </label>
            </div>
          </div>
        );

      default:
        return <div className="text-gray-400">No configuration available</div>;
    }
  };

  const getIcon = () => {
    switch (selectedNode.type) {
      case 'knowledgeBase': return Database;
      case 'llmEngine': return Cpu;
      default: return Settings;
    }
  };

  const Icon = getIcon();

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">{selectedNode.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Configuration</h4>
          {renderConfig()}
        </div>

        <div className="pt-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Node ID</h4>
          <code className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
            {selectedNode.id}
          </code>
        </div>
      </div>
    </div>
  );
};