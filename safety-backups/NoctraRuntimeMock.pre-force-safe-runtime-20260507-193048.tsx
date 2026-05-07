import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactNode
} from "react";

export type NoctraMockProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  href?: string;
  type?: "button" | "submit" | "reset";
  value?: unknown;
  checked?: boolean;
  disabled?: boolean;
  placeholder?: string;
  title?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  data?: readonly unknown[];
  items?: readonly unknown[];
  rows?: readonly unknown[];
  columns?: readonly unknown[];
  options?: readonly unknown[];
  [key: string]: unknown;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function renderPrimitive(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function isInteractiveName(name: string) {
  return /button|tab|menu|select|input|checkbox|radio|switch|slider|pagination|rating|clipboard/i.test(name);
}

function isTextInputName(name: string) {
  return /input|textarea|search|password|number|color/i.test(name);
}

function createNoctraMock(displayName: string) {
  const Component = forwardRef<HTMLElement, NoctraMockProps>(function NoctraRuntimeMockComponent(
    {
      as,
      children,
      className,
      style,
      href,
      type,
      title,
      label,
      description,
      data,
      items,
      rows,
      columns,
      options,
      ...props
    },
    ref
  ) {
    const Tag = as ?? (href ? "a" : isTextInputName(displayName) ? "input" : isInteractiveName(displayName) ? "button" : "div");
    const displayChildren = children ?? renderPrimitive(label) ?? renderPrimitive(title) ?? displayName;
    const list = data ?? items ?? rows ?? options ?? columns;

    const safeProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
      if (
        key.startsWith("data-") ||
        key.startsWith("aria-") ||
        key === "id" ||
        key === "role" ||
        key === "name" ||
        key === "target" ||
        key === "rel"
      ) {
        safeProps[key] = value;
      }
    }

    if (Tag === "input") {
      return (
        <input
          ref={ref as never}
          className={cx("ncr-mock", "ncr-mock-input", className)}
          style={style}
          placeholder={typeof props.placeholder === "string" ? props.placeholder : displayName}
          disabled={Boolean(props.disabled)}
          {...safeProps}
        />
      );
    }

    return (
      <Tag
        ref={ref as never}
        className={cx("ncr-mock", `ncr-mock-${displayName.toLowerCase()}`, className)}
        style={style}
        href={href}
        type={Tag === "button" ? type ?? "button" : undefined}
        disabled={Tag === "button" ? Boolean(props.disabled) : undefined}
        {...safeProps}
      >
        <span className="ncr-mock-label">{displayChildren}</span>
        {description ? <small>{description}</small> : null}
        {Array.isArray(list) && list.length > 0 ? (
          <span className="ncr-mock-list">{list.length} items</span>
        ) : null}
      </Tag>
    );
  });

  Component.displayName = `NoctraDocsSafe${displayName}`;

  return Component;
}



