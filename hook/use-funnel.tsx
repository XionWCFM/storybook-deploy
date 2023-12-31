import { useRouter } from 'next/router';

import { Children, ReactElement, isValidElement, useEffect } from 'react';

export type NonEmptyArray<T> = readonly [T, ...T[]];

export interface FunnelProps<Steps extends NonEmptyArray<string>> {
  steps: Steps;
  step: Steps[number];
  children:
    | Array<ReactElement<StepProps<Steps>>>
    | ReactElement<StepProps<Steps>>;
}

export interface StepProps<Steps extends NonEmptyArray<string>> {
  name: Steps[number];
  onEnter?: () => void;
  children: React.ReactNode;
}

export const Funnel = <Steps extends NonEmptyArray<string>>({
  step,
  steps,
  children,
}: FunnelProps<Steps>) => {
  const validChildren = Children.toArray(children)
    .filter(isValidElement)
    .filter((item) =>
      steps.includes((item.props as Partial<StepProps<Steps>>).name ?? ''),
    ) as Array<ReactElement<StepProps<Steps>>>;

  const targetStep = validChildren.find((child) => child.props.name === step);
  return <>{targetStep}</>;
};

export const Step = <T extends NonEmptyArray<string>>({
  onEnter,
  children,
}: StepProps<T>) => {
  useEffect(() => {
    onEnter?.();
  }, [onEnter]);
  return <>{children}</>;
};

type RouteFunnelProps<Steps extends NonEmptyArray<string>> = Omit<
  FunnelProps<Steps>,
  'steps' | 'step'
>;

type FunnelComponent<Steps extends NonEmptyArray<string>> = (
  props: RouteFunnelProps<Steps>,
) => JSX.Element & {
  Step: (props: StepProps<Steps>) => JSX.Element;
};

const useFunnel = <Steps extends NonEmptyArray<string>>(
  steps: Steps,
  options?: {},
) => {};

export default useFunnel;
