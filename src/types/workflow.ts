export interface ComponentData {
  id: string;
  type: 'userQuery' | 'knowledgeBase' | 'llmEngine' | 'output';
  label: string;
  config: Record<string, any>;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: ComponentData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface WorkflowExecution {
  id: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  currentStep?: string;
  results: Record<string, any>;
}