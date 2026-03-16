import { Children, ReactNode } from "react";

// Define the props for the Each component using a generic type T for the array elements
interface EachProps<T> {
    /**
     * A function that renders each item in the 'of' array.
     * It receives the item and its index as arguments and should return a ReactNode.
     * @param item The current item being rendered.
     * @param index The index of the current item.
     * @returns A ReactNode to be rendered.
     */
    render: (item: T, index: number) => ReactNode;
    /**
     * The array of items to iterate over.
     */
    of: T[];
}

/**
 * A component that iterates over an array and renders each item using a provided render function.
 * This can be useful for rendering lists in a declarative way.
 *
 * @template T The type of the elements in the 'of' array.
 * @param {EachProps<T>} param0 The component's props.
 * @param {function(item: T, index: number): ReactNode} param0.render A function to render each item.
 * @param {T[]} param0.of The array of items to render.
 * @returns {ReactNode[]} An array of ReactNodes representing the rendered list.
 */
export const Each = <T,>({ render, of }: EachProps<T>): ReactNode[] =>
    Children.toArray(of.map((item, index) => render(item, index)));