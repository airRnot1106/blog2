import React from 'react';
import type { ComponentProps, JSX, JSXElementConstructor } from 'react';

function isElement(prop: unknown): prop is JSX.Element {
  return React.isValidElement(prop);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value) || isElement(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value) as unknown;
  return proto === Object.prototype || proto === null;
}

function findProps<
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
>(
  value: unknown,
  // oxlint-disable-next-line @typescript-eslint/no-unsafe-function-type
  componentType: Function | string,
): ComponentProps<T> | undefined {
  if (isElement(value)) {
    if (value.type === componentType) {
      // oxlint-disable-next-line typescript/no-unsafe-return
      return value.props;
    }
    // oxlint-disable-next-line typescript/no-unsafe-return
    return findProps<T>(value.props, componentType);
  }
  if (Array.isArray(value)) {
    for (const item of value as unknown[]) {
      const hit = findProps<T>(item, componentType);
      // oxlint-disable-next-line typescript/no-unsafe-return
      if (hit) return hit;
    }
    return undefined;
  }
  if (isPlainObject(value)) {
    for (const item of Object.values(value)) {
      const hit = findProps<T>(item, componentType);
      // oxlint-disable-next-line typescript/no-unsafe-return
      if (hit) return hit;
    }
    return undefined;
  }
  return undefined;
}

/**
 * Searches a rendered element tree for the target component or tag and returns its props,
 * or undefined when the target does not appear anywhere in the tree.
 *
 * @example
 *
 * ```tsx
 * function Component() {
 *   return <div id="test"><Target className="test-component"/></div>
 * }
 *
 * const el = Component();
 * assert(getProps(el, "div")!.id === "test");
 * assert(getProps(el, Target)!.className === "test-component");
 * ```
 *
 **/
export function getProps<
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
>(
  element: JSX.Element,
  // oxlint-disable-next-line @typescript-eslint/no-unsafe-function-type
  componentType: Function | string,
): ComponentProps<T> | undefined {
  // oxlint-disable-next-line typescript/no-unsafe-return
  return findProps<T>(element, componentType);
}

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  // oxlint-disable-next-line unicorn/consistent-function-scoping
  function TestChild({ message }: { message: string }) {
    return <div>{message}</div>;
  }

  // oxlint-disable-next-line unicorn/consistent-function-scoping
  function TestParent({ children }: { children: JSX.Element }) {
    return <div>{children}</div>;
  }

  // oxlint-disable-next-line unicorn/consistent-function-scoping
  function TestNested({ id, child }: { id: string; child: JSX.Element }) {
    return (
      <div data-id={id}>
        <span>wrapper</span>
        {child}
      </div>
    );
  }

  // oxlint-disable-next-line unicorn/consistent-function-scoping
  function TestMemoInner({ label }: { label: string }) {
    return <div>{label}</div>;
  }
  const TestMemoComponent = React.memo(TestMemoInner);

  // oxlint-disable-next-line unicorn/consistent-function-scoping
  function TestSlots({ slots }: { slots: Record<string, JSX.Element> }) {
    return <div>{Object.values(slots)}</div>;
  }

  describe('isElement', () => {
    it('値がJSX要素のとき、要素として認識する', () => {
      const element = <div />;
      expect(isElement(element)).toBe(true);
    });

    it('値が文字列・数値・null・undefinedのとき、要素として認識しない', () => {
      expect(isElement('string')).toBe(false);
      expect(isElement(123)).toBe(false);
      expect(isElement(null)).toBe(false);
      expect(isElement(undefined)).toBe(false);
    });

    it('値がプレーンオブジェクトのとき、要素として認識しない', () => {
      expect(isElement({ example: 'example' })).toBe(false);
    });

    it('値がメモ化されたコンポーネントの要素のとき、要素として認識する', () => {
      const element = <TestMemoComponent label="test" />;
      expect(isElement(element)).toBe(true);
    });
  });

  describe('getProps', () => {
    it('ルート要素が対象のコンポーネントのとき、そのpropsを返す', () => {
      const element = <TestChild message="hello" />;
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      const props = getProps(element, TestChild);

      expect(props).toEqual({ message: 'hello' });
    });

    it('タグ名で検索したとき、一致する要素のpropsを返す', () => {
      // oxlint-disable-next-line better-tailwindcss/no-unknown-classes
      const element = <div className="test-class" id="test-id" />;
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      const props = getProps(element, 'div');

      expect(props).toEqual({ id: 'test-id', className: 'test-class' });
    });

    it('対象のコンポーネントが別の要素の中に入れ子になっているとき、そのpropsを返す', () => {
      const element = (
        <TestParent>
          <TestChild message="nested" />
        </TestParent>
      );
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      const props = getProps(element, TestChild);

      expect(props).toEqual({ message: 'nested' });
    });

    it('対象のコンポーネントが深く入れ子になっているときも、そのpropsを返す', () => {
      const element = (
        <TestNested
          child={
            <TestParent>
              <TestChild message="deep" />
            </TestParent>
          }
          id="outer"
        />
      );
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      const props = getProps(element, TestChild);

      expect(props).toEqual({ message: 'deep' });
    });

    it('対象のタグが別の要素の中に入れ子になっているとき、そのpropsを返す', () => {
      const element = (
        <div id="parent">
          <span id="child">content</span>
        </div>
      );
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      const props = getProps(element, 'span');

      expect(props).toEqual({ id: 'child', children: 'content' });
    });

    it('対象のコンポーネントがツリー内に存在しないとき、undefinedを返す', () => {
      const element = <TestParent>{<div />}</TestParent>;
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      const props = getProps(element, TestChild);

      expect(props).toBeUndefined();
    });

    it('対象のコンポーネントが配列の子要素の一つであるとき、そのpropsを返す', () => {
      const element = (
        <div>
          <span />
          <TestChild message="array-sibling" />
        </div>
      );
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      const props = getProps(element, TestChild);

      expect(props).toEqual({ message: 'array-sibling' });
    });

    it('子要素が入れ子の配列にグループ化されているときも、対象のコンポーネントを見つけてpropsを返す', () => {
      const rows = [0, 1].map((i) => [
        <span key={`a${i}`} />,
        <TestChild key={`b${i}`} message={`row-${i}`} />,
      ]);
      const element = <div>{rows}</div>;
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      const props = getProps(element, TestChild);

      expect(props).toEqual({ message: 'row-0' });
    });

    it('slotsのようなpropがプレーンオブジェクトの値として要素を渡しているときも、対象のコンポーネントを見つけてpropsを返す', () => {
      const element = <TestSlots slots={{ header: <TestChild message="slotted" /> }} />;
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      const props = getProps(element, TestChild);

      expect(props).toEqual({ message: 'slotted' });
    });
  });
}
