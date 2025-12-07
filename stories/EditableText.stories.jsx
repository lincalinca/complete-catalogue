import { useState } from 'react';
import * as React from 'react';

// Simplified EditableText component for testing (self-contained)
function EditableText({ value, onSave, placeholder, disabled = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = React.useRef(null);
  const isTabPressedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isEditing) {
      setTempValue(value);
    }
  }, [value, isEditing]);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    if (disabled) return;
    setTempValue(value);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const trimmed = tempValue.trim();
    if (trimmed !== value) {
      await onSave(trimmed);
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsEditing(false);
      });
    });
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if (e.key === "Tab") {
      isTabPressedRef.current = true;
      const trimmed = tempValue.trim();
      if (trimmed !== value) {
        await onSave(trimmed);
      }
    }
  };

  const handleBlur = async (e) => {
    if (isTabPressedRef.current) {
      isTabPressedRef.current = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsEditing(false);
        });
      });
      return;
    }
    await handleSave();
  };

  if (isEditing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
        <input
          ref={inputRef}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            height: '32px',
            fontSize: '14px',
            flex: 1,
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '0 8px',
          }}
        />
        <button
          onClick={async () => await handleSave()}
          onMouseDown={(e) => e.preventDefault()}
          style={{ height: '28px', width: '28px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          ✓
        </button>
        <button
          onClick={handleCancel}
          onMouseDown={(e) => e.preventDefault()}
          style={{ height: '28px', width: '28px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleStartEdit}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        minHeight: '32px',
        width: '100%',
        padding: '4px',
        borderRadius: '4px',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = '#f0f0f0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <span style={{ fontSize: '14px', flex: 1 }}>
        {value || placeholder || "—"}
      </span>
    </div>
  );
}

export default {
  title: 'Crescender/EditableText',
  component: EditableText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    value: 'Click to edit',
    placeholder: 'Enter text',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ width: '300px', padding: '20px' }}>
        <EditableText
          {...args}
          value={value}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            setValue(newValue);
          }}
        />
        <p style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
          Current value: {value}
        </p>
      </div>
    );
  },
};

export const AsyncSave = {
  args: {
    value: 'Test Value',
    placeholder: 'Enter text',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    const [isSaving, setIsSaving] = useState(false);
    
    return (
      <div style={{ width: '300px', padding: '20px' }}>
        <EditableText
          {...args}
          value={value}
          disabled={isSaving}
          onSave={async (newValue) => {
            setIsSaving(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            setValue(newValue);
            setIsSaving(false);
          }}
        />
        {isSaving && <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>Saving...</p>}
        <p style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
          Current value: {value}
        </p>
      </div>
    );
  },
};

export const TabNavigation = {
  render: () => {
    const [value1, setValue1] = useState('First Field');
    const [value2, setValue2] = useState('Second Field');
    
    return (
      <div style={{ width: '300px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <EditableText
          value={value1}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            setValue1(newValue);
          }}
        />
        <EditableText
          value={value2}
          onSave={async (newValue) => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            setValue2(newValue);
          }}
        />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          Try clicking the first field, typing, then pressing Tab
        </p>
      </div>
    );
  },
};

