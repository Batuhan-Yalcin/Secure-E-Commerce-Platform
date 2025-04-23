import React, { ButtonHTMLAttributes } from 'react';
import styled, { css, keyframes } from 'styled-components';

// Button animasyonları
const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); }
  100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Button varyantları
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'info';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

// Spinner komponenti
const Spinner = styled.div`
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spinAnimation} 0.8s linear infinite;
  display: inline-block;
  margin-right: 0.5rem;
`;

// StyledButton (HTML Button)
const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $isFullWidth: boolean;
  $hasLeftIcon: boolean;
  $hasRightIcon: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  vertical-align: middle;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border-radius: 0.375rem;
  outline: none;
  
  /* Size Styles */
  ${props => {
    switch (props.$size) {
      case 'small':
        return css`
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          
          ${props.$hasLeftIcon && 'padding-left: 0.625rem;'}
          ${props.$hasRightIcon && 'padding-right: 0.625rem;'}
        `;
      case 'large':
        return css`
          padding: 0.75rem 1.5rem;
          font-size: 1.125rem;
          
          ${props.$hasLeftIcon && 'padding-left: 1.25rem;'}
          ${props.$hasRightIcon && 'padding-right: 1.25rem;'}
        `;
      default:
        return css`
          padding: 0.625rem 1.25rem;
          font-size: 1rem;
          
          ${props.$hasLeftIcon && 'padding-left: 1rem;'}
          ${props.$hasRightIcon && 'padding-right: 1rem;'}
        `;
    }
  }}
  
  /* Full Width Style */
  ${props => props.$isFullWidth && css`
    width: 100%;
  `}
  
  /* Variant Styles */
  ${props => {
    switch (props.$variant) {
      case 'secondary':
        return css`
          background-color: #3B82F6;
          color: white;
          border: 1px solid #3B82F6;
          
          &:hover {
            background-color: #2563EB;
            border-color: #2563EB;
          }
          
          &:focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: #0EA5E9;
          border: 1px solid #0EA5E9;
          
          &:hover {
            background-color: rgba(14, 165, 233, 0.1);
          }
          
          &:focus {
            box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.3);
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: #0EA5E9;
          border: 1px solid transparent;
          
          &:hover {
            background-color: rgba(14, 165, 233, 0.1);
          }
          
          &:focus {
            box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
          }
        `;
      case 'danger':
        return css`
          background-color: #EF4444;
          color: white;
          border: 1px solid #EF4444;
          
          &:hover {
            background-color: #DC2626;
            border-color: #DC2626;
          }
          
          &:focus {
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5);
          }
        `;
      case 'success':
        return css`
          background-color: #10B981;
          color: white;
          border: 1px solid #10B981;
          
          &:hover {
            background-color: #059669;
            border-color: #059669;
          }
          
          &:focus {
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.5);
          }
        `;
      case 'warning':
        return css`
          background-color: #F59E0B;
          color: white;
          border: 1px solid #F59E0B;
          
          &:hover {
            background-color: #D97706;
            border-color: #D97706;
          }
          
          &:focus {
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.5);
          }
        `;
      case 'info':
        return css`
          background-color: #3B82F6;
          color: white;
          border: 1px solid #3B82F6;
          
          &:hover {
            background-color: #2563EB;
            border-color: #2563EB;
          }
          
          &:focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
          }
        `;
      default:
        return css`
          background-color: #0EA5E9;
          color: white;
          border: 1px solid #0EA5E9;
          
          &:hover {
            background-color: #0284C7;
            border-color: #0284C7;
          }
          
          &:focus {
            box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.5);
          }
        `;
    }
  }}
  
  /* Disabled State */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  /* Icon Spacing */
  .left-icon {
    margin-right: 0.5rem;
  }
  
  .right-icon {
    margin-left: 0.5rem;
  }
`;

// Anchor wrap for href links
const AnchorWrapper = styled.a`
  text-decoration: none;
  display: inline-flex;
`;

// Button bileşeni
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  href,
  target,
  rel,
  children,
  ...rest
}) => {
  const hasLeftIcon = !!leftIcon || isLoading;
  const hasRightIcon = !!rightIcon;
  
  const buttonContent = (
    <>
      {isLoading && (
        <Spinner className="left-icon" />
      )}
      
      {!isLoading && leftIcon && (
        <span className="left-icon">{leftIcon}</span>
      )}
      
      {children}
      
      {rightIcon && (
        <span className="right-icon">{rightIcon}</span>
      )}
    </>
  );
  
  if (href) {
    return (
      <AnchorWrapper href={href} target={target} rel={rel}>
        <StyledButton
          as="span"
          $variant={variant}
          $size={size}
          $isFullWidth={isFullWidth}
          $hasLeftIcon={hasLeftIcon}
          $hasRightIcon={hasRightIcon}
          {...rest}
        >
          {buttonContent}
        </StyledButton>
      </AnchorWrapper>
    );
  }
  
  return (
    <StyledButton
      type="button"
      $variant={variant}
      $size={size}
      $isFullWidth={isFullWidth}
      $hasLeftIcon={hasLeftIcon}
      $hasRightIcon={hasRightIcon}
      {...rest}
    >
      {buttonContent}
    </StyledButton>
  );
};

export default Button; 