import { UniversalComponentDocPage } from "../pages/UniversalComponentDocPage";

export type MantineStyleComponentDocsProps = {
  slug?: string;
  componentSlug?: string;
  component?: {
    slug?: string;
    kebab?: string;
    name?: string;
    description?: string;
    group?: string;
  };
  [key: string]: unknown;
};

export function MantineStyleComponentDocs(props: MantineStyleComponentDocsProps) {
  return <UniversalComponentDocPage {...props} />;
}

export default MantineStyleComponentDocs;
