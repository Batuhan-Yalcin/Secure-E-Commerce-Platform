import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';

interface SubmitButtonProps {
  text: string;
  loadingText?: string;
  isLoading: boolean;
  icon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Button = styled.button<{ $isLoading: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: ${props => (props.$isLoading || props.disabled) ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  min-width: 120px;
  
  &:hover:not(:disabled):not([data-loading="true"]) {
    background-color: #2563eb;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.65;
  }
  
  svg.loading-icon {
    animation: ${spin} 1s linear infinite;
  }
`;

const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  loadingText = 'İşleniyor...',
  isLoading,
  icon,
  loadingIcon = <FaSpinner className="loading-icon" />,
  onClick,
  type = 'button',
  disabled = false
}) => {
  return (
    <Button
      $isLoading={isLoading}
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      data-loading={isLoading}
    >
      {isLoading ? loadingIcon : icon}
      {isLoading ? loadingText : text}
    </Button>
  );
};

export default SubmitButton; 