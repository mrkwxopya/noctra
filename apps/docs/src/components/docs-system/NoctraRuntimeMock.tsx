import { createElement, forwardRef, type ElementType, type ReactNode } from "react";

export type NoctraMockProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: any;
  href?: string;
  type?: "button" | "submit" | "reset";
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  placeholder?: string;
  title?: any;
  label?: any;
  description?: any;
  data?: readonly any[];
  items?: readonly any[];
  rows?: readonly any[];
  columns?: readonly any[];
  options?: readonly any[];
  theme?: any;
  density?: any;
  radius?: any;
  radiusMode?: any;
  accent?: any;
  tone?: any;
  variant?: any;
  size?: any;
  [key: string]: any;
};

export type NoctraProviderProps = NoctraMockProps;
export type NoctraTheme = any;
export type NoctraTokens = any;

function cx(...values: any[]) {
  return values.filter((value) => typeof value === "string" && value.length > 0).join(" ");
}

function toNode(value: any): any {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return value as any;
}

function kebab(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function isInteractiveName(name: string) {
  return /button|tab|menu|select|checkbox|radio|switch|slider|pagination|rating|clipboard/i.test(name);
}

function isTextInputName(name: string) {
  return /input|textarea|search|password|number|color/i.test(name);
}

function createNoctraMock(displayName: string) {
  const Component = forwardRef<any, NoctraMockProps>(function NoctraRuntimeMockComponent(
    props,
    ref
  ) {
    const {
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
      disabled,
      placeholder,
      ...rest
    } = props;

    const tag: any = as ?? (href ? "a" : isTextInputName(displayName) ? "input" : isInteractiveName(displayName) ? "button" : "div");
    const displayChildren: any = children ?? toNode(label) ?? toNode(title) ?? displayName;
    const list: any = data ?? items ?? rows ?? options ?? columns;

    const safeProps: Record<string, any> = {};

    for (const [key, value] of Object.entries(rest)) {
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

    const commonProps: Record<string, any> = {
      ...safeProps,
      ref,
      className: cx("ncr-mock", `ncr-mock-${kebab(displayName)}`, className),
      style
    };

    if (tag === "input" || tag === "textarea") {
      return createElement(tag, {
        ...commonProps,
        placeholder: typeof placeholder === "string" ? placeholder : displayName,
        disabled: Boolean(disabled)
      });
    }

    if (href) {
      commonProps.href = href;
    }

    if (tag === "button") {
      commonProps.type = type ?? "button";
      commonProps.disabled = Boolean(disabled);
    }

    const childrenNodes: any[] = [
      createElement("span", { className: "ncr-mock-label", key: "label" }, displayChildren as any)
    ];

    const descriptionNode = toNode(description);

    if (descriptionNode !== undefined) {
      childrenNodes.push(createElement("small", { key: "description" }, descriptionNode as any));
    }

    if (Array.isArray(list) && list.length > 0) {
      childrenNodes.push(createElement("span", { className: "ncr-mock-list", key: "list" }, `${list.length} items`));
    }

    return createElement(tag, commonProps as any, ...childrenNodes);
  });

  Component.displayName = `NoctraDocsSafe${displayName}`;

  return Component;
}

export const DefaultNoctraMock: any = createNoctraMock("Default");

export function NoctraProvider({ children, className, style }: NoctraProviderProps) {
  return createElement("div", { className: cx("ncr-provider", className), style }, children as any);
}

export type AccordionProps = any;
export type AlertProps = any;
export type AppShellProps = any;
export type AspectRatioProps = any;
export type AvatarProps = any;
export type BadgeProps = any;
export type BoxProps = any;
export type ButtonProps = any;
export type CardProps = any;
export type CheckboxProps = any;
export type CodeBlockProps = any;
export type ContainerProps = any;
export type GridProps = any;
export type GroupProps = any;
export type InputProps = any;
export type ModalProps = any;
export type NcAccentMode = any;
export type NcButtonVariant = any;
export type NcDensity = any;
export type NcRadius = any;
export type NcRadiusMode = any;
export type NcSize = any;
export type NcTone = any;
export type PaperProps = any;
export type SelectProps = any;
export type StackProps = any;
export type TabsProps = any;
export type TextInputProps = any;

export const Accordion: any = createNoctraMock("Accordion");
export const Alert: any = createNoctraMock("Alert");
export const AppShell: any = createNoctraMock("AppShell");
export const AspectRatio: any = createNoctraMock("AspectRatio");
export const Autocomplete: any = createNoctraMock("Autocomplete");
export const Avatar: any = createNoctraMock("Avatar");
export const Badge: any = createNoctraMock("Badge");
export const Blockquote: any = createNoctraMock("Blockquote");
export const Box: any = createNoctraMock("Box");
export const Breadcrumb: any = createNoctraMock("Breadcrumb");
export const Breadcrumbs: any = createNoctraMock("Breadcrumbs");
export const Button: any = createNoctraMock("Button");
export const Card: any = createNoctraMock("Card");
export const CardBody: any = createNoctraMock("CardBody");
export const CardDescription: any = createNoctraMock("CardDescription");
export const CardFooter: any = createNoctraMock("CardFooter");
export const CardHeader: any = createNoctraMock("CardHeader");
export const CardTitle: any = createNoctraMock("CardTitle");
export const Center: any = createNoctraMock("Center");
export const Checkbox: any = createNoctraMock("Checkbox");
export const ClickOutside: any = createNoctraMock("ClickOutside");
export const Clipboard: any = createNoctraMock("Clipboard");
export const Code: any = createNoctraMock("Code");
export const CodeBlock: any = createNoctraMock("CodeBlock");
export const ColorInput: any = createNoctraMock("ColorInput");
export const ColorPicker: any = createNoctraMock("ColorPicker");
export const Combobox: any = createNoctraMock("Combobox");
export const Command: any = createNoctraMock("Command");
export const CommandBar: any = createNoctraMock("CommandBar");
export const Container: any = createNoctraMock("Container");
export const ContextMenu: any = createNoctraMock("ContextMenu");
export const CreditCard: any = createNoctraMock("CreditCard");
export const DataGrid: any = createNoctraMock("DataGrid");
export const Dialog: any = createNoctraMock("Dialog");
export const Divider: any = createNoctraMock("Divider");
export const Dock: any = createNoctraMock("Dock");
export const Drawer: any = createNoctraMock("Drawer");
export const Dropzone: any = createNoctraMock("Dropzone");
export const EmptyState: any = createNoctraMock("EmptyState");
export const Flex: any = createNoctraMock("Flex");
export const FloatLabel: any = createNoctraMock("FloatLabel");
export const FocusTrap: any = createNoctraMock("FocusTrap");
export const Footer: any = createNoctraMock("Footer");
export const FormField: any = createNoctraMock("FormField");
export const Grid: any = createNoctraMock("Grid");
export const Group: any = createNoctraMock("Group");
export const Header: any = createNoctraMock("Header");
export const Highlight: any = createNoctraMock("Highlight");
export const HoverCard: any = createNoctraMock("HoverCard");
export const IconButton: any = createNoctraMock("IconButton");
export const InlineCode: any = createNoctraMock("InlineCode");
export const Input: any = createNoctraMock("Input");
export const Kbd: any = createNoctraMock("Kbd");
export const Layout: any = createNoctraMock("Layout");
export const LayoutShell: any = createNoctraMock("LayoutShell");
export const Link: any = createNoctraMock("Link");
export const ListBox: any = createNoctraMock("ListBox");
export const Loader: any = createNoctraMock("Loader");
export const Menu: any = createNoctraMock("Menu");
export const Modal: any = createNoctraMock("Modal");
export const MultiSelect: any = createNoctraMock("MultiSelect");
export const NativeSelect: any = createNoctraMock("NativeSelect");
export const Notification: any = createNoctraMock("Notification");
export const NumberInput: any = createNoctraMock("NumberInput");
export const Page: any = createNoctraMock("Page");
export const Pagination: any = createNoctraMock("Pagination");
export const Paper: any = createNoctraMock("Paper");
export const PasswordInput: any = createNoctraMock("PasswordInput");
export const PinCode: any = createNoctraMock("PinCode");
export const PinInput: any = createNoctraMock("PinInput");
export const Popover: any = createNoctraMock("Popover");
export const Portal: any = createNoctraMock("Portal");
export const Progress: any = createNoctraMock("Progress");
export const Prose: any = createNoctraMock("Prose");
export const Radio: any = createNoctraMock("Radio");
export const RangeSlider: any = createNoctraMock("RangeSlider");
export const Rating: any = createNoctraMock("Rating");
export const ResizablePanel: any = createNoctraMock("ResizablePanel");
export const ScrollArea: any = createNoctraMock("ScrollArea");
export const ScrollLock: any = createNoctraMock("ScrollLock");
export const SearchInput: any = createNoctraMock("SearchInput");
export const Section: any = createNoctraMock("Section");
export const SegmentedControl: any = createNoctraMock("SegmentedControl");
export const Select: any = createNoctraMock("Select");
export const Sidebar: any = createNoctraMock("Sidebar");
export const SimpleGrid: any = createNoctraMock("SimpleGrid");
export const Skeleton: any = createNoctraMock("Skeleton");
export const Slider: any = createNoctraMock("Slider");
export const Spacer: any = createNoctraMock("Spacer");
export const Spinner: any = createNoctraMock("Spinner");
export const SplitPane: any = createNoctraMock("SplitPane");
export const Stack: any = createNoctraMock("Stack");
export const StatusBar: any = createNoctraMock("StatusBar");
export const Stepper: any = createNoctraMock("Stepper");
export const Switch: any = createNoctraMock("Switch");
export const Table: any = createNoctraMock("Table");
export const TableOfContents: any = createNoctraMock("TableOfContents");
export const Tabs: any = createNoctraMock("Tabs");
export const TagsInput: any = createNoctraMock("TagsInput");
export const Textarea: any = createNoctraMock("Textarea");
export const TextInput: any = createNoctraMock("TextInput");
export const Timeline: any = createNoctraMock("Timeline");
export const Toast: any = createNoctraMock("Toast");
export const Toolbar: any = createNoctraMock("Toolbar");
export const Tooltip: any = createNoctraMock("Tooltip");
export const TransferList: any = createNoctraMock("TransferList");
export const Tree: any = createNoctraMock("Tree");
export const TreeSelect: any = createNoctraMock("TreeSelect");
export const TreeView: any = createNoctraMock("TreeView");
export const VisuallyHidden: any = createNoctraMock("VisuallyHidden");

export default DefaultNoctraMock;
