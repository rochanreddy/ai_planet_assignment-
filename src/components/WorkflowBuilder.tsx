import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WorkflowNode } from './WorkflowNode';
import { Sidebar } from './Sidebar';
import { ConfigPanel } from './ConfigPanel';
import { ChatInterface } from './ChatInterface';
import { Play, Settings, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { ComponentData, ChatMessage } from '../types/workflow';
import toast, { Toaster } from 'react-hot-toast';

const nodeTypes = {
  workflowNode: WorkflowNode,
};

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

export const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<ComponentData | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflowValid, setWorkflowValid] = useState(false);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const labels = {
        userQuery: 'User Query',
        knowledgeBase: 'Knowledge Base',
        llmEngine: 'LLM Engine',
        output: 'Output'
      };

      const newNode: Node = {
        id: getId(),
        type: 'workflowNode',
        position,
        data: {
          id: getId(),
          type,
          label: labels[type as keyof typeof labels],
          config: {}
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node.data as ComponentData);
    },
    []
  );

  const onConfigChange = useCallback(
    (config: Record<string, any>) => {
      if (!selectedNode) return;

      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, config } }
            : node
        )
      );

      setSelectedNode((prev) => prev ? { ...prev, config } : null);
    },
    [selectedNode, setNodes]
  );

  const validateWorkflow = useCallback(() => {
    // Check for required components
    const hasUserQuery = nodes.some(n => n.data.type === 'userQuery');
    const hasOutput = nodes.some(n => n.data.type === 'output');
    
    if (!hasUserQuery || !hasOutput) {
      toast.error('Workflow must have at least User Query and Output components');
      setWorkflowValid(false);
      return false;
    }

    // Check for proper connections
    const userQueryNode = nodes.find(n => n.data.type === 'userQuery');
    const outputNode = nodes.find(n => n.data.type === 'output');
    
    if (!userQueryNode || !outputNode) {
      setWorkflowValid(false);
      return false;
    }

    // Simple validation - should have a path from user query to output
    const hasValidPath = edges.length > 0;
    
    if (!hasValidPath) {
      toast.error('Components must be connected to form a valid workflow');
      setWorkflowValid(false);
      return false;
    }

    toast.success('Workflow validated successfully!');
    setWorkflowValid(true);
    return true;
  }, [nodes, edges]);

  const callBackendAPI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_query: userMessage
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('API call failed:', error);
      throw new Error(`Failed to get response from backend: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!workflowValid) {
      toast.error('Please validate your workflow first!');
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const response = await callBackendAPI(message);
      
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        type: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response from backend'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen flex bg-gray-950">
        <Toaster position="top-right" />
        
        <Sidebar onDragStart={onDragStart} />
        
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Workflow Builder</h1>
              <p className="text-sm text-gray-400">Build and configure your AI workflow</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                workflowValid 
                  ? 'bg-green-900 text-green-300 border border-green-700'
                  : 'bg-yellow-900 text-yellow-300 border border-yellow-700'
              }`}>
                {workflowValid ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                <span>{workflowValid ? 'Valid' : 'Not Validated'}</span>
              </div>
              
              <button
                onClick={validateWorkflow}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Build Stack</span>
              </button>
              
              <button
                onClick={() => setShowChat(true)}
                disabled={!workflowValid}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Stack</span>
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              className="bg-gray-950"
              fitView
            >
              <Controls className="bg-gray-800 border-gray-600 [&>button]:bg-gray-700 [&>button]:border-gray-600 [&>button]:text-gray-300 [&>button:hover]:bg-gray-600" />
              <Background color="#374151" gap={20} size={1} />
            </ReactFlow>

            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-500">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Start Building Your Workflow</h3>
                  <p className="text-sm">Drag components from the sidebar to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedNode && (
          <ConfigPanel
            selectedNode={selectedNode}
            onClose={() => setSelectedNode(null)}
            onConfigChange={onConfigChange}
          />
        )}

        <ChatInterface
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          onSendMessage={handleSendMessage}
          messages={messages}
          isProcessing={isProcessing}
        />
      </div>
    </ReactFlowProvider>
  );
};