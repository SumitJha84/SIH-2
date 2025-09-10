import React from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface ActionPlanCardProps {
  tasks: Task[];
  toggleTask: (id: number) => void;
}

const ActionPlanCard: React.FC<ActionPlanCardProps> = ({ tasks, toggleTask }) => {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginTop: 0 }}>
        ✅ Your Action Plan
      </h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>
          {tasks.filter(t => t.completed).length} of {tasks.length} completed
        </span>
        <div style={{ 
          width: '100px', 
          height: '8px', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%`,
            height: '100%',
            backgroundColor: '#10b981'
          }} />
        </div>
      </div>

      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              backgroundColor: task.completed ? '#f0fdf4' : '#ffffff',
              border: '1px solid',
              borderColor: task.completed ? '#bbf7d0' : '#e5e7eb'
            }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                style={{ 
                  marginRight: '12px',
                  width: '16px',
                  height: '16px',
                  accentColor: '#10b981'
                }}
              />
              <span style={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#6b7280' : '#111827',
                fontSize: '14px'
              }}>
                {task.text}
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: '12px',
                fontWeight: '600',
                color: task.priority === 'high' ? '#dc2626' : task.priority === 'medium' ? '#d97706' : '#059669'
              }}>
                {task.priority.toUpperCase()}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionPlanCard;
