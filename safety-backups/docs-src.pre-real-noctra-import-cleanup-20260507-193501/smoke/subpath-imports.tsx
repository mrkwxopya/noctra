import { Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  IconButton,
  Input,
  Modal,
  Skeleton,
  Spinner,
  Tooltip } from "../components/docs-system/NoctraRuntimeMock";

import { Button as ButtonSubpath } from "@noctra/react/button";
import { IconButton as IconButtonSubpath } from "@noctra/react/icon-button";
import { Card as CardSubpath } from "@noctra/react/card";
import { Input as InputSubpath } from "@noctra/react/input";
import { Badge as BadgeSubpath } from "@noctra/react/badge";
import { Alert as AlertSubpath } from "@noctra/react/alert";
import { Modal as ModalSubpath } from "@noctra/react/modal";
import { Tooltip as TooltipSubpath } from "@noctra/react/tooltip";
import { Spinner as SpinnerSubpath } from "@noctra/react/spinner";
import { Skeleton as SkeletonSubpath } from "@noctra/react/skeleton";
import { Divider as DividerSubpath } from "@noctra/react/divider";
import { Avatar as AvatarSubpath } from "@noctra/react/avatar";
import { NoctraProvider } from "@noctra/react/providers";

export function SubpathImportSmokeTest() {
  return (
    <NoctraProvider>
      <Button>Root</Button>
      <ButtonSubpath>Subpath</ButtonSubpath>
      <IconButton label="Settings" icon={<span aria-hidden="true">⚙</span>} />
      <IconButtonSubpath label="Settings subpath" icon={<span aria-hidden="true">⚙</span>} />
      <Card />
      <CardSubpath />
      <Input />
      <InputSubpath />
      <Badge>Badge</Badge>
      <BadgeSubpath>Badge</BadgeSubpath>
      <Alert>Alert</Alert>
      <AlertSubpath>Alert</AlertSubpath>
      <Modal opened={false} />
      <ModalSubpath opened={false} />
      <Tooltip content="Tooltip"><span>Trigger</span></Tooltip>
      <TooltipSubpath content="Tooltip"><span>Trigger</span></TooltipSubpath>
      <Spinner />
      <SpinnerSubpath />
      <Skeleton />
      <SkeletonSubpath />
      <Divider />
      <DividerSubpath />
      <Avatar name="Noctra" />
      <AvatarSubpath name="Noctra" />
    </NoctraProvider>
  );
}
