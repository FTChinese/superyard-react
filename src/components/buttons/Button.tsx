import Button from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/esm/types';
import Spinner from 'react-bootstrap/Spinner';

/**
 * Shows an icon in front of text.
 */
export function LeadIconText(
  props: {
    icon: JSX.Element;
    text: string
  }
) {
  return (
    <span className="d-flex align-items-center">
      {props.icon}
      <span className="ps-1">{props.text}</span>
    </span>
  );
}

/**
 * Shows an icon after text.
 */
export function TrailIconText(
  props: {
    icon: JSX.Element;
    text: string
  }
) {
  return (
    <span className="d-flex align-items-center">
      <span className="pe-1">{props.text}</span>
      {props.icon}
    </span>
  );
}

/**
 * Shows either a spinner or text.
 */
export function SpinnerOrText(
  props: {
    text: string;
    progress: boolean
  }
) {
  if (props.progress) {
    return <Spinner as="span" animation="border" size="sm" />;
  } else {
    return <>{props.text}</>;
  }
}

/**
 * A primary button by default.
 */
export function OButton(props: {
  children: JSX.Element;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'lg';
  variant?: ButtonVariant;
}) {
  return (
    <Button
      disabled={props.disabled}
      variant={props.variant || 'primary'}
      size={props.size}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}

/**
 * A button shows a loading spinner when
 * in progress, or plain text when not in progress.
 */
export function LoadButton(
  props: {
    text: string;
    progress: boolean;
    onClick: () => void;
    disabled?: boolean;
    size?: 'sm' | 'lg';
    variant?: ButtonVariant;
    className?: string;
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant={props.variant || 'primary'}
      size={props.size || 'sm'}
      onClick={props.onClick}
      type="button"
    >
      <SpinnerOrText
        progress={props.progress}
        text={props.text}
      />
    </Button>
  );
}

/**
 * A block loading status button.
 */
export function BlockLoadButton(
  props: {
    text: string;
    onClick: () => void;
    progress: boolean;
    disabled?: boolean;
    size?: 'sm' | 'lg';
    variant?: ButtonVariant;
    className?: string;
  }
) {
  let className = 'd-grid';
  if (props.className) {
    className += ` ${props.className}`;
  }

  return (
    <div className={className}>
      <Button
        disabled={props.disabled}
        variant={props.variant || 'primary'}
        size={props.size || 'sm'}
        onClick={props.onClick}
        type="button"
      >
        <SpinnerOrText
          progress={props.progress}
          text={props.text}
        />
      </Button>
    </div>
  );
}

export function LinkButton(
  props: {
    children: JSX.Element | string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant={'link'}
      size="sm"
      onClick={props.onClick}
      className={props.className}
    >
      {props.children}
    </Button>
  );
}

export function SmallButton(
  props: {
    children: JSX.Element | string;
    onClick: () => void;
    disabled?: boolean;
    variant?: ButtonVariant;
    className?: string;
  }
) {
  return (
    <Button
      disabled={props.disabled}
      variant={props.variant || 'primary'}
      size="sm"
      onClick={props.onClick}
      className={props.className}
    >
      {props.children}
    </Button>
  );
}
