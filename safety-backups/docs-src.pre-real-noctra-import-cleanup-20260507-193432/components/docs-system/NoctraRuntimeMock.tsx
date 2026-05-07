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

export type NoctraTheme = Record<string, unknown>;
export type NoctraTokens = Record<string, unknown>;
export type NoctraComponent = typeof DefaultNoctraMock;

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

export const DefaultNoctraMock = createNoctraMock("Default");

export type AccordionProps = NoctraMockProps;
export type AlertProps = NoctraMockProps;
export type AppShellProps = NoctraMockProps;
export type AspectRatioProps = NoctraMockProps;
export type AutocompleteProps = NoctraMockProps;
export type AvatarProps = NoctraMockProps;
export type BadgeProps = NoctraMockProps;
export type BlockquoteProps = NoctraMockProps;
export type BoxProps = NoctraMockProps;
export type BreadcrumbProps = NoctraMockProps;
export type BreadcrumbsProps = NoctraMockProps;
export type ButtonProps = NoctraMockProps;
export type CardProps = NoctraMockProps;
export type CenterProps = NoctraMockProps;
export type CheckboxProps = NoctraMockProps;
export type ClickOutsideProps = NoctraMockProps;
export type ClipboardProps = NoctraMockProps;
export type CodeBlockProps = NoctraMockProps;
export type CodeProps = NoctraMockProps;
export type ColorInputProps = NoctraMockProps;
export type ColorPickerProps = NoctraMockProps;
export type ComboboxProps = NoctraMockProps;
export type CommandBarProps = NoctraMockProps;
export type CommandProps = NoctraMockProps;
export type ContainerProps = NoctraMockProps;
export type ContextMenuProps = NoctraMockProps;
export type CreditCardProps = NoctraMockProps;
export type DataGridProps = NoctraMockProps;
export type DialogProps = NoctraMockProps;
export type DividerProps = NoctraMockProps;
export type DockProps = NoctraMockProps;
export type DrawerProps = NoctraMockProps;
export type DropzoneProps = NoctraMockProps;
export type EmptyStateProps = NoctraMockProps;
export type FlexProps = NoctraMockProps;
export type FloatLabelProps = NoctraMockProps;
export type FocusTrapProps = NoctraMockProps;
export type FooterProps = NoctraMockProps;
export type FormFieldProps = NoctraMockProps;
export type GridProps = NoctraMockProps;
export type GroupProps = NoctraMockProps;
export type HeaderProps = NoctraMockProps;
export type HighlightProps = NoctraMockProps;
export type HoverCardProps = NoctraMockProps;
export type IconButtonProps = NoctraMockProps;
export type InlineCodeProps = NoctraMockProps;
export type InputProps = NoctraMockProps;
export type KbdProps = NoctraMockProps;
export type LayoutProps = NoctraMockProps;
export type LayoutShellProps = NoctraMockProps;
export type LinkProps = NoctraMockProps;
export type ListBoxProps = NoctraMockProps;
export type LoaderProps = NoctraMockProps;
export type MenuProps = NoctraMockProps;
export type ModalProps = NoctraMockProps;
export type MultiSelectProps = NoctraMockProps;
export type NativeSelectProps = NoctraMockProps;
export type NotificationProps = NoctraMockProps;
export type NumberInputProps = NoctraMockProps;
export type PageProps = NoctraMockProps;
export type PaginationProps = NoctraMockProps;
export type PaperProps = NoctraMockProps;
export type PasswordInputProps = NoctraMockProps;
export type PinCodeProps = NoctraMockProps;
export type PinInputProps = NoctraMockProps;
export type PopoverProps = NoctraMockProps;
export type PortalProps = NoctraMockProps;
export type ProgressProps = NoctraMockProps;
export type ProseProps = NoctraMockProps;
export type RadioProps = NoctraMockProps;
export type RangeSliderProps = NoctraMockProps;
export type RatingProps = NoctraMockProps;
export type ResizablePanelProps = NoctraMockProps;
export type ScrollAreaProps = NoctraMockProps;
export type ScrollLockProps = NoctraMockProps;
export type SearchInputProps = NoctraMockProps;
export type SectionProps = NoctraMockProps;
export type SegmentedControlProps = NoctraMockProps;
export type SelectProps = NoctraMockProps;
export type SidebarProps = NoctraMockProps;
export type SimpleGridProps = NoctraMockProps;
export type SkeletonProps = NoctraMockProps;
export type SliderProps = NoctraMockProps;
export type SpacerProps = NoctraMockProps;
export type SpinnerProps = NoctraMockProps;
export type SplitPaneProps = NoctraMockProps;
export type StackProps = NoctraMockProps;
export type StatusBarProps = NoctraMockProps;
export type StepperProps = NoctraMockProps;
export type SwitchProps = NoctraMockProps;
export type TableOfContentsProps = NoctraMockProps;
export type TableProps = NoctraMockProps;
export type TabsProps = NoctraMockProps;
export type TagsInputProps = NoctraMockProps;
export type TextareaProps = NoctraMockProps;
export type TextInputProps = NoctraMockProps;
export type TimelineProps = NoctraMockProps;
export type ToastProps = NoctraMockProps;
export type ToolbarProps = NoctraMockProps;
export type TooltipProps = NoctraMockProps;
export type TransferListProps = NoctraMockProps;
export type TreeProps = NoctraMockProps;
export type TreeSelectProps = NoctraMockProps;
export type TreeViewProps = NoctraMockProps;
export type VisuallyHiddenProps = NoctraMockProps;

