import { LinkButton } from '../ui/LinkButton';
import { StateBlock } from '../ui/StateBlock';

interface NotFoundStateProps {
  title?: string;
  text?: string;
}

/** One honest dead end for bad routes, app ids and foreign order ids (REQ-013, REQ-044). */
export function NotFoundState({ title = 'Page not found', text = 'That page does not exist.' }: NotFoundStateProps) {
  return (
    <StateBlock
      code="404"
      title={title}
      text={text}
      actions={<LinkButton to="/">Back to the catalog</LinkButton>}
      centered
    />
  );
}
