import { StateBlock } from '../ui/StateBlock';
import { Button } from '../ui/Button';

/** Section-level failure: one sentence and one retry, never a raw error (UIMap states). */
export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <StateBlock
      code="Error"
      title="Could not load this."
      text="Something went wrong on the way to the store."
      actions={<Button onClick={onRetry}>Try again</Button>}
    />
  );
}