export const Accordion = createNoctraMock("Accordion") as any;
export const Alert = createNoctraMock("Alert") as any;
export const AppShell = createNoctraMock("AppShell") as any;
export const AspectRatio = createNoctraMock("AspectRatio") as any;
export const Autocomplete = createNoctraMock("Autocomplete") as any;
export const Avatar = createNoctraMock("Avatar") as any;
export const Badge = createNoctraMock("Badge") as any;
export const Blockquote = createNoctraMock("Blockquote") as any;
export const Box = createNoctraMock("Box") as any;
export const Breadcrumb = createNoctraMock("Breadcrumb") as any;
export const Breadcrumbs = createNoctraMock("Breadcrumbs") as any;
export const Button = createNoctraMock("Button") as any;
export const Card = createNoctraMock("Card") as any;
export const Center = createNoctraMock("Center") as any;
export const Checkbox = createNoctraMock("Checkbox") as any;
export const ClickOutside = createNoctraMock("ClickOutside") as any;
export const Clipboard = createNoctraMock("Clipboard") as any;
export const Code = createNoctraMock("Code") as any;
export const CodeBlock = createNoctraMock("CodeBlock") as any;
export const ColorInput = createNoctraMock("ColorInput") as any;
export const ColorPicker = createNoctraMock("ColorPicker") as any;
export const Combobox = createNoctraMock("Combobox") as any;
export const Command = createNoctraMock("Command") as any;
export const CommandBar = createNoctraMock("CommandBar") as any;
export const Container = createNoctraMock("Container") as any;
export const ContextMenu = createNoctraMock("ContextMenu") as any;
export const CreditCard = createNoctraMock("CreditCard") as any;
export const DataGrid = createNoctraMock("DataGrid") as any;
export const Dialog = createNoctraMock("Dialog") as any;
export const Divider = createNoctraMock("Divider") as any;
export const Dock = createNoctraMock("Dock") as any;
export const Drawer = createNoctraMock("Drawer") as any;
export const Dropzone = createNoctraMock("Dropzone") as any;
export const EmptyState = createNoctraMock("EmptyState") as any;
export const Flex = createNoctraMock("Flex") as any;
export const FloatLabel = createNoctraMock("FloatLabel") as any;
export const FocusTrap = createNoctraMock("FocusTrap") as any;
export const Footer = createNoctraMock("Footer") as any;
export const FormField = createNoctraMock("FormField") as any;
export const Grid = createNoctraMock("Grid") as any;
export const Group = createNoctraMock("Group") as any;
export const Header = createNoctraMock("Header") as any;
export const Highlight = createNoctraMock("Highlight") as any;
export const HoverCard = createNoctraMock("HoverCard") as any;
export const IconButton = createNoctraMock("IconButton") as any;
export const InlineCode = createNoctraMock("InlineCode") as any;
export const Input = createNoctraMock("Input") as any;
export const Kbd = createNoctraMock("Kbd") as any;
export const Layout = createNoctraMock("Layout") as any;
export const LayoutShell = createNoctraMock("LayoutShell") as any;
export const Link = createNoctraMock("Link") as any;
export const ListBox = createNoctraMock("ListBox") as any;
export const Loader = createNoctraMock("Loader") as any;
export const Menu = createNoctraMock("Menu") as any;
export const Modal = createNoctraMock("Modal") as any;
export const MultiSelect = createNoctraMock("MultiSelect") as any;
export const NativeSelect = createNoctraMock("NativeSelect") as any;
export const Notification = createNoctraMock("Notification") as any;
export const NumberInput = createNoctraMock("NumberInput") as any;
export const Page = createNoctraMock("Page") as any;
export const Pagination = createNoctraMock("Pagination") as any;
export const Paper = createNoctraMock("Paper") as any;
export const PasswordInput = createNoctraMock("PasswordInput") as any;
export const PinCode = createNoctraMock("PinCode") as any;
export const PinInput = createNoctraMock("PinInput") as any;
export const Popover = createNoctraMock("Popover") as any;
export const Portal = createNoctraMock("Portal") as any;
export const Progress = createNoctraMock("Progress") as any;
export const Prose = createNoctraMock("Prose") as any;
export const Radio = createNoctraMock("Radio") as any;
export const RangeSlider = createNoctraMock("RangeSlider") as any;
export const Rating = createNoctraMock("Rating") as any;
export const ResizablePanel = createNoctraMock("ResizablePanel") as any;
export const ScrollArea = createNoctraMock("ScrollArea") as any;
export const ScrollLock = createNoctraMock("ScrollLock") as any;
export const SearchInput = createNoctraMock("SearchInput") as any;
export const Section = createNoctraMock("Section") as any;
export const SegmentedControl = createNoctraMock("SegmentedControl") as any;
export const Select = createNoctraMock("Select") as any;
export const Sidebar = createNoctraMock("Sidebar") as any;
export const SimpleGrid = createNoctraMock("SimpleGrid") as any;
export const Skeleton = createNoctraMock("Skeleton") as any;
export const Slider = createNoctraMock("Slider") as any;
export const Spacer = createNoctraMock("Spacer") as any;
export const Spinner = createNoctraMock("Spinner") as any;
export const SplitPane = createNoctraMock("SplitPane") as any;
export const Stack = createNoctraMock("Stack") as any;
export const StatusBar = createNoctraMock("StatusBar") as any;
export const Stepper = createNoctraMock("Stepper") as any;
export const Switch = createNoctraMock("Switch") as any;
export const Table = createNoctraMock("Table") as any;
export const TableOfContents = createNoctraMock("TableOfContents") as any;
export const Tabs = createNoctraMock("Tabs") as any;
export const TagsInput = createNoctraMock("TagsInput") as any;
export const Textarea = createNoctraMock("Textarea") as any;
export const TextInput = createNoctraMock("TextInput") as any;
export const Timeline = createNoctraMock("Timeline") as any;
export const Toast = createNoctraMock("Toast") as any;
export const Toolbar = createNoctraMock("Toolbar") as any;
export const Tooltip = createNoctraMock("Tooltip") as any;
export const TransferList = createNoctraMock("TransferList") as any;
export const Tree = createNoctraMock("Tree") as any;
export const TreeSelect = createNoctraMock("TreeSelect") as any;
export const TreeView = createNoctraMock("TreeView") as any;
export const VisuallyHidden = createNoctraMock("VisuallyHidden") as any;





export const NoctraProvider = ({ children }: { children?: ReactNode }) => <>{children}</>;

export default DefaultNoctraMock;
