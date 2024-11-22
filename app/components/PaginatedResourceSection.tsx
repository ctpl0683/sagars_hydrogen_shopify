import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 */

export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resoucesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className='w-full'>
            <PreviousLink className='w-full grid place-content-center my-4'>
              {isLoading ? 'Loading...' : <span className=' text-white font-bold p-5 bg-[var(--theme-base-color)] rounded-2xl'>↑ Load previous</span>}
            </PreviousLink>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resoucesMarkup}</div>
            ) : (
              resoucesMarkup
            )}
            <NextLink className='w-full grid place-content-center my-4'>
              {isLoading ? 'Loading...' : <span className=' text-white font-bold p-5 bg-[var(--theme-base-color)] rounded-2xl'>Load more</span>}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}