export const Accordion = createNoctraMock("Accordion");
export const Alert = createNoctraMock("Alert");
export const AppShell = createNoctraMock("AppShell");
export const AspectRatio = createNoctraMock("AspectRatio");
export const Autocomplete = createNoctraMock("Autocomplete");
export const Avatar = createNoctraMock("Avatar");
export const Badge = createNoctraMock("Badge");
export const Blockquote = createNoctraMock("Blockquote");
export const Box = createNoctraMock("Box");
export const Breadcrumb = createNoctraMock("Breadcrumb");
export const Breadcrumbs = createNoctraMock("Breadcrumbs");
export const Button = createNoctraMock("Button");
export const Card = createNoctraMock("Card");
export const CardBody = createNoctraMock("CardBody");
export const CardDescription = createNoctraMock("CardDescription");
export const CardFooter = createNoctraMock("CardFooter");
export const CardHeader = createNoctraMock("CardHeader");
export const CardTitle = createNoctraMock("CardTitle");
export const Center = createNoctraMock("Center");
export const Checkbox = createNoctraMock("Checkbox");
export const ClickOutside = createNoctraMock("ClickOutside");
export const Clipboard = createNoctraMock("Clipboard");
export const Code = createNoctraMock("Code");
export const CodeBlock = createNoctraMock("CodeBlock");
export const CodePanel = createNoctraMock("CodePanel");
export const ColorInput = createNoctraMock("ColorInput");
export const ColorPicker = createNoctraMock("ColorPicker");
export const Combobox = createNoctraMock("Combobox");
export const Command = createNoctraMock("Command");
export const CommandBar = createNoctraMock("CommandBar");
export const ComponentType = createNoctraMock("ComponentType");
export const Container = createNoctraMock("Container");
export const ContextMenu = createNoctraMock("ContextMenu");
export const createElement = createNoctraMock("createElement");
export const CreditCard = createNoctraMock("CreditCard");
export const DataGrid = createNoctraMock("DataGrid");
export const DataTable = createNoctraMock("DataTable");
export const Dialog = createNoctraMock("Dialog");
export const Dispatch = createNoctraMock("Dispatch");
export const Divider = createNoctraMock("Divider");
export const DocCard = createNoctraMock("DocCard");
export const Dock = createNoctraMock("Dock");
export const DocsSection = createNoctraMock("DocsSection");
export const Drawer = createNoctraMock("Drawer");
export const Dropzone = createNoctraMock("Dropzone");
export const EmptyState = createNoctraMock("EmptyState");
export const Flex = createNoctraMock("Flex");
export const FloatLabel = createNoctraMock("FloatLabel");
export const FocusTrap = createNoctraMock("FocusTrap");
export const Footer = createNoctraMock("Footer");
export const FormField = createNoctraMock("FormField");
export const Grid = createNoctraMock("Grid");
export const Group = createNoctraMock("Group");
export const Header = createNoctraMock("Header");
export const Highlight = createNoctraMock("Highlight");
export const HoverCard = createNoctraMock("HoverCard");
export const IconButton = createNoctraMock("IconButton");
export const InfoCard = createNoctraMock("InfoCard");
export const InlineCode = createNoctraMock("InlineCode");
export const Input = createNoctraMock("Input");
export const Kbd = createNoctraMock("Kbd");
export const Layout = createNoctraMock("Layout");
export const LayoutShell = createNoctraMock("LayoutShell");
export const Link = createNoctraMock("Link");
export const ListBox = createNoctraMock("ListBox");
export const Loader = createNoctraMock("Loader");
export const Menu = createNoctraMock("Menu");
export const Modal = createNoctraMock("Modal");
export const MultiSelect = createNoctraMock("MultiSelect");
export const NativeSelect = createNoctraMock("NativeSelect");
export const NcAccentMode = createNoctraMock("NcAccentMode");
export const NcButtonVariant = createNoctraMock("NcButtonVariant");
export const NcDensity = createNoctraMock("NcDensity");
export const NcRadius = createNoctraMock("NcRadius");
export const NcRadiusMode = createNoctraMock("NcRadiusMode");
export const NcSize = createNoctraMock("NcSize");
export const NcTone = createNoctraMock("NcTone");
export const NoctraDocsComponent = createNoctraMock("NoctraDocsComponent");
export const NoctraProvider = createNoctraMock("NoctraProvider");
export const Notification = createNoctraMock("Notification");
export const NumberInput = createNoctraMock("NumberInput");
export const Page = createNoctraMock("Page");
export const PageHero = createNoctraMock("PageHero");
export const PageIntro = createNoctraMock("PageIntro");
export const Pagination = createNoctraMock("Pagination");
export const Paper = createNoctraMock("Paper");
export const PasswordInput = createNoctraMock("PasswordInput");
export const PinCode = createNoctraMock("PinCode");
export const PinInput = createNoctraMock("PinInput");
export const Popover = createNoctraMock("Popover");
export const Portal = createNoctraMock("Portal");
export const Progress = createNoctraMock("Progress");
export const Prose = createNoctraMock("Prose");
export const Radio = createNoctraMock("Radio");
export const RangeSlider = createNoctraMock("RangeSlider");
export const Rating = createNoctraMock("Rating");
export const ReactNode = createNoctraMock("ReactNode");
export const ResizablePanel = createNoctraMock("ResizablePanel");
export const ScrollArea = createNoctraMock("ScrollArea");
export const ScrollLock = createNoctraMock("ScrollLock");
export const SearchInput = createNoctraMock("SearchInput");
export const Section = createNoctraMock("Section");
export const SectionTitle = createNoctraMock("SectionTitle");
export const SegmentedControl = createNoctraMock("SegmentedControl");
export const Select = createNoctraMock("Select");
export const SetStateAction = createNoctraMock("SetStateAction");
export const Sidebar = createNoctraMock("Sidebar");
export const SimpleGrid = createNoctraMock("SimpleGrid");
export const Skeleton = createNoctraMock("Skeleton");
export const Slider = createNoctraMock("Slider");
export const Spacer = createNoctraMock("Spacer");
export const Spinner = createNoctraMock("Spinner");
export const SplitPane = createNoctraMock("SplitPane");
export const Stack = createNoctraMock("Stack");
export const StatCard = createNoctraMock("StatCard");
export const StatusBar = createNoctraMock("StatusBar");
export const Stepper = createNoctraMock("Stepper");
export const Switch = createNoctraMock("Switch");
export const Table = createNoctraMock("Table");
export const TableOfContents = createNoctraMock("TableOfContents");
export const Tabs = createNoctraMock("Tabs");
export const TagsInput = createNoctraMock("TagsInput");
export const Textarea = createNoctraMock("Textarea");
export const TextInput = createNoctraMock("TextInput");
export const Timeline = createNoctraMock("Timeline");
export const Toast = createNoctraMock("Toast");
export const Toolbar = createNoctraMock("Toolbar");
export const Tooltip = createNoctraMock("Tooltip");
export const TransferList = createNoctraMock("TransferList");
export const Tree = createNoctraMock("Tree");
export const TreeSelect = createNoctraMock("TreeSelect");
export const TreeView = createNoctraMock("TreeView");
export const useMemo = createNoctraMock("useMemo");
export const useState = createNoctraMock("useState");
export const VisuallyHidden = createNoctraMock("VisuallyHidden");

export const NoctraProvider = ({ children }: { children?: ReactNode }) => <>{children}</>;

export default createNoctraMock("Default");
