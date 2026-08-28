declare module 'disqus-react' {
  import * as React from 'react';

  export interface DisqusConfig {
    url?: string;
    identifier?: string;
    title?: string;
    language?: string;
  }

  export interface CommentCountProps {
    shortname: string;
    config: DisqusConfig;
    children?: React.ReactNode;
    className?: string;
  }

  export interface DiscussionEmbedProps {
    shortname: string;
    config: DisqusConfig;
  }

  export class CommentCount extends React.Component<CommentCountProps, any> {}
  export class DiscussionEmbed extends React.Component<DiscussionEmbedProps, any> {}
  export class CommentEmbed extends React.Component<any, any> {}
}

declare global {
  interface Window {
    disqus_config?: () => void;
    DISQUS?: {
      reset: (options: { reload: boolean; config?: () => void }) => void;
    };
  }
}

